const stagger = (ms) => ({ animationDelay: `${ms}ms` });

// Render with key={dateIso} so it re-animates when the selected date changes.
export default function DietPlan({ diet }) {
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {[`${diet.kcal} kcal`, `${diet.protein} Protein`, `${diet.carbs} Carbs`].map((m, i) => (
          <span key={m} style={stagger(i * 80)} className="animate-pop-in rounded-full bg-[#526176]/65 px-4 py-1">
            {m}
          </span>
        ))}
      </div>
      <ul className="mt-4 list-disc space-y-1 pl-6 text-lg">
        {diet.meals.map((m, i) => (
          <li key={m.label} style={stagger(260 + i * 80)} className="animate-fade-up">
            <strong>{m.label}:</strong> {m.items}
          </li>
        ))}
      </ul>
      <hr style={stagger(620)} className="animate-grow-x my-4 origin-left border-0 border-t border-white/70" />
      <p style={stagger(680)} className="animate-fade-up pl-2 text-lg">
        <strong>Water Goal:</strong> {diet.water}
      </p>
    </div>
  );
}
