import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import QrPanel from "../../components/QrPanel/QrPanel";
import { useMembership } from "../../context/MembershipContext";
import { tiers } from "../../components/Membership";

const input = "w-full rounded-full bg-[#f1f5f9] px-6 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-blue-400";

export default function PaymentPage() {
  const { state } = useLocation(); // { tier, action } sent by the Buy / Renew buttons
  const navigate = useNavigate();
  const { plan, addPayment } = useMembership();

  const tier = tiers.find((t) => t.name === (state?.tier ?? plan.tier)) ?? tiers[0];
  const [ref, setRef] = useState("");
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);
  const valid = /^\d{8,26}$/.test(ref);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => navigate("/member/membership"), 1800);
    return () => clearTimeout(t);
  }, [done, navigate]);

  const confirm = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    // TODO: send to the Java backend here (POST /api/payments)
    addPayment({ tier: tier.name, period: "Monthly", ref });
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-black font-body text-white lg:grid lg:grid-cols-2">
      {/* Left: photo + tagline */}
      <section className="relative isolate flex flex-col justify-center overflow-hidden px-6 py-10 lg:px-16">
        <div className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: "url('/assets/hero-image.jpg')" }} />
        <div className="absolute inset-0 -z-10 bg-black/55 bg-linear-to-r from-transparent to-black lg:bg-black/30" />
        <div className="animate-fade-up"><Logo /></div>
        <h1 style={{ animationDelay: "150ms" }} className="animate-fade-up mt-8 font-display text-4xl leading-tight lg:text-5xl">
          Consistency is the <span className="text-blue-500">Key.</span>
        </h1>
        <p style={{ animationDelay: "300ms" }} className="animate-fade-up mt-5 max-w-sm text-xl lg:text-2xl">
          Track your workouts, manage your membership, and reach your fitness goals - all in one place.
        </p>
      </section>

      {/* Right: payment form */}
      <section className="flex flex-col justify-center px-4 py-10 lg:px-10">
        <h2 className="animate-fade-up font-display text-3xl lg:text-4xl">Membership Payment</h2>
        <div style={{ animationDelay: "150ms" }} className="animate-fade-up mt-4 rounded-[40px] border border-[#2b394c] bg-[#1f2937] p-6 lg:p-8">
          {done ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <svg viewBox="0 0 52 52" className="h-20 w-20 text-green-400" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="26" cy="26" r="22" pathLength="1" className="animate-draw" />
                <path d="M15 27l8 8 14-16" pathLength="1" className="animate-draw" style={{ animationDelay: "0.5s" }} />
              </svg>
              <p className="animate-fade-up mt-4 font-display text-2xl" style={{ animationDelay: "0.8s" }}>Payment submitted</p>
              <p className="animate-fade-up mt-1 text-white/70" style={{ animationDelay: "0.9s" }}>Status: Pending approval. Taking you back to Membership...</p>
            </div>
          ) : (
            <form onSubmit={confirm} className="space-y-4">
              <h3 className="font-display text-2xl">Membership Plan</h3>
              <label className="block">
                <span className="mb-1 block">Type: <span className="text-sm text-white/60">({state?.action === "renew" ? "Renewal" : "New plan"})</span></span>
                <input readOnly value={`${tier.name} · Monthly · PHP ${tier.price}`} className={`${input} font-semibold`} />
              </label>
              <div>
                <span className="mb-1 block">Scan and Pay:</span>
                <QrPanel key={tier.name} src="/assets/payment-qr.png" size={160} className="animate-pop-in mx-auto" />
              </div>
              <label className="block">
                <span className="mb-1 block">Reference Number:</span>
                <input value={ref} onChange={(e) => setRef(e.target.value.replace(/\D/g, ""))} maxLength={26} inputMode="numeric" placeholder="Enter the reference number from your payment" className={input} />
                {touched && !valid && <span className="animate-fade-up mt-1 block text-sm text-red-300">Enter the 8 to 26 digit reference number.</span>}
              </label>
              <div className="flex justify-center pt-2">
                <button type="submit" className="rounded-full bg-blue-500 px-8 py-3 font-ui text-lg font-bold transition hover:bg-blue-600 active:scale-95">
                  Confirm &amp; Proceed
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}