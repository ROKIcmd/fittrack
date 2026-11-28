import { useSyncExternalStore } from "react";

// Tiny shared store for the trainer pages (no provider, no extra dependency).
//
// Why it exists: the dashboard, plans, rescheduling and body-metrics pages all
// need to see the same clients. Assigning a plan, approving a request or saving
// a measurement on one page shows up on the others and in the sidebar badge.
//
// IMPORTANT: this is in-memory only. There are no trainer endpoints on the
// backend yet, so a page refresh resets everything to the Figma sample data
// below. When the API exists, replace the actions at the bottom with fetch calls.

const clients = [
  { id: "juan", name: "Juan Dela Cruz", goal: "Muscle gain", workout: "active", diet: "active", nextSession: "Today, 9:00 AM", heightM: 1.75, targetKg: 80 },
  { id: "maria", name: "Maria Santos", goal: "Weight loss", workout: "active", diet: "active", nextSession: "Today, 11:00 AM", heightM: null, targetKg: null },
  { id: "carlo", name: "Carlo Reyes", goal: "Strength", workout: "active", diet: "active", nextSession: "Today, 2:00 PM", heightM: null, targetKg: null },
  { id: "ana", name: "Ana Garcia", goal: "General fitness", workout: "active", diet: "not-set", nextSession: "Nov 20, 8:00 AM", heightM: null, targetKg: null },
];

const exercise = (id, name, sets, reps, rest, load) => ({ id, name, sets, reps, rest, load });

const workoutPlans = [
  { id: "w1", name: "Upper body push", clientId: "juan", duration: "4 weeks", status: "assigned" },
  { id: "w2", name: "Full body circuit", clientId: "maria", duration: "4 weeks", status: "assigned" },
  { id: "w3", name: "Strength foundation", clientId: "carlo", duration: "6 weeks", status: "assigned" },
  { id: "w4", name: "Fitness starter", clientId: "ana", duration: "4 weeks", status: "assigned" },
];

const dietPlans = [
  { id: "d1", name: "Muscle gain nutrition", clientId: "juan", status: "assigned" },
  { id: "d2", name: "Balanced weight loss", clientId: "maria", status: "assigned" },
  { id: "d3", name: "Strength nutrition", clientId: "carlo", status: "assigned" },
  { id: "d4", name: "Balanced daily nutrition", clientId: "ana", status: "draft" },
];

// What the editors show first (copied from the Figma frames).
export const workoutDraftSeed = {
  planId: null,
  basedOn: "w1",
  name: "Upper body push — progression",
  clientId: "juan",
  goal: "Muscle gain",
  duration: "4 weeks",
  frequency: "3 days / week",
  startDate: "2026-11-23",
  notes: "Warm up for 5–10 minutes. Keep 1–2 reps in reserve.",
  attachment: "",
  activeDay: "mon",
  days: [
    {
      id: "mon",
      label: "Mon · Push",
      exercises: [
        exercise("e1", "Barbell bench press", "4", "8–10", "90 sec", "40 kg"),
        exercise("e2", "Incline dumbbell press", "3", "10–12", "60 sec", "15 kg"),
        exercise("e3", "Cable triceps pushdown", "3", "12–15", "60 sec", "20 kg"),
      ],
    },
    { id: "wed", label: "Wed · Pull", exercises: [] },
    { id: "fri", label: "Fri · Legs", exercises: [] },
  ],
};

export const dietDraftSeed = {
  planId: "d4",
  basedOn: "d4",
  name: "Balanced daily nutrition",
  clientId: "ana",
  goal: "General fitness",
  duration: "4 weeks",
  preference: "No restrictions",
  startDate: "2026-11-23",
  waterL: "2.5",
  attachment: "",
  macros: { kcal: "2,200", protein: "140", carbs: "275", fats: "60" },
  meals: [
    { id: "m1", name: "Breakfast", time: "7:00 AM", food: "Oats, Greek yogurt & banana", portion: "1 bowl · 60 g oats, 200 g yogurt, 1 banana", kcal: "500" },
    { id: "m2", name: "Lunch", time: "12:00 PM", food: "Chicken, brown rice & vegetables", portion: "150 g chicken · 200 g rice · 1 cup vegetables", kcal: "700" },
    { id: "m3", name: "Snack", time: "3:00 PM", food: "Greek yogurt & mixed nuts", portion: "200 g yogurt · 30 g nuts", kcal: "350" },
    { id: "m4", name: "Dinner", time: "7:00 PM", food: "Salmon & sweet potato", portion: "150 g salmon · 250 g sweet potato · greens", kcal: "650" },
  ],
};

// Dates are ISO local strings so the UI can work out weekday and end time.
const requests = [
  {
    id: "r1", clientId: "juan", title: "Upper body push", minutes: 60, status: "pending", receivedMin: 15,
    from: "2026-11-20T09:00", to: "2026-11-21T10:00",
    reason: "I have a work commitment on Friday morning. Could we move our session to Saturday at 10 AM?",
  },
  { id: "r2", clientId: "maria", title: "Full body circuit", minutes: 45, status: "pending", receivedMin: 60, from: "2026-11-21T11:00", to: "2026-11-23T11:00", reason: "" },
  { id: "r3", clientId: "ana", title: "Fitness starter", minutes: 45, status: "pending", receivedMin: 120, from: "2026-11-20T08:00", to: "2026-11-21T08:00", reason: "" },
];

// Body metrics are only in Figma for Juan. Other clients start empty.
// Rows after the first are SAMPLE values so the table and chart have history;
// replace them with API data.
const juanChart = [
  [1, 69.4], [3, 70.1], [5, 70.8], [7, 71.2], [10, 71.8], [12, 71.2], [14, 70.9], [16, 71.5],
  [18, 72.1], [20, 72.7], [22, 73.0], [24, 73.3], [26, 73.8], [28, 74.1], [30, 74.5],
];

const metrics = {
  juan: {
    chart: juanChart.map(([day, y]) => ({ day, y })),
    history: [
      { id: "h1", date: "Nov 12, 2026", weight: "78.4", fat: "15.2", muscle: "63.1", bmi: "25.6", note: "Slight water drop, strength up" },
    ],
  },
  maria: { chart: [], history: [] },
  carlo: { chart: [], history: [] },
  ana: { chart: [], history: [] },
};

let state = { clients, workoutPlans, dietPlans, requests, metrics, flash: null };
const listeners = new Set();

const set = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((fn) => fn());
};

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const useTrainerStore = () => useSyncExternalStore(subscribe, () => state);
export const getClient = (id) => state.clients.find((c) => c.id === id);

const updateClient = (id, patch) => set({ clients: state.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
let seq = 100;
const nextId = (prefix) => `${prefix}${++seq}`;

// ---- plans -----------------------------------------------------------------
export function saveWorkoutPlan(draft, status) {
  const id = draft.planId || nextId("w");
  const plan = { id, name: draft.name.trim(), clientId: draft.clientId, duration: draft.duration, status, data: { ...draft, planId: id } };
  const exists = state.workoutPlans.some((p) => p.id === id);
  set({ workoutPlans: exists ? state.workoutPlans.map((p) => (p.id === id ? plan : p)) : [...state.workoutPlans, plan] });
  if (status === "assigned" && draft.clientId) updateClient(draft.clientId, { workout: "active" });
  return id;
}

export function saveDietPlan(draft, status) {
  const id = draft.planId || nextId("d");
  const plan = { id, name: draft.name.trim(), clientId: draft.clientId, status, data: { ...draft, planId: id } };
  const exists = state.dietPlans.some((p) => p.id === id);
  set({ dietPlans: exists ? state.dietPlans.map((p) => (p.id === id ? plan : p)) : [...state.dietPlans, plan] });
  if (status === "assigned" && draft.clientId) updateClient(draft.clientId, { diet: "active" });
  return id;
}

// ---- rescheduling ----------------------------------------------------------
export function resolveRequest(id, status, reply = "", suggestion = "") {
  const req = state.requests.find((r) => r.id === id);
  if (!req) return;
  set({ requests: state.requests.map((r) => (r.id === id ? { ...r, status, reply, suggestion } : r)) });
  if (status === "approved") updateClient(req.clientId, { nextSession: formatShort(req.to) });
}

// ---- metrics ---------------------------------------------------------------
export function saveMetric(clientId, entry) {
  const m = state.metrics[clientId] || { chart: [], history: [] };
  const day = entry.day;
  const chart =
    day > 0
      ? [...m.chart.filter((p) => p.day !== day), { day, y: Number(entry.muscle) }].sort((a, b) => a.day - b.day)
      : m.chart;
  const history = [{ id: nextId("h"), ...entry.row }, ...m.history];
  set({ metrics: { ...state.metrics, [clientId]: { chart, history } } });
}

// ---- shared date helpers ---------------------------------------------------
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const parse = (iso) => {
  const [d, t] = iso.split("T");
  const [y, mo, da] = d.split("-").map(Number);
  const [h, mi] = t.split(":").map(Number);
  return { y, mo: mo - 1, da, h, mi };
};
const clock = (h, mi) => `${((h + 11) % 12) + 1}:${String(mi).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;

export function formatShort(iso) {
  const p = parse(iso);
  return `${MONTHS[p.mo]} ${p.da}, ${clock(p.h, p.mi)}`;
}
export function formatDay(iso) {
  const p = parse(iso);
  return `${DAYS[new Date(p.y, p.mo, p.da).getDay()]}, ${MONTHS[p.mo]} ${p.da}, ${p.y}`;
}
export function formatRange(iso, minutes) {
  const p = parse(iso);
  const end = p.h * 60 + p.mi + minutes;
  const startLabel = clock(p.h, p.mi);
  const endLabel = clock(Math.floor(end / 60) % 24, end % 60);
  // "9:00–10:00 AM" when both are the same half of the day.
  return startLabel.slice(-2) === endLabel.slice(-2)
    ? `${startLabel.slice(0, -3)}–${endLabel}`
    : `${startLabel}–${endLabel}`;
}
export function formatLong(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
export const MONTH_NAMES = MONTHS;
