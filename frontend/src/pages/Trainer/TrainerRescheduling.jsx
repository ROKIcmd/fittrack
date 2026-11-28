import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TrainerShell from "../../components/TrainerShell";
import { Button, Card, Divider, Notice, Pill, SearchInput, SelectInput, TextArea, cx } from "../../components/trainer/TrainerUI";
import { formatDay, formatRange, formatShort, resolveRequest, useTrainerStore } from "../../data/trainerStore";

// Rescheduling  ->  route: /trainer/rescheduling
// Figma frame "Trainer / Rescheduling" (94:119), 1279 x 900.

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

const received = (min) => (min < 60 ? `${min} min ago` : min < 120 ? "1 hour ago" : `${Math.round(min / 60)} hours ago`);
const STATUS = {
  approved: { tone: "success", label: "Approved" },
  declined: { tone: "danger", label: "Declined" },
  suggested: { tone: "info", label: "Time suggested" },
};

function SessionBox({ label, iso, minutes, requested }) {
  return (
    <div className={cx("rounded-xl px-[15px] pb-[14px] pt-[13px] transition-colors", requested ? "bg-[#20395a]" : "bg-[#17212f]")}>
      <p className={cx("text-[10px] font-semibold leading-[15px]", requested ? "text-[#a8ceff]" : "text-[#afbdcf]")}>{label}</p>
      <p className="mt-[10px] text-sm font-medium leading-5">{formatDay(iso)}</p>
      <p className={cx("mt-[10px] text-[13px] leading-[19px]", requested ? "text-[#a8ceff]" : "text-[#afbdcf]")}>{formatRange(iso, minutes)}</p>
    </div>
  );
}

function RequestCard({ request, name, selected, onSelect, index }) {
  const status = STATUS[request.status];
  return (
    <li className="animate-fade-up" style={{ animationDelay: `${index * 70}ms` }}>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={cx(
          "block h-[140px] w-full rounded-xl border px-[14px] pt-[11px] text-left transition duration-200 focus-visible:ring-2 focus-visible:ring-[#3b82f6]/70 focus-visible:outline-none",
          selected ? "border-[#3b82f6] bg-[#263d5c]" : "border-transparent bg-[#17212f] hover:-translate-y-px hover:bg-[#1b2a3c]",
        )}
      >
        <span className="flex items-start justify-between gap-3">
          <span className="text-sm font-semibold leading-5">{name}</span>
          <span className={cx("mt-1 text-[10px] font-medium leading-[15px]", status ? "text-[#afbdcf]" : "text-[#f8cf7d]")}>
            {status ? status.label : "Pending"}
          </span>
        </span>
        <span className="mt-[5px] block text-[11px] leading-4 text-[#afbdcf]">
          {request.title} · {request.minutes} min
        </span>
        <span className="mt-3 grid grid-cols-[48px_1fr] gap-y-[5px] text-[11px] leading-4">
          <span className="text-[#afbdcf]">From:</span>
          <span className="text-[#afbdcf]">{formatShort(request.from)}</span>
          <span className="text-[#afbdcf]">To:</span>
          <span className="font-medium text-[#9fc8ff]">{formatShort(request.to)}</span>
        </span>
        <span className="mt-[13px] block text-[9px] leading-[13px] text-[#afbdcf]">Received {received(request.receivedMin)}</span>
      </button>
    </li>
  );
}

export default function TrainerRescheduling() {
  const { clients, requests } = useTrainerStore();
  const [tab, setTab] = useState("pending");
  const [sort, setSort] = useState("newest");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("r1");
  const [reply, setReply] = useState("");
  const [suggesting, setSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [result, setResult] = useState("");

  const clientOf = (id) => clients.find((c) => c.id === id);
  const pending = requests.filter((r) => r.status === "pending");
  const handled = requests.filter((r) => r.status !== "pending");
  const source = tab === "pending" ? pending : handled;

  const list = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = source.filter((r) => !needle || `${clientOf(r.clientId)?.name} ${r.title}`.toLowerCase().includes(needle));
    return rows.sort((a, b) => (sort === "newest" ? a.receivedMin - b.receivedMin : b.receivedMin - a.receivedMin));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, query, sort, clients]);

  const selected = requests.find((r) => r.id === selectedId && source.includes(r)) ?? list[0];

  // Reset the reply box whenever a different request is opened.
  useEffect(() => {
    setReply("");
    setSuggesting(false);
    setSuggestion(selected?.to ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  const respond = (status) => {
    const client = clientOf(selected.clientId);
    const next = pending.find((r) => r.id !== selected.id);
    resolveRequest(selected.id, status, reply.trim(), status === "suggested" ? suggestion : "");
    setResult(
      {
        approved: `Approved. ${client.name}’s next session is now ${formatShort(selected.to)}.`,
        declined: `Declined. ${client.name} keeps the ${formatShort(selected.from)} session.`,
        suggested: `Suggested ${formatShort(suggestion)} to ${client.name}.`,
      }[status] + " Recorded in this session only; nothing was sent to the client (no backend yet).",
    );
    if (next) setSelectedId(next.id);
  };

  const client = selected && clientOf(selected.clientId);
  const conflictWith = selected && clients.find((c) => c.id !== selected.clientId && c.nextSession === formatShort(selected.to));
  const open = selected?.status === "pending";
  const status = selected && STATUS[selected.status];

  return (
    <TrainerShell
      breadcrumb="Rescheduling"
      title="Rescheduling"
      subtitle="Review requested changes and keep your schedule on track."
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Request status" className="flex gap-2">
          {[
            ["pending", "Pending", pending.length, "w-[231px] max-sm:w-auto max-sm:px-6"],
            ["handled", "Handled", handled.length, "w-[110px]"],
          ].map(([id, label, count, width]) => (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={tab === id}
              onClick={() => {
                setTab(id);
                setSelectedId("");
              }}
              className={cx(
                "h-[38px] rounded-[19px] text-xs font-semibold transition duration-200 focus-visible:ring-2 focus-visible:ring-[#3b82f6]/70 focus-visible:outline-none",
                width,
                tab === id ? "bg-[#284b7a] text-[#a8ceff]" : "bg-[#1f2937] text-[#afbdcf] hover:bg-[#263548]",
              )}
            >
              {label} <span key={count} className="animate-pop-in inline-block pl-1">{count}</span>
            </button>
          ))}
        </div>
        <span className="text-[10px] leading-[15px] text-[#afbdcf]">Last updated just now</span>
      </div>

      <div className="mt-[18px] grid gap-[18px] lg:grid-cols-[390px_minmax(0,1fr)]">
        {/* ---- Requests ---- */}
        <Card className="flex flex-col px-5 pb-5 pt-5 lg:h-[647px]" delay={80}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold leading-[26px]">Requests</h2>
            <SelectInput
              label="Sort requests"
              value={sort}
              onChange={setSort}
              options={SORTS}
              className="!h-6 !bg-transparent !px-1 !text-[10px] text-[#afbdcf] hover:!bg-[#17212f]"
            />
          </div>
          <SearchInput value={query} onChange={setQuery} placeholder="Search client or session…" label="Search requests" className="mt-[17px]" />

          <ul className="mt-[18px] flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-px">
            {list.map((request, index) => (
              <RequestCard
                key={request.id}
                request={request}
                index={index}
                name={clientOf(request.clientId)?.name}
                selected={request.id === selected?.id}
                onSelect={() => setSelectedId(request.id)}
              />
            ))}
            {list.length === 0 && (
              <li className="animate-fade-in rounded-xl bg-[#17212f] p-5 text-xs leading-[18px] text-[#afbdcf]">
                {query ? `No requests match “${query}”.` : tab === "pending" ? "You’re all caught up. No pending requests." : "Nothing handled yet."}
              </li>
            )}
          </ul>
          <p className="pt-4 text-[11px] leading-4 text-[#afbdcf]">
            {tab === "pending" ? `All ${pending.length} pending requests are shown.` : `${handled.length} handled this session.`}
          </p>
        </Card>

        {/* ---- Request details ---- */}
        <Card className="flex flex-col px-6 pb-5 pt-5 lg:h-[647px]" delay={140}>
          {selected ? (
            <div key={selected.id} className="animate-fade-in flex min-h-0 flex-1 flex-col">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[19px] font-semibold leading-7">Request details</h2>
                <Pill tone={status?.tone ?? "warn"} className="h-[25px] min-w-[124px] rounded-[13px]">
                  {status ? status.label : "Pending review"}
                </Pill>
              </div>
              <Divider className="mt-4" />

              <h3 className="mt-[17px] text-xl font-semibold leading-[29px]">{client?.name}</h3>
              <p className="text-xs leading-[17px] text-[#afbdcf]">
                {selected.title} · {selected.minutes}-minute personal training
              </p>

              <div className="mt-[26px] grid gap-4 sm:grid-cols-2">
                <SessionBox label="CURRENT SESSION" iso={selected.from} minutes={selected.minutes} />
                <SessionBox label="REQUESTED SESSION" iso={selected.to} minutes={selected.minutes} requested />
              </div>

              <p className="mt-[21px] text-xs font-medium leading-[17px] text-[#afbdcf]">Reason for rescheduling</p>
              <p className="mt-[10px] text-[13px] leading-[19px]">{selected.reason ? `“${selected.reason}”` : <span className="text-[#afbdcf]">No reason provided.</span>}</p>

              {conflictWith ? (
                <div className="mt-[18px] rounded-[11px] bg-[#453923] px-4 py-[10px]">
                  <p className="text-xs font-semibold leading-[17px] text-[#f8cf7d]">Schedule conflict</p>
                  <p className="mt-[6px] text-[11px] leading-4 text-[#e6d3a6]">
                    {conflictWith.name} already has a session on {formatShort(selected.to)}.
                  </p>
                </div>
              ) : (
                <div className="mt-[18px] rounded-[11px] bg-[#18352d] px-4 py-[10px]">
                  <p className="text-xs font-semibold leading-[17px] text-[#8ce3b1]">No schedule conflict</p>
                  <p className="mt-[6px] text-[11px] leading-4 text-[#b5d8c4]">
                    You’re available on {formatShort(selected.to).split(",")[0]} from {formatRange(selected.to, selected.minutes)}.
                  </p>
                </div>
              )}

              {suggesting && open && (
                <div className="animate-pop-in mt-4 flex flex-wrap items-end gap-3 rounded-xl bg-[#17212f] p-3">
                  <label className="text-[11px] font-medium text-[#afbdcf]">
                    Suggested time
                    <input
                      type="datetime-local"
                      value={suggestion}
                      onChange={(e) => setSuggestion(e.target.value)}
                      className="mt-1 block h-9 rounded-[8px] bg-[#1f2937] px-3 text-xs text-[#f8fafc] outline-none [color-scheme:dark] focus:ring-2 focus:ring-[#3b82f6]/70"
                    />
                  </label>
                  <Button variant="primary" disabled={!suggestion || suggestion === selected.to} onClick={() => respond("suggested")}>
                    Send suggestion
                  </Button>
                </div>
              )}

              <label className="mt-[19px] block text-[11px] font-medium leading-4 text-[#afbdcf]" htmlFor="rs-reply">
                {open ? "Reply to client (optional)" : "Your reply"}
              </label>
              <TextArea
                id="rs-reply"
                rows={2}
                disabled={!open}
                value={open ? reply : selected.reply || ""}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Add a note about this schedule change…"
                className="mt-[9px] h-[54px] !rounded-[9px] px-[13px] disabled:opacity-60"
              />

              <div className="mt-auto">
                <Divider />
                <div className="flex flex-wrap gap-3 pt-[19px]">
                  <Button size="sm" disabled={!open} className="w-[100px]" onClick={() => respond("declined")}>
                    Decline
                  </Button>
                  <Button size="sm" disabled={!open} className="w-[196px]" onClick={() => setSuggesting((v) => !v)}>
                    Suggest another time
                  </Button>
                  <Button variant="primary" size="sm" disabled={!open || Boolean(conflictWith)} className="min-w-[160px] flex-1" onClick={() => respond("approved")}>
                    Approve request
                  </Button>
                </div>
                {result ? (
                  <Notice tone="success" className="mt-3">{result}</Notice>
                ) : (
                  <p className="mt-[14px] text-[10px] leading-[15px] text-[#afbdcf]">The client will be notified when you respond.</p>
                )}
                {result && (
                  <p className="mt-2 text-[10px] leading-[15px] text-[#afbdcf]">
                    <Link to="/trainer/schedule" className="font-semibold text-[#8cbaff] hover:text-[#b3d1ff]">View my schedule →</Link>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid flex-1 place-items-center text-center">
              <div className="animate-fade-up">
                <p className="text-[19px] font-semibold">All caught up</p>
                <p className="mt-2 text-xs text-[#afbdcf]">No request is selected. New requests will appear in the list.</p>
                {result && <Notice tone="success" className="mt-4 max-w-sm">{result}</Notice>}
              </div>
            </div>
          )}
        </Card>
      </div>
    </TrainerShell>
  );
}
