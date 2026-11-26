import { fmtDate } from "../data/workoutPlans";

const stagger = (ms) => ({ animationDelay: `${ms}ms` });
const rise = "animate-fade-up";

// Render with key={dateIso} so the entrance animation replays on every selection.
export default function PlanDetails({ dateIso, plan, holiday, request }) {
  return (
    <div className="max-h-[190px] overflow-y-auto pr-2 [scrollbar-color:white_transparent] [scrollbar-width:thin]">
      <p style={stagger(0)} className={`${rise} mb-1 text-sm text-white/70`}>
        {fmtDate(dateIso, { weekday: "long", month: "long", day: "numeric" })}
      </p>
      {holiday && (
        <p style={stagger(40)} className={`${rise} mb-2 rounded-xl bg-red-500/15 px-3 py-1.5 text-sm text-red-300`}>
          Public holiday: {holiday}
        </p>
      )}
      {request && (
        <p style={stagger(70)} className={`${rise} mb-2 rounded-xl bg-yellow-300/15 px-3 py-1.5 text-sm text-yellow-200`}>
          Reschedule requested to {fmtDate(request.newDate)}, {request.slot} (pending trainer approval)
        </p>
      )}
      {plan ? (
        <>
          <p style={stagger(90)} className={rise}>Goal: {plan.goal} ({plan.title}, {plan.time})</p>
          <p style={stagger(130)} className={rise}>Exercises/Reps/Sets:</p>
          <ul className="list-disc pl-6">
            {plan.exercises.map((e, i) => (
              <li key={e.name} style={stagger(170 + i * 70)} className={rise}>
                {e.name}/{e.reps} reps/{e.sets} sets
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p style={stagger(90)} className={rise}>Rest day. Recover, stretch and stay hydrated.</p>
      )}
    </div>
  );
}
