import { useMemo, useState } from "react";
import TrainerShell from "../../components/TrainerShell";
import PlanLibrary from "../../components/trainer/PlanLibrary";
import PlanEditorFrame from "../../components/trainer/PlanEditorFrame";
import { Label, SelectInput, TextArea, TextButton, TextInput, cx } from "../../components/trainer/TrainerUI";
import { saveWorkoutPlan, useTrainerStore, workoutDraftSeed } from "../../data/trainerStore";

// Workout plans  ->  route: /trainer/workout-plans
// Figma frame "Trainer / Workout plans" (94:51), 1279 x 900.

export const GOALS = ["Muscle gain", "Weight loss", "Strength", "General fitness"];
const DURATIONS = ["2 weeks", "4 weeks", "6 weeks", "8 weeks", "12 weeks"];
const FREQUENCIES = ["2 days / week", "3 days / week", "4 days / week", "5 days / week"];

const COLUMNS = "grid grid-cols-[minmax(0,1fr)_66px_66px_72px_66px_24px] items-center gap-x-4";
const cell = "h-[31px] rounded-[7px] bg-[#17212f] px-[10px] text-[11px] text-[#f8fafc] outline-none transition hover:bg-[#1a2636] focus:ring-2 focus:ring-[#3b82f6]/70";

const blankFromPlan = (plan) => ({
  ...workoutDraftSeed,
  planId: plan.id,
  basedOn: plan.id,
  name: plan.name,
  clientId: plan.clientId,
  duration: plan.duration,
  attachment: "",
  notes: "",
  days: workoutDraftSeed.days.map((day) => ({ ...day, exercises: [] })),
});

let rowSeq = 0;

export default function TrainerWorkoutPlans() {
  const { clients, workoutPlans } = useTrainerStore();
  const [draft, setDraft] = useState(workoutDraftSeed);
  const [message, setMessage] = useState(null);

  const clientName = (id) => clients.find((c) => c.id === id)?.name ?? "Unassigned";
  const patch = (changes) => {
    setMessage(null);
    setDraft((d) => ({ ...d, ...changes }));
  };

  const day = draft.days.find((d) => d.id === draft.activeDay) ?? draft.days[0];
  const setExercises = (exercises) =>
    patch({ days: draft.days.map((d) => (d.id === day.id ? { ...d, exercises } : d)) });
  const editRow = (id, key, value) =>
    setExercises(day.exercises.map((row) => (row.id === id ? { ...row, [key]: value } : row)));

  const library = useMemo(
    () =>
      workoutPlans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        subtitle: `${clientName(plan.clientId)} · ${plan.duration}${plan.status === "draft" ? " · Draft" : ""}`,
        tone: plan.status === "draft" ? "warn" : undefined,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workoutPlans, clients],
  );

  const assigned = workoutPlans.filter((p) => p.status === "assigned").length;
  const drafts = workoutPlans.filter((p) => p.status === "draft").length + (draft.planId ? 0 : 1);
  const statusLabel = draft.planId && workoutPlans.find((p) => p.id === draft.planId)?.status === "assigned" ? "ASSIGNED" : "DRAFT";

  const loadPlan = (id) => {
    const plan = workoutPlans.find((p) => p.id === id);
    if (!plan) return;
    setMessage(null);
    setDraft(plan.data ?? (id === "w1" ? { ...workoutDraftSeed, planId: "w1", name: "Upper body push" } : blankFromPlan(plan)));
  };

  const startFresh = () => {
    setMessage(null);
    setDraft({ ...blankFromPlan({ id: null, name: "", clientId: "", duration: "4 weeks" }), planId: null, basedOn: null });
  };

  const validate = (forAssign) => {
    if (!draft.name.trim()) return "Give the plan a name first.";
    if (forAssign) {
      if (!draft.clientId) return "Choose a client to assign this plan to.";
      if (!draft.days.some((d) => d.exercises.some((row) => row.name.trim()))) return "Add at least one exercise before assigning.";
    }
    return "";
  };

  const commit = (status) => {
    const problem = validate(status === "assigned");
    if (problem) return setMessage({ tone: "error", text: problem });
    const id = saveWorkoutPlan(draft, status);
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
      breadcrumb="Workout plans"
      title="Workout plans"
      subtitle="Build routines, upload plans, and assign them to your clients."
    >
      <div className="grid gap-[18px] lg:grid-cols-[300px_minmax(0,1fr)]">
        <PlanLibrary
          title="Workout library"
          summary={`${assigned} assigned plans · ${drafts} draft`}
          plans={library}
          selectedId={draft.planId ?? draft.basedOn}
          onSelect={loadPlan}
          fileName={draft.attachment}
          onFile={(attachment) => patch({ attachment })}
          footer={
            <>
              Reuse a saved plan or{" "}
              <button type="button" onClick={startFresh} className="font-semibold text-[#8cbaff] underline-offset-2 hover:underline">
                start fresh
              </button>
              .
            </>
          }
        />

        <PlanEditorFrame
          title="Create workout plan"
          statusLabel={statusLabel}
          onSaveDraft={() => commit("draft")}
          startDate={draft.startDate}
          onStartDate={(startDate) => patch({ startDate })}
          assignLabel="Assign workout plan"
          onAssign={() => commit("assigned")}
          message={message}
        >
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_240px]">
            <div>
              <Label htmlFor="wp-name">Plan name</Label>
              <TextInput id="wp-name" value={draft.name} onChange={(e) => patch({ name: e.target.value })} placeholder="e.g. Upper body push" />
            </div>
            <div>
              <Label htmlFor="wp-client">Assign to client</Label>
              <SelectInput
                id="wp-client"
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
              <Label htmlFor="wp-goal">Goal</Label>
              <SelectInput id="wp-goal" label="Goal" value={draft.goal} onChange={(goal) => patch({ goal })} options={GOALS} />
            </div>
            <div>
              <Label htmlFor="wp-duration">Duration</Label>
              <SelectInput id="wp-duration" label="Duration" value={draft.duration} onChange={(duration) => patch({ duration })} options={DURATIONS} />
            </div>
            <div>
              <Label htmlFor="wp-frequency">Frequency</Label>
              <SelectInput id="wp-frequency" label="Frequency" value={draft.frequency} onChange={(frequency) => patch({ frequency })} options={FREQUENCIES} />
            </div>
          </div>

          <h3 className="mt-[19px] text-[15px] font-semibold leading-[22px]">Weekly routine</h3>
          <div role="tablist" aria-label="Weekly routine" className="mt-[10px] grid grid-cols-3 gap-2">
            {draft.days.map((d) => (
              <button
                key={d.id}
                role="tab"
                type="button"
                aria-selected={d.id === day.id}
                onClick={() => patch({ activeDay: d.id })}
                className={cx(
                  "h-9 rounded-[9px] text-xs font-medium transition duration-200 focus-visible:ring-2 focus-visible:ring-[#3b82f6]/70 focus-visible:outline-none",
                  d.id === day.id ? "bg-[#284b7a] text-[#a8ceff]" : "bg-[#17212f] text-[#afbdcf] hover:bg-[#1b2a3c] hover:text-[#f8fafc]",
                )}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="mt-[22px] overflow-x-auto">
            <div className="min-w-[560px]">
              <div className={cx(COLUMNS, "pb-[10px] text-[10px] font-semibold leading-[15px] text-[#afbdcf]")}>
                <span>EXERCISE</span>
                <span>SETS</span>
                <span>REPS</span>
                <span>REST</span>
                <span>LOAD</span>
                <span />
              </div>
              <div key={day.id} role="tabpanel" className="animate-fade-in border-t border-[#374658]">
                {day.exercises.map((row) => (
                  <div key={row.id} className={cx(COLUMNS, "h-[49px] border-b border-[#374658]")}>
                    <input
                      aria-label="Exercise name"
                      value={row.name}
                      onChange={(e) => editRow(row.id, "name", e.target.value)}
                      placeholder="Exercise name"
                      className="h-8 w-full min-w-0 rounded-[7px] bg-transparent text-xs font-medium text-[#f8fafc] outline-none transition placeholder:text-[#afbdcf] focus:bg-[#17212f] focus:px-2 focus:ring-2 focus:ring-[#3b82f6]/70"
                    />
                    {["sets", "reps", "rest", "load"].map((key) => (
                      <input key={key} aria-label={key} value={row[key]} onChange={(e) => editRow(row.id, key, e.target.value)} className={cell} />
                    ))}
                    <button
                      type="button"
                      aria-label={`Remove ${row.name || "exercise"}`}
                      onClick={() => setExercises(day.exercises.filter((r) => r.id !== row.id))}
                      className="size-6 rounded text-base leading-none text-[#afbdcf] transition hover:text-[#f4a3b5] focus-visible:ring-2 focus-visible:ring-[#3b82f6]/70 focus-visible:outline-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {day.exercises.length === 0 && (
                  <p className="border-b border-[#374658] py-[15px] text-xs text-[#afbdcf]">No exercises for this day yet.</p>
                )}
              </div>
            </div>
          </div>

          <TextButton
            className="mt-[14px]"
            onClick={() => setExercises([...day.exercises, { id: `n${++rowSeq}`, name: "", sets: "3", reps: "10", rest: "60 sec", load: "" }])}
          >
            + Add exercise
          </TextButton>

          <div className="mt-[15px]">
            <Label htmlFor="wp-notes">Coaching notes</Label>
            <TextArea id="wp-notes" rows={1} value={draft.notes} onChange={(e) => patch({ notes: e.target.value })} className="h-9" placeholder="Anything the client should keep in mind" />
          </div>
        </PlanEditorFrame>
      </div>
    </TrainerShell>
  );
}
