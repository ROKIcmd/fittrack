import { useMemo, useState } from "react";
import TrainerShell from "../../components/TrainerShell";
import PlanLibrary from "../../components/trainer/PlanLibrary";
import PlanEditorFrame from "../../components/trainer/PlanEditorFrame";
import { Label, SelectInput, TextButton, TextInput, cx } from "../../components/trainer/TrainerUI";
import { dietDraftSeed, saveDietPlan, useTrainerStore } from "../../data/trainerStore";
import { GOALS } from "./TrainerWorkoutPlans";

// Diet plans  ->  route: /trainer/diet-plans
// Figma frame "Trainer/diet-plan" (94:85), 1279 x 900.

const DURATIONS = ["2 weeks", "4 weeks", "6 weeks", "8 weeks", "12 weeks"];
const PREFERENCES = ["No restrictions", "Vegetarian", "Vegan", "Pescatarian", "Gluten-free", "Dairy-free"];

const COLUMNS = "grid grid-cols-[130px_minmax(0,1fr)_72px_24px] items-center gap-x-5";
const bare =
  "min-w-0 rounded-[5px] bg-transparent outline-none transition placeholder:text-[#afbdcf] hover:bg-[#17212f]/70 focus:bg-[#17212f] focus:px-2 focus:ring-2 focus:ring-[#3b82f6]/70";

const blankFromPlan = (plan) => ({
  ...dietDraftSeed,
  planId: plan.id,
  basedOn: plan.id,
  name: plan.name,
  clientId: plan.clientId,
  attachment: "",
  macros: { kcal: "", protein: "", carbs: "", fats: "" },
  meals: [],
});

let mealSeq = 0;

function MacroTile({ label, value, unit, accent, onChange, readOnly }) {
  return (
    <label className="block h-[65px] rounded-[10px] bg-[#17212f] px-3 pt-[9px] transition focus-within:ring-2 focus-within:ring-[#3b82f6]/70 hover:bg-[#1a2636]">
      <span className="block text-[10px] leading-[15px] text-[#afbdcf]">{label}</span>
      <span className="mt-[5px] flex items-baseline gap-[5px]">
        <input
          inputMode="numeric"
          aria-label={label}
          readOnly={readOnly}
          value={value}
          onChange={(e) => onChange?.(e.target.value.replace(/[^\d,]/g, ""))}
          className={cx(
            "min-w-0 bg-transparent p-0 text-lg font-semibold leading-[26px] outline-none",
            accent ? "text-[#8cbaff]" : "text-[#f8fafc]",
            readOnly && "cursor-default",
          )}
          style={{ width: `${Math.max(String(value).length, 1) + 0.3}ch` }}
        />
        <span className={cx("text-lg font-semibold leading-[26px]", accent ? "text-[#8cbaff]" : "text-[#f8fafc]")}>{unit}</span>
      </span>
    </label>
  );
}

export default function TrainerDietPlans() {
  const { clients, dietPlans } = useTrainerStore();
  const [draft, setDraft] = useState(dietDraftSeed);
  const [message, setMessage] = useState(null);

  const clientName = (id) => clients.find((c) => c.id === id)?.name ?? "Unassigned";
  const patch = (changes) => {
    setMessage(null);
    setDraft((d) => ({ ...d, ...changes }));
  };
  const setMeals = (meals) => patch({ meals });
  const editMeal = (id, key, value) => setMeals(draft.meals.map((m) => (m.id === id ? { ...m, [key]: value } : m)));

  // Daily energy is the sum of the meals, so the tile always matches the table.
  const totalKcal = draft.meals.reduce((sum, m) => sum + (Number(String(m.kcal).replace(/,/g, "")) || 0), 0);

  const library = useMemo(
    () =>
      dietPlans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        subtitle: `${clientName(plan.clientId)} · ${plan.status === "draft" ? "Draft" : "Assigned"}`,
        tone: plan.status === "draft" ? "warn" : undefined,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dietPlans, clients],
  );

  const assigned = dietPlans.filter((p) => p.status === "assigned").length;
  const drafts = dietPlans.filter((p) => p.status === "draft").length + (draft.planId ? 0 : 1);
  const statusLabel = dietPlans.find((p) => p.id === draft.planId)?.status === "assigned" ? "ASSIGNED" : "DRAFT";

  const loadPlan = (id) => {
    const plan = dietPlans.find((p) => p.id === id);
    if (!plan) return;
    setMessage(null);
    setDraft(plan.data ?? (id === "d4" ? dietDraftSeed : blankFromPlan(plan)));
  };

  const startFresh = () => {
    setMessage(null);
    setDraft({ ...blankFromPlan({ id: null, name: "", clientId: "" }), planId: null, basedOn: null });
  };

  const commit = (status) => {
    if (!draft.name.trim()) return setMessage({ tone: "error", text: "Give the plan a name first." });
    if (status === "assigned") {
      if (!draft.clientId) return setMessage({ tone: "error", text: "Choose a client to assign this plan to." });
      if (!draft.meals.some((m) => m.food.trim())) return setMessage({ tone: "error", text: "Add at least one meal before assigning." });
    }
    const id = saveDietPlan({ ...draft, macros: { ...draft.macros, kcal: totalKcal.toLocaleString("en-US") } }, status);
    setDraft((d) => ({ ...d, planId: id }));
    setMessage({
      tone: "success",
      text:
        status === "assigned"
          ? `Assigned to ${clientName(draft.clientId)}. Saved in this browser session only (no backend yet).`
          : "Draft saved in this browser session only (no backend yet).",
    });
  };

  return (
    <TrainerShell
      breadcrumb="Diet plans"
      title="Diet plans"
      subtitle="Create balanced meal plans tailored to each client’s goals."
    >
      <div className="grid gap-[18px] lg:grid-cols-[300px_minmax(0,1fr)]">
        <PlanLibrary
          title="Diet library"
          summary={`${assigned} assigned plans · ${drafts} draft`}
          plans={library}
          selectedId={draft.planId ?? draft.basedOn}
          onSelect={loadPlan}
          fileName={draft.attachment}
          onFile={(attachment) => patch({ attachment })}
          footer={
            <>
              Keep nutrition and training in sync.{" "}
              <button type="button" onClick={startFresh} className="font-semibold text-[#8cbaff] underline-offset-2 hover:underline">
                Start fresh
              </button>
            </>
          }
        />

        <PlanEditorFrame
          title="Create diet plan"
          statusLabel={statusLabel}
          onSaveDraft={() => commit("draft")}
          startDate={draft.startDate}
          onStartDate={(startDate) => patch({ startDate })}
          assignLabel="Assign diet plan"
          onAssign={() => commit("assigned")}
          message={message}
        >
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_240px]">
            <div>
              <Label htmlFor="dp-name">Plan name</Label>
              <TextInput id="dp-name" value={draft.name} onChange={(e) => patch({ name: e.target.value })} placeholder="e.g. Balanced daily nutrition" />
            </div>
            <div>
              <Label htmlFor="dp-client">Assign to client</Label>
              <SelectInput
                id="dp-client"
                label="Assign to client"
                value={draft.clientId}
                onChange={(clientId) => {
                  const goal = clients.find((c) => c.id === clientId)?.goal;
                  patch({ clientId, ...(GOALS.includes(goal) ? { goal } : {}) });
                }}
                options={clients.map((c) => ({ value: c.id, label: c.name }))}
              />
            </div>
          </div>

          <div className="mt-[15px] grid gap-4 sm:grid-cols-[214fr_204fr_214fr]">
            <div>
              <Label htmlFor="dp-goal">Goal</Label>
              <SelectInput id="dp-goal" label="Goal" value={draft.goal} onChange={(goal) => patch({ goal })} options={GOALS} />
            </div>
            <div>
              <Label htmlFor="dp-duration">Duration</Label>
              <SelectInput id="dp-duration" label="Duration" value={draft.duration} onChange={(duration) => patch({ duration })} options={DURATIONS} />
            </div>
            <div>
              <Label htmlFor="dp-pref">Dietary preferences</Label>
              <SelectInput id="dp-pref" label="Dietary preferences" value={draft.preference} onChange={(preference) => patch({ preference })} options={PREFERENCES} />
            </div>
          </div>

          <div className="mt-[19px] grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-4 lg:gap-[16px]">
            <MacroTile label="Daily energy" value={totalKcal.toLocaleString("en-US")} unit="kcal" accent readOnly />
            {[
              ["protein", "Protein"],
              ["carbs", "Carbs"],
              ["fats", "Fats"],
            ].map(([key, label]) => (
              <MacroTile key={key} label={label} unit="g" value={draft.macros[key]} onChange={(v) => patch({ macros: { ...draft.macros, [key]: v } })} />
            ))}
          </div>

          <h3 className="mt-[16px] text-[15px] font-semibold leading-[22px]">Daily meal schedule</h3>
          <div className="mt-[10px] overflow-x-auto">
            <div className="min-w-[560px]">
              <div className={cx(COLUMNS, "pb-[10px] text-[10px] font-semibold leading-[15px] text-[#afbdcf]")}>
                <span>MEAL / TIME</span>
                <span>FOODS &amp; PORTIONS</span>
                <span>ENERGY</span>
                <span />
              </div>
              <div className="border-t border-[#374658]">
                {draft.meals.map((meal, index) => (
                  <div
                    key={meal.id}
                    className={cx(COLUMNS, "animate-fade-up border-b border-[#374658] py-[5px]")}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div>
                      <input aria-label="Meal name" value={meal.name} onChange={(e) => editMeal(meal.id, "name", e.target.value)} placeholder="Meal" className={cx(bare, "block h-[19px] w-full text-xs font-medium text-[#f8fafc]")} />
                      <input aria-label="Meal time" value={meal.time} onChange={(e) => editMeal(meal.id, "time", e.target.value)} placeholder="Time" className={cx(bare, "block h-[15px] w-full text-[10px] text-[#afbdcf]")} />
                    </div>
                    <div>
                      <input aria-label="Food" value={meal.food} onChange={(e) => editMeal(meal.id, "food", e.target.value)} placeholder="Foods" className={cx(bare, "block h-[19px] w-full text-xs font-medium text-[#f8fafc]")} />
                      <input aria-label="Portions" value={meal.portion} onChange={(e) => editMeal(meal.id, "portion", e.target.value)} placeholder="Portions" className={cx(bare, "block h-[15px] w-full text-[9px] text-[#afbdcf]")} />
                    </div>
                    <span className="flex items-center text-[11px] text-[#f8fafc]">
                      <input
                        aria-label="Energy in kcal"
                        inputMode="numeric"
                        value={meal.kcal}
                        onChange={(e) => editMeal(meal.id, "kcal", e.target.value.replace(/\D/g, ""))}
                        className={cx(bare, "h-5 w-[4ch] text-right text-[11px] text-[#f8fafc]")}
                      />
                      <span className="ml-1 shrink-0">kcal</span>
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${meal.name || "meal"}`}
                      onClick={() => setMeals(draft.meals.filter((m) => m.id !== meal.id))}
                      className="size-6 rounded text-base leading-none text-[#afbdcf] transition hover:text-[#f4a3b5] focus-visible:ring-2 focus-visible:ring-[#3b82f6]/70 focus-visible:outline-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {draft.meals.length === 0 && <p className="border-b border-[#374658] py-[15px] text-xs text-[#afbdcf]">No meals yet.</p>}
              </div>
            </div>
          </div>

          <div className="mt-[11px] flex flex-wrap items-center justify-between gap-3">
            <TextButton onClick={() => setMeals([...draft.meals, { id: `nm${++mealSeq}`, name: "", time: "", food: "", portion: "", kcal: "" }])}>
              + Add meal
            </TextButton>
            <label className="flex items-center gap-1 text-xs text-[#afbdcf]">
              Daily water goal:
              <input
                inputMode="decimal"
                aria-label="Daily water goal in litres"
                value={draft.waterL}
                onChange={(e) => patch({ waterL: e.target.value.replace(/[^\d.]/g, "") })}
                className="w-[3.2ch] rounded bg-transparent text-right text-xs text-[#afbdcf] outline-none focus:bg-[#17212f] focus:ring-2 focus:ring-[#3b82f6]/70"
              />
              L
            </label>
          </div>
        </PlanEditorFrame>
      </div>
    </TrainerShell>
  );
}
