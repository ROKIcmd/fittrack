import { useState } from "react";
import { TIME_SLOTS, fmtDate } from "../data/workoutPlans";

const field = "h-8 w-full rounded-full bg-[#d9d9d9] px-4 text-sm text-black outline-none focus:ring-2 focus:ring-blue-400";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-base">{label}</span>
      {children}
    </label>
  );
}

/**
 * How rescheduling works:
 * 1. The member picks one of their upcoming sessions, a new date, a new time slot and a reason.
 * 2. Submitting creates a request with status "pending" (it shows on the calendar).
 * 3. The trainer approves or declines it on their Rescheduling page. If approved, the session
 *    moves to the new date and the old one is logged as "Rescheduled" in the Workout Log.
 */
export default function RescheduleForm({ sessions, selectedIso, todayIso, holidays, onSubmit }) {
  const empty = { session: "", newDate: "", slot: "", reason: "" };
  const [form, setForm] = useState(empty);
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => {
    setSent(false);
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  // Picking a session on the calendar pre-fills "Select Session"
  const preset = sessions.some((s) => s.date === selectedIso) ? selectedIso : "";
  const session = form.session || preset;

  const error =
    form.newDate && form.newDate < todayIso ? "Pick today or a later date."
    : form.newDate && form.newDate === session ? "Choose a different date from the original session."
    : "";
  const holiday = holidays[form.newDate];
  const valid = session && form.newDate && form.slot && form.reason.trim() && !error;

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    onSubmit({ session, newDate: form.newDate, slot: form.slot, reason: form.reason.trim() });
    setForm(empty);
    setSent(true);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <Field label="Select Session">
          <select value={session} onChange={set("session")} className={field}>
            <option value="">Choose a session</option>
            {sessions.map((s) => (
              <option key={s.date} value={s.date}>{fmtDate(s.date)} · {s.title} · {s.time}</option>
            ))}
          </select>
        </Field>
        <Field label="New Date">
          <input type="date" min={todayIso} value={form.newDate} onChange={set("newDate")} className={field} />
        </Field>
        <Field label="New Time Slot">
          <select value={form.slot} onChange={set("slot")} className={field}>
            <option value="">Choose a time</option>
            {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Reason for rescheduling">
          <input value={form.reason} onChange={set("reason")} maxLength={120} placeholder="e.g. Work meeting" className={field} />
        </Field>
      </div>

      {error && <p className="animate-fade-up text-sm text-red-300">{error}</p>}
      {holiday && !error && (
        <p className="animate-fade-up text-sm text-yellow-200">{fmtDate(form.newDate)} is a public holiday ({holiday}). The gym may be closed.</p>
      )}
      {sent && (
        <p className="animate-pop-in rounded-xl bg-emerald-500/15 px-3 py-2 text-sm text-emerald-300">
          Request sent! Your trainer will review it and you'll see the update on your calendar.
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!valid}
          className="rounded-full bg-blue-500 px-6 py-2 font-display text-lg transition hover:bg-blue-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Submit Request
        </button>
      </div>
    </form>
  );
}
