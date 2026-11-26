import { useState } from "react";
import { Settings } from "lucide-react";
import MemberLayout from "../../components/MemberLayout";
import { useMembership } from "../../context/MembershipContext";
import { profile as initial } from "../../data/profile";
import { tierText } from "../../data/tierStyles";
import { fmtDate } from "../../data/workoutPlans";

const card = "animate-fade-up rounded-[22px] border border-[#2b394c] bg-[#1f2937] p-6";
const btn = "rounded-lg bg-[#2b3b55] px-5 py-2 text-sm transition hover:bg-[#35496b] active:scale-95";

function Field({ label, value, editing, onChange, unit, placeholder = "Not added" }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-white/60">{label}</span>
      <div className={`flex items-center rounded-xl bg-[#131b29] px-4 py-3 text-sm transition ${editing ? "ring-1 ring-blue-400" : ""}`}>
        <input readOnly={!editing} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full bg-transparent outline-none placeholder:text-white/40" />
        {unit && value && <span className="ml-2 text-white/60">{unit}</span>}
      </div>
    </label>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between border-t border-white/10 py-3 text-sm first:border-0">
      <span className="text-white/60">{label}</span>
      <span className="font-medium">{children}</span>
    </div>
  );
}

function Switch({ on, onClick, label }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center justify-between py-1 text-sm">
      {label}
      <span className={`h-5 w-9 rounded-full p-0.5 transition ${on ? "bg-blue-500" : "bg-white/25"}`}>
        <span className={`block h-4 w-4 rounded-full bg-white transition ${on ? "translate-x-4" : ""}`} />
      </span>
    </button>
  );
}

export default function ProfilePage() {
  const { plan } = useMembership();
  const [data, setData] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [editing, setEditing] = useState(null); // "personal" | "fitness" | null
  const [notify, setNotify] = useState({ reminders: true, updates: true, open: false });
  const [toast, setToast] = useState("");

  const say = (m) => { setToast(m); setTimeout(() => setToast(""), 2600); };
  const set = (k) => (v) => setDraft((d) => ({ ...d, [k]: v }));
  const start = (which) => { setDraft(data); setEditing(which); };
  const save = () => { setData(draft); setEditing(null); say("Saved (dummy data, not sent to a server yet)."); };
  const cancel = () => setEditing(null);
  const view = editing ? draft : data;
  const SaveCancel = () => (
    <div className="flex gap-2">
      <button onClick={cancel} className={btn}>Cancel</button>
      <button onClick={save} className="rounded-lg bg-blue-500 px-5 py-2 text-sm transition hover:bg-blue-600 active:scale-95">Save</button>
    </div>
  );

  return (
    <MemberLayout pageTitle="Profile" PageIcon={Settings} photo={false} heading="My profile" subtitle="Manage your personal information and fitness preferences.">
      <div className="grid gap-5 font-sans lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-5">
          <section className={card} style={{ animationDelay: "100ms" }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Personal information</h2>
                <p className="mt-1 text-sm text-white/60">Keep your contact details up to date.</p>
              </div>
              {editing === "personal" ? <SaveCancel /> : (
                <button onClick={() => start("personal")} className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-medium transition hover:bg-blue-600 active:scale-95">Edit details</button>
              )}
            </div>
            <div className="mt-4 grid gap-4 border-t border-white/10 pt-4 sm:grid-cols-2">
              <Field label="First name" value={view.firstName} editing={editing === "personal"} onChange={set("firstName")} />
              <Field label="Last name" value={view.lastName} editing={editing === "personal"} onChange={set("lastName")} />
              <Field label="Email address" value={view.email} editing={editing === "personal"} onChange={set("email")} />
              <Field label="Phone number" value={view.phone} editing={editing === "personal"} onChange={set("phone")} />
            </div>
            <p className="mt-6 text-xs text-white/50">Your contact details are only used for your gym account.</p>
          </section>

          <section className={card} style={{ animationDelay: "220ms" }}>
            <h2 className="mb-3 text-xl font-semibold">Account and security</h2>
            <div className="flex items-center justify-between py-2">
              <div><p className="text-sm font-medium">Password</p><p className="text-xs text-white/60">Keep your account protected.</p></div>
              <button onClick={() => say("Password changes will be handled by the backend.")} className={btn}>Change password</button>
            </div>
            <div className="border-t border-white/10 py-2">
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium">Notifications</p><p className="text-xs text-white/60">Workout reminders and membership updates</p></div>
                <button onClick={() => setNotify((n) => ({ ...n, open: !n.open }))} className={btn}>{notify.open ? "Done" : "Manage"}</button>
              </div>
              {notify.open && (
                <div className="animate-fade-up mt-2 rounded-xl bg-[#131b29] px-4 py-2">
                  <Switch label="Workout reminders" on={notify.reminders} onClick={() => setNotify((n) => ({ ...n, reminders: !n.reminders }))} />
                  <Switch label="Membership updates" on={notify.updates} onClick={() => setNotify((n) => ({ ...n, updates: !n.updates }))} />
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-5">
          <section className={card} style={{ animationDelay: "160ms" }}>
            <h2 className="text-xl font-semibold">Your membership</h2>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className={`text-3xl font-semibold ${tierText[plan.tier]}`}>{plan.tier}</p>
                <p className="text-sm text-white/70">{plan.period} membership</p>
              </div>
              <span className="rounded-full bg-green-500/20 px-4 py-1 text-xs text-green-300">{plan.status}</span>
            </div>
            <div className="mt-4 border-t border-white/10 pt-3"><Row label="Renewal date">{fmtDate(plan.renew, { month: "short", day: "numeric", year: "numeric" })}</Row></div>
          </section>

          <section className={card} style={{ animationDelay: "280ms" }}>
            <h2 className="text-xl font-semibold">Fitness preferences</h2>
            <p className="mt-1 text-sm text-white/60">Your training, tailored to you.</p>
            <p className="mt-4 text-xs text-white/60">Primary goal</p>
            <p className="text-xl font-semibold">{data.goal}</p>
            <div className="mt-3 space-y-1 border-t border-white/10 pt-3">
              {editing === "fitness" ? (
                <div className="animate-fade-up grid gap-3">
                  <Field label="Current weight" value={draft.weight} onChange={set("weight")} editing unit="kg" />
                  <Field label="Height" value={draft.height} onChange={set("height")} editing unit="cm" placeholder="Not set" />
                  <Field label="Target weight" value={draft.targetWeight} onChange={set("targetWeight")} editing unit="kg" placeholder="Not set" />
                </div>
              ) : (
                <>
                  <Row label="Current weight">{data.weight} kg</Row>
                  <Row label="Height">{data.height ? `${data.height} cm` : "Not set"}</Row>
                  <Row label="Target weight">{data.targetWeight ? `${data.targetWeight} kg` : "Not set"}</Row>
                </>
              )}
            </div>
            <div className="mt-4">
              {editing === "fitness" ? <SaveCancel /> : (
                <button onClick={() => start("fitness")} className={`${btn} w-full py-2.5`}>Update fitness details</button>
              )}
            </div>
          </section>
        </div>
      </div>

      {toast && <div className="animate-pop-in fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-[#0f1b33] px-5 py-2 text-sm shadow-lg ring-1 ring-blue-400">{toast}</div>}
    </MemberLayout>
  );
}
