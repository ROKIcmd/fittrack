import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import MemberLayout from "../../components/MemberLayout";
import SectionCard from "../../components/SectionCard";
import MembershipCard from "../../components/MembershipCard";
import { useMembership } from "../../context/MembershipContext";
import { tiers } from "../../components/Membership";
import { tierText } from "../../data/tierStyles";
import { fmtDate, iso, parseIso } from "../../data/workoutPlans";

const scroll = "[scrollbar-color:white_transparent] [scrollbar-width:thin]";
const short = { month: "short", day: "numeric", year: "numeric" };

export default function MembershipPage() {
  const { plan, billing, hasPending } = useMembership();
  const navigate = useNavigate();
  const current = tiers.find((t) => t.name === plan.tier);

  const total = (parseIso(plan.renew) - parseIso(plan.start)) / 86400000;
  const left = Math.max(0, Math.ceil((parseIso(plan.renew) - parseIso(iso(new Date()))) / 86400000));
  const pct = Math.min(100, Math.max(0, Math.round(((total - left) / total) * 100)));

  // Buy / Renew both go to the payment page and tell it which plan was chosen
  const pay = (tier, action) => navigate("/payment", { state: { tier, action } });

  return (
    <MemberLayout pageTitle="Membership" PageIcon={Sparkles}>
      <div className="flex flex-col gap-5">
        <SectionCard title="Membership" delay={100}>
          <div className="flex flex-wrap items-center gap-3">
            <Sparkles className={`h-6 w-6 ${tierText[plan.tier]}`} fill="currentColor" />
            <span className={`font-display text-3xl ${tierText[plan.tier]}`}>{plan.tier}</span>
            <span className="h-7 border-l-2 border-white/40" />
            <span className="text-2xl">{plan.period}</span>
            <span className="ml-1 rounded-full border border-green-400 bg-green-500/20 px-3 py-0.5 text-sm text-green-300">{plan.status}</span>
            {hasPending && <span className="animate-pop-in rounded-full border border-yellow-300 bg-yellow-300/15 px-3 py-0.5 text-sm text-yellow-200">Payment pending</span>}
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#d9d9d9]">
            <div className="animate-fill h-full rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6]" style={{ width: `${pct}%`, "--w": `${pct}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-base">
            <span>{left} days remaining</span>
            <span>Renew {fmtDate(plan.renew, short)}</span>
          </div>
        </SectionCard>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-5">
            <SectionCard title="Current Plan" delay={220}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <p className={`font-display text-3xl ${tierText[plan.tier]}`}>{plan.tier}</p>
                <div className="flex-1 sm:border-l-4 sm:border-white sm:pl-4">
                  <p>Inclusion:</p>
                  <ul className="list-disc pl-6">
                    {current.inclusions.map((i) => <li key={i}>{i}</li>)}
                  </ul>
                </div>
                <div className="text-center sm:border-l-4 sm:border-white sm:pl-4">
                  <p className="mb-2">Continue the same membership?</p>
                  <button onClick={() => pay(plan.tier, "renew")} className="rounded-full bg-blue-500 px-8 py-1.5 font-display text-lg transition hover:bg-blue-600 active:scale-95">
                    Renew
                  </button>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Billing History" delay={340}>
              <div className="grid grid-cols-3 border-b border-white/70 pb-1 text-center">
                <span>Date</span><span>Reference Number</span><span>Status</span>
              </div>
              <div className={`max-h-[170px] overflow-y-auto ${scroll}`}>
                {billing.map((b, i) => (
                  <div key={b.id} style={{ animationDelay: `${420 + Math.min(i, 8) * 60}ms` }}
                    className={`animate-fade-up grid grid-cols-3 rounded py-1.5 text-center text-sm ${b.status === "Pending" ? "bg-yellow-300/10" : ""}`}>
                    <span>{fmtDate(b.date, short)}</span>
                    <span>{b.ref}</span>
                    <span className={b.status === "Approved" ? "text-green-400" : "text-yellow-300"}>{b.status}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Membership Type" delay={280}>
            <div className="grid gap-4 md:grid-cols-3">
              {tiers.map((t, i) => (
                <div key={t.name} style={{ animationDelay: `${400 + i * 120}ms` }} className="animate-fade-up">
                  <MembershipCard {...t} onBuy={() => pay(t.name, "buy")} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </MemberLayout>
  );
}