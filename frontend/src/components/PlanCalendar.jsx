import { ChevronLeft, ChevronRight } from "lucide-react";
import { iso } from "../data/workoutPlans";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Dot({ className }) {
  return <span className={`h-1.5 w-1.5 rounded-full ${className}`} />;
}

export default function PlanCalendar({ year, month, selected, todayIso, planFor, holidays, pending, onSelect, onPrev, onNext }) {
  const first = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
  const label = new Date(year, month).toLocaleString("en-US", { month: "long" });

  return (
    <div>
      <div className="flex items-center justify-between">
        <button onClick={onPrev} aria-label="Previous month" className="rounded-full p-1 transition hover:bg-white/10 active:scale-90">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <p key={`${year}-${month}`} className="animate-fade-up font-display text-lg">{label} {year}</p>
        <button onClick={onNext} aria-label="Next month" className="rounded-full p-1 transition hover:bg-white/10 active:scale-90">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 bg-[#526176]/65 py-1 text-center font-display text-base">
        {WEEKDAYS.map((d) => <span key={d}>{d}</span>)}
      </div>

      {/* key remounts the grid on month change so the days pop in again */}
      <div key={`${year}-${month}`} className="mt-2 grid grid-cols-7 gap-y-1 text-center font-display">
        {cells.map((day, i) => {
          if (!day) return <span key={`b${i}`} />;
          const id = iso(new Date(year, month, day));
          const isSel = id === selected;
          return (
            <div key={id} style={{ animationDelay: `${i * 14}ms` }} className="animate-pop-in flex justify-center">
              <button
                onClick={() => onSelect(id)}
                aria-pressed={isSel}
                className={`flex h-10 w-10 flex-col items-center justify-center rounded-full leading-none transition hover:bg-white/10 active:scale-90 ${
                  isSel ? "bg-blue-500/30 text-blue-400 ring-1 ring-blue-400" : ""
                } ${id === todayIso && !isSel ? "ring-1 ring-white/50" : ""}`}
              >
                {day}
                <span className="mt-1 flex h-1.5 gap-0.5">
                  {planFor(id) && <Dot className="bg-blue-400" />}
                  {holidays[id] && <Dot className="bg-red-400" />}
                  {pending[id] && <Dot className="bg-yellow-300" />}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/70">
        <span className="flex items-center gap-1.5"><Dot className="bg-blue-400" /> Workout</span>
        <span className="flex items-center gap-1.5"><Dot className="bg-red-400" /> Public holiday</span>
        <span className="flex items-center gap-1.5"><Dot className="bg-yellow-300" /> Reschedule pending</span>
      </div>
    </div>
  );
}
