// Sample content for the Trainer Dashboard, copied from the Figma frame
// "Trainer / Dashboard" (94:17).
//
// There is no trainer endpoint on the backend yet (dashboardService.js has
// getTrainerDashboard marked [TODO]), so the page shows this until you pass
// real data in with <TrainerDashboard data={...} />. Keep the same shape.
//
// workout / diet: "active" | "not-set"
export const trainerDashboardSample = {
  trainer: { name: "John Smith", role: "Personal trainer" },

  stats: [
    { label: "Active clients", value: 4, note: "All clients on track", tone: "muted" },
    { label: "Sessions today", value: 3, note: "Next session at 9:00 AM", tone: "muted" },
    { label: "Pending requests", value: 3, note: "Awaiting your review", tone: "warn" },
    { label: "Active plans", value: 7, note: "4 workout · 3 diet", tone: "muted" },
  ],

  clients: [
    { id: "c1", name: "Juan Dela Cruz", goal: "Muscle gain", workout: "active", diet: "active", nextSession: "Today, 9:00 AM" },
    { id: "c2", name: "Maria Santos", goal: "Weight loss", workout: "active", diet: "active", nextSession: "Today, 11:00 AM" },
    { id: "c3", name: "Carlo Reyes", goal: "Strength", workout: "active", diet: "active", nextSession: "Today, 2:00 PM" },
    { id: "c4", name: "Ana Garcia", goal: "General fitness", workout: "active", diet: "not-set", nextSession: "Nov 20, 8:00 AM" },
  ],

  attention: {
    count: 1,
    title: "Complete Ana’s nutrition plan",
    text: "Her workout plan is ready. Add a diet plan before the next session.",
    cta: "Create diet plan",
    to: "/trainer/diet-plans",
    checkIn: "Next check-in: Nov 20",
  },

  sessionsDate: "Thursday, November 19, 2026",
  sessions: [
    { id: "s1", time: "09:00 AM", client: "Juan Dela Cruz", detail: "Upper body push · 60 min" },
    { id: "s2", time: "11:00 AM", client: "Maria Santos", detail: "Full body circuit · 45 min" },
    { id: "s3", time: "02:00 PM", client: "Carlo Reyes", detail: "Strength foundation · 60 min" },
  ],

  requests: {
    count: 3,
    text: "Review changes before your next session.",
    to: "/trainer/rescheduling",
  },
};
