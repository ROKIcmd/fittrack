import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { iso } from "../data/workoutPlans";

// Dummy current plan. The backend team will replace this with real data.
export const plan = { tier: "Gold", period: "Monthly", start: "2026-10-29", renew: "2026-11-29", status: "Active" };

const seedBilling = [
  ["2026-10-15", "48211093750214"], ["2026-09-15", "48211093750198"], ["2026-08-15", "48211093750173"],
  ["2026-07-15", "48211093750151"], ["2026-06-15", "48211093750127"], ["2026-05-15", "48211093750102"],
].map(([date, ref], i) => ({ id: `seed-${i}`, date, ref, status: "Approved", tier: "Gold", period: "Monthly" }));

const KEY = "fittrack-billing-v1";
const Ctx = createContext(null);

export function MembershipProvider({ children }) {
  const [billing, setBilling] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) ?? seedBilling; } catch { return seedBilling; }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(billing)); } catch { /* storage unavailable */ }
  }, [billing]);

  // Called by the Payment page: adds a "Pending" row to the top of the billing history
  const addPayment = useCallback(({ tier, period, ref }) => {
    const entry = { id: `pay-${Date.now()}`, date: iso(new Date()), ref, status: "Pending", tier, period };
    setBilling((b) => [entry, ...b]);
  }, []);

  const value = useMemo(
    () => ({ plan, billing, addPayment, hasPending: billing.some((b) => b.status === "Pending") }),
    [billing, addPayment]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useMembership = () => useContext(Ctx);
