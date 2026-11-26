import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, TrendingUp } from "lucide-react";
import MemberLayout from "../../components/MemberLayout";
import ProgressChart from "../../components/ProgressChart";
import CountUp from "../../components/CountUp";
import { progressByMonth, metrics, latestSession, trainerMessage } from "../../data/progress";

// status: "scheduled" | "started" | "no-show"  (the backend will decide which one applies)
const statuses = {
  scheduled: { chip: "Scheduled", cls: "bg-[#1e3a6e] text-blue-100", text: "Waiting for your trainer to acknowledge attendance.", foot: `Trainer: ${latestSession.trainer}` },
  started: { chip: "Started", cls: "bg-[#14532d]/80 text-green-300", text: "Your session has started. Your trainer acknowledged your attendance.", foot: `Recorded by ${latestSession.trainer}` },
  "no-show": { chip: "No show", cls: "bg-[#5b1f2a]/80 text-red-300", text: `You were marked as a no-show. Contact ${latestSession.trainer.split(" ")[0]} if this is incorrect.`, foot: `Recorded by ${latestSession.trainer}` },
};

const side = "animate-fade-up rounded-[20px] border border-[#2b394c] bg-[#1f2937]/95 p-4";

export default function ProgressPage({ status = "scheduled" }) {
  const [monthKey, setMonthKey] = useState("November 2026");
  const { month, points, xTicks } = progressByMonth[monthKey];
  const s = statuses[status];

  return (
    <MemberLayout pageTitle="Progress" PageIcon={TrendingUp}>
      {/* Preview switcher for the three session states. Remove once the backend supplies the status. */}
      <div className="mb-3 flex flex-wrap items-center gap-2 font-sans text-xs text-white/60">
        Preview session state:
        {[["", "Scheduled"], ["/started", "Started"], ["/no-show", "No show"]].map(([path, label]) => (
          <NavLink key={label} end to={`/member/progress${path}`} className={({ isActive }) => `rounded-full px-3 py-1 transition ${isActive ? "bg-blue-500 text-white" : "bg-white/10 hover:bg-white/20"}`}>{label}</NavLink>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <section style={{ animationDelay: "100ms" }} className="animate-fade-up rounded-[28px] border border-[#2b394c] bg-[#0b1730]/80 p-4 lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-3 font-sans text-2xl font-semibold text-slate-200">
              <TrendingUp className="h-8 w-8 text-blue-500" /> Muscle Gain <span className="text-blue-500">Progress</span>
            </h2>
            <label className="relative">
              <select value={monthKey} onChange={(e) => setMonthKey(e.target.value)} className="appearance-none rounded-full border border-blue-500/60 bg-[#0f1b33] py-2 pl-5 pr-10 font-sans text-sm outline-none">
                {Object.keys(progressByMonth).map((k) => <option key={k}>{k}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4" />
            </label>
          </div>
          <div className="mt-3"><ProgressChart key={monthKey} points={points} month={month} xTicks={xTicks} /></div>
        </section>

        <div className="flex flex-col gap-4 font-sans">
          {/* key={status} replays the animations when the preview state changes */}
          <section key={`s-${status}`} className={side} style={{ animationDelay: "160ms" }}>
            <p className="text-[10px] tracking-wide text-white/60">LATEST SESSION</p>
            <p className="mt-1 text-lg font-semibold">{latestSession.title}</p>
            <p className="text-xs text-white/60">{latestSession.when}</p>
            <span className={`animate-pop-in mt-3 inline-block rounded-full px-4 py-1 text-xs ${s.cls}`} style={{ animationDelay: "400ms" }}>{s.chip}</span>
          </section>
          <section key={`a-${status}`} className={`${side} flex min-h-[120px] flex-col`} style={{ animationDelay: "260ms" }}>
            <p className="font-semibold">Attendance update</p>
            <p className="mt-1 text-sm text-white/70">{s.text}</p>
            <p className="mt-auto pt-3 text-xs text-white/60">{s.foot}</p>
          </section>
          <div className="grid grid-cols-2 gap-2 rounded-[20px] bg-[#1f2937]/95 p-2">
            {metrics.map((m, i) => (
              <div key={m.label} style={{ animationDelay: `${420 + i * 90}ms` }} className="animate-pop-in rounded-[26px] border border-white/25 bg-gradient-to-br from-[#3a5a8c]/55 to-[#243b5e]/55 px-4 py-2">
                <p className="text-[10px] text-white/70">{m.label}</p>
                <p className="text-2xl font-bold">
                  <CountUp to={m.value} delay={500 + i * 90} />
                  {m.unit && <span className="ml-1 text-xs font-normal text-white/70">{m.unit}</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section style={{ animationDelay: "560ms" }} className="animate-fade-up mt-5 rounded-[28px] border border-[#2b394c] bg-[#1f2937]/95 px-6 py-4">
        <h3 className="font-display text-3xl">Trainer Message:</h3>
        <p className="mt-1">{trainerMessage}</p>
      </section>
    </MemberLayout>
  );
}
