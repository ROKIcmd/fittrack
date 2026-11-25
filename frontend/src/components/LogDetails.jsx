import StatusBadge from "./StatusBadge";

const stagger = (ms) => ({ animationDelay: `${ms}ms` });

function Divider({ delay = 0 }) {
  return (
    <hr
      style={stagger(delay)}
      className="animate-grow-x my-3 origin-left border-0 border-t-4 border-[#3b4a60]"
    />
  );
}

export default function LogDetails({ log }) {
  if (!log) {
    return <p className="mt-8 text-center text-white/70">Select a log to see its details.</p>;
  }
  const { goal, exercises, diet, note, status } = log;
  const exerciseStart = 160;
  const dietStart = exerciseStart + exercises.length * 70 + 120;

  return (
    <div className="flex h-full flex-col">
      <div className="animate-fade-in flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-white">Details</h2>
        <StatusBadge status={status} />
      </div>
      <Divider />

      <div className="min-h-0 flex-1 overflow-y-auto pr-2 [scrollbar-color:white_transparent] [scrollbar-width:thin]">
        {note && (
          <p style={stagger(60)} className="animate-fade-up mb-3 rounded-xl bg-white/10 px-3 py-2 text-sm text-white/90">
            {note}
          </p>
        )}
        <p style={stagger(80)} className="animate-fade-up">Goal: {goal}</p>
        <p style={stagger(120)} className="animate-fade-up">Exercises/Reps/Sets:</p>
        <ul className="list-disc pl-6">
          {exercises.map((e, i) => (
            <li key={e.name} style={stagger(exerciseStart + i * 70)} className="animate-fade-up">
              {e.name}/{e.reps} reps/{e.sets} sets
            </li>
          ))}
        </ul>

        <h3 style={stagger(dietStart)} className="animate-fade-up mt-5 font-display text-xl text-white">
          Diet
        </h3>
        <Divider delay={dietStart + 40} />
        <div className="flex flex-wrap gap-2">
          {[`${diet.kcal} kcal`, `${diet.protein} Protein`, `${diet.carbs} Carbs`].map((m, i) => (
            <span
              key={m}
              style={stagger(dietStart + 100 + i * 80)}
              className="animate-pop-in rounded-full bg-[#526176]/65 px-4 py-1 text-base"
            >
              {m}
            </span>
          ))}
        </div>
        <ul className="mt-3 list-disc space-y-0.5 pl-6">
          {diet.meals.map((m, i) => (
            <li key={m.label} style={stagger(dietStart + 380 + i * 70)} className="animate-fade-up">
              <strong>{m.label}:</strong> {m.items}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}