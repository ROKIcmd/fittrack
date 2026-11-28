import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import TrainerShell from "../../components/TrainerShell";
import AnimatedLineChart from "../../components/trainer/AnimatedLineChart";
import { Button, Card, CountUp, Notice, SearchInput, SelectInput, cx } from "../../components/trainer/TrainerUI";
import { MONTH_NAMES, saveMetric, useTrainerStore } from "../../data/trainerStore";

// Body Metrics  ->  route: /trainer/body-metrics and /trainer/members/:memberId/progress
// Figma frame "Trainer / Metrics Updates" (125:651), 1279 x 900.
// (The Figma header copy says "Rescheduling"; this page is titled "Body Metrics".)

const CHART_YEAR = 2026;
const CHART_MONTH = 10; // November
const X_TICKS = [1, 7, 14, 21, 28, 30].map((x) => ({ x, label: `Nov ${x}` }));

const MEMBER_ID_ALIASES = {
  "M-TEST-001": "juan",
  "M-002": "ana",
  "M-003": "maria",
  "M-004": "carlo",
};

const tile = "rounded-[25px] bg-[#1f2937]";
const field =
  "h-[30px] w-full rounded-[8px] bg-[#526176]/65 px-2 text-xs text-[#f8fafc] outline-none transition placeholder:text-white/30 hover:bg-[#526176]/80 focus:ring-2 focus:ring-[#3b82f6]/70";
const COLS = "grid grid-cols-[96px_90px_100px_90px_70px_minmax(190px,1fr)] items-center gap-x-3";

const lastFirst = (name) => {
  const [first, ...rest] = name.split(" ");
  return rest.length ? `${rest.join(" ")}, ${first}` : first;
};

function StatTile({ label, value, unit, decimals = 1 }) {
  return (
    <Card as="div" className={cx(tile, "flex h-[68px] flex-col px-[23px] pt-1")}>
      <span className="whitespace-nowrap text-sm leading-[17px] text-white/50">{label}</span>
      <span className="flex items-baseline justify-center gap-1">
        <span className="text-[25px] font-bold leading-none tabular-nums text-white">
          {value === null ? "—" : <CountUp key={value} value={value} decimals={decimals} />}
        </span>
        {unit && <span className="text-sm text-white/50">{unit}</span>}
      </span>
    </Card>
  );
}

const EMPTY_FORM = { weight: "", fat: "", muscle: "", bmi: "", notes: "" };

export default function TrainerBodyMetrics() {
  const { memberId } = useParams();
  const { clients, metrics } = useTrainerStore();

  const resolveClientId = (param) => {
    if (!param) return "juan";
    const direct = clients.find((c) => c.id === param);
    if (direct) return direct.id;
    const aliased = MEMBER_ID_ALIASES[param];
    if (aliased && clients.some((c) => c.id === aliased)) return aliased;
    return "juan";
  };

  const [clientId, setClientId] = useState(() => resolveClientId(memberId));
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [bmiTouched, setBmiTouched] = useState(false);
  const [message, setMessage] = useState(null);
  const [month, setMonth] = useState("November 2026");

  useEffect(() => {
    if (memberId) {
      setClientId(resolveClientId(memberId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId]);

  const client = clients.find((c) => c.id === clientId) ?? clients[0];
  const { chart, history } = metrics[client.id] ?? { chart: [], history: [] };
  const latest = history[0];

  const shownClients = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return clients.filter((c) => !needle || `${c.name} ${c.goal}`.toLowerCase().includes(needle));
  }, [clients, query]);

  const points = useMemo(() => chart.map((p) => ({ x: p.day, y: p.y, label: `Nov ${p.day}` })), [chart]);

  const pick = (id) => {
    setClientId(id);
    setForm(EMPTY_FORM);
    setBmiTouched(false);
    setMessage(null);
  };

  const change = (key) => (event) => {
    const value = event.target.value;
    setMessage(null);
    setForm((f) => {
      const next = { ...f, [key]: value };
      // BMI follows weight while the trainer hasn't typed their own.
      if (key === "weight" && !bmiTouched && client.heightM && Number(value) > 0) {
        next.bmi = (Number(value) / client.heightM ** 2).toFixed(1);
      }
      return next;
    });
    if (key === "bmi") setBmiTouched(true);
  };

  const submit = (event) => {
    event.preventDefault();
    const nums = ["weight", "fat", "muscle", "bmi"].map((k) => Number(form[k]));
    if (nums.some((n, i) => !form[["weight", "fat", "muscle", "bmi"][i]] || !Number.isFinite(n) || n <= 0)) {
      return setMessage({ tone: "error", text: "Enter weight, body fat, muscle mass and BMI as positive numbers." });
    }
    if (nums[1] > 60) return setMessage({ tone: "error", text: "Body fat should be a percentage under 60." });

    const now = new Date();
    const date = `${MONTH_NAMES[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    const inChart = now.getFullYear() === CHART_YEAR && now.getMonth() === CHART_MONTH;
    saveMetric(client.id, {
      day: inChart ? now.getDate() : -1,
      muscle: form.muscle,
      row: { date, weight: form.weight, fat: form.fat, muscle: form.muscle, bmi: form.bmi, note: form.notes.trim() || "—" },
    });
    setForm(EMPTY_FORM);
    setBmiTouched(false);
    setMessage({
      tone: "success",
      text: `Saved for ${client.name}${inChart ? "" : " (the chart only shows November 2026)"}. Kept in this browser session only (no backend yet).`,
    });
  };

  return (
    <TrainerShell
      breadcrumb="Body Metrics"
      title="Body Metrics"
      subtitle="Track measurements and progress for each client."
    >
      <div className="grid gap-[10px] pt-[13px] lg:grid-cols-[231px_minmax(0,1fr)] lg:gap-x-[16px]">
        {/* ---- My clients ---- */}
        <Card className="flex flex-col px-5 pb-5 pt-[18px] lg:h-[390px]" delay={60}>
          <h2 className="text-[19px] font-semibold leading-7">My clients</h2>
          <SearchInput value={query} onChange={setQuery} placeholder="Search clients by name…" label="Search clients" className="mt-3" />
          <p className="mt-[19px] border-b border-[#374658] pb-[9px] text-[10px] font-semibold leading-[15px] text-[#afbdcf]">CLIENT / GOAL</p>
          <ul className="min-h-0 flex-1 overflow-y-auto">
            {shownClients.map((c) => (
              <li key={c.id} className="border-b border-[#374658]">
                <button
                  type="button"
                  aria-pressed={c.id === client.id}
                  onClick={() => pick(c.id)}
                  className={cx(
                    "-mx-1 block w-[calc(100%+8px)] rounded-[10px] px-1 py-[8px] text-left transition duration-200 focus-visible:ring-2 focus-visible:ring-[#3b82f6]/70 focus-visible:outline-none",
                    c.id === client.id ? "bg-[#243e63]/30" : "hover:bg-white/[0.04]",
                  )}
                >
                  <span className="block text-[13px] font-medium leading-[19px]">{c.name}</span>
                  <span className="block text-[10px] leading-[15px] text-[#afbdcf]">{c.goal}</span>
                </button>
              </li>
            ))}
            {shownClients.length === 0 && <li className="pt-3 text-xs text-[#afbdcf]">No clients match.</li>}
          </ul>
          <div className="flex items-center justify-between gap-2 pt-3 text-[11px] leading-4">
            <span className="text-[#afbdcf]">
              {shownClients.length === clients.length ? `Showing all ${clients.length} assigned clients` : `Showing ${shownClients.length} of ${clients.length}`}
            </span>
          </div>
        </Card>

        {/* ---- Right column ---- */}
        <div className="flex min-w-0 flex-col gap-[10px]">
          <Card className={cx(tile, "flex flex-wrap items-center justify-between gap-3 px-[17px] py-[14px] lg:min-h-[106px]")} delay={100}>
            <div key={client.id} className="animate-fade-in">
              <h2 className="text-[25px] font-bold leading-[31px] text-[#3b82f6]">{lastFirst(client.name)}</h2>
              <p className="mt-1 text-base text-white/50">
                Height: {client.heightM ? `${client.heightM}m` : "—"} | Target: {client.targetKg ? `${client.targetKg}kg` : "—"} | Last Update: {latest ? latest.date : "none yet"}
              </p>
            </div>
            <div className="flex gap-2 text-[11px] font-semibold">
              <Link to="/trainer/workout-plans" className="rounded-full bg-[#2c3a4d] px-4 py-2 text-[#f8fafc] transition hover:bg-[#364860]">Workout plan</Link>
              <Link to="/trainer/diet-plans" className="rounded-full bg-[#2c3a4d] px-4 py-2 text-[#f8fafc] transition hover:bg-[#364860]">Diet plan</Link>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-[10px] lg:grid-cols-[179fr_187fr_187fr_187fr] lg:gap-3">
            <StatTile label="Current Weight" value={latest ? Number(latest.weight) : null} unit="kg" />
            <StatTile label="Body fat %" value={latest ? Number(latest.fat) : null} unit="%" />
            <StatTile label="Muscle mass" value={latest ? Number(latest.muscle) : null} unit="kg" />
            <StatTile label="BMI Index" value={latest ? Number(latest.bmi) : null} />
          </div>

          <div className="grid gap-[10px] lg:grid-cols-[minmax(0,1fr)_318px] lg:gap-3">
            {/* chart */}
            <Card className="relative rounded-[25px] border border-[#1d3557]/70 bg-gradient-to-b from-[#0d1b30] to-[#091322] px-4 pb-3 pt-[14px] shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)] lg:min-h-[233px]" delay={200}>
              <div className="flex items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 text-sm font-bold">
                  <TrendingUp className="size-5 text-[#3b82f6]" strokeWidth={2} aria-hidden="true" />
                  <span>
                    Muscle Gain <span className="text-[#3b82f6]">Progress</span>
                  </span>
                </h2>
                <SelectInput
                  label="Month"
                  value={month}
                  onChange={setMonth}
                  options={["November 2026"]}
                  className="!h-6 !w-[118px] !justify-center !rounded-full border border-[#2c3a4d] !bg-transparent !px-2 !text-[9px]"
                />
              </div>
              {points.length ? (
                <div className="mt-[6px]">
                  <AnimatedLineChart
                    points={points}
                    xTicks={X_TICKS}
                    yLabel="Muscle mass (kg)"
                    unit="kg"
                    ariaLabel={`Muscle mass for ${client.name} in ${month}`}
                    replayKey={`${client.id}-${points.length}`}
                  />
                </div>
              ) : (
                <div className="grid h-[170px] place-items-center text-center text-xs text-[#afbdcf]">
                  <p className="animate-fade-up">No measurements yet.<br />Save the first update to start the chart.</p>
                </div>
              )}
            </Card>

            {/* form */}
            <Card as="form" onSubmit={submit} noValidate className={cx(tile, "px-6 pb-4 pt-[14px] lg:min-h-[233px]")} delay={260}>
              <h2 className="text-lg font-bold leading-[22px]">Client Body Metrics</h2>
              <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-[3px] px-[2px]">
                {[
                  ["weight", "Weight (kg)"],
                  ["fat", "Body fat (%)"],
                  ["muscle", "Muscle mass (kg)"],
                  ["bmi", "BMI"],
                ].map(([key, label]) => (
                  <label key={key} className="block text-xs leading-[14px] text-white/50">
                    {label}
                    <input inputMode="decimal" value={form[key]} onChange={change(key)} className={cx(field, "mt-[2px]")} />
                  </label>
                ))}
                <label className="col-span-2 block text-xs leading-[14px] text-white/50">
                  Trainer notes
                  <input value={form.notes} onChange={change("notes")} className={cx(field, "mt-[2px]")} />
                </label>
              </div>
              <Button type="submit" variant="primary" className="mx-auto mt-3 !h-[26px] !rounded-[8px] px-0 w-[158px] !text-xs">
                Save Metric Update
              </Button>
            </Card>
          </div>
          {message && <Notice tone={message.tone}>{message.text}</Notice>}

          {/* history */}
          <Card className={cx(tile, "px-[25px] pb-5 pt-[14px] lg:min-h-[240px]")} delay={320}>
            <h2 className="text-xs font-bold">Measurement History</h2>
            <div className="mt-[14px] overflow-x-auto">
              <div className="min-w-[640px]">
                <div className={cx(COLS, "h-7 rounded-[4px] bg-[#17212f] px-[9px] text-xs font-bold")}>
                  {["DATE", "WEIGHT", "BODY FAT", "MUSCLE", "BMI", "TRAINER NOTE"].map((h) => (
                    <span key={h}>{h}</span>
                  ))}
                </div>
                <ul className="max-h-[190px] overflow-y-auto">
                  {history.map((row, index) => (
                    <li
                      key={row.id}
                      className={cx(COLS, "animate-fade-up h-[30px] px-[9px] text-[10px] tabular-nums transition-colors hover:bg-white/[0.04]")}
                      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
                    >
                      <span>{row.date}</span>
                      <span>{row.weight}kg</span>
                      <span>{row.fat}%</span>
                      <span>{row.muscle}kg</span>
                      <span>{row.bmi}</span>
                      <span className="truncate" title={row.note}>{row.note}</span>
                    </li>
                  ))}
                  {history.length === 0 && <li className="px-[9px] pt-4 text-xs text-[#afbdcf]">No measurements recorded for {client.name} yet.</li>}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </TrainerShell>
  );
}
