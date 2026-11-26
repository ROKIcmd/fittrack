// Trainer schedule data access.
//
// The UI only talks to these four functions. They currently run against an in-memory mock
// (seeded from data/trainerSchedule.js). To go live, implement the REST branches below
// (endpoints are suggestions that mirror the TrainingSession model's start() / complete() /
// markNoShow() methods) and set VITE_USE_MOCK_SCHEDULE=false. No UI changes needed.
//
//   GET  /api/trainers/{trainerId}/schedule?weekStart=YYYY-MM-DD  -> TrainerSession[]
//   POST /api/sessions/{sessionId}/start                          -> TrainerSession
//   POST /api/sessions/{sessionId}/complete                       -> TrainerSession
//   POST /api/sessions/{sessionId}/no-show                        -> TrainerSession
//
// TrainerSession = {
//   id, trainerId, memberId, memberName, title, focus,
//   date: "YYYY-MM-DD", startTime: "HH:mm:ss", durationMinutes,
//   status: "SCHEDULED" | "UPCOMING" | "STARTED" | "COMPLETED" | "NO_SHOW",
//   note: string | null
// }

import { apiFetch } from "./api";
import { buildSeedWeek } from "../data/trainerSchedule";

const USE_MOCK = import.meta.env.VITE_USE_MOCK_SCHEDULE !== "false";
const MOCK_LATENCY_MS = 250;

// ---- Mock implementation ---------------------------------------------------------------

const mockWeeks = new Map(); // weekStart -> session[]
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function mockWeek(weekStart, trainerId) {
    if (!mockWeeks.has(weekStart)) mockWeeks.set(weekStart, buildSeedWeek(weekStart, trainerId));
    return mockWeeks.get(weekStart);
}

function mockUpdate(sessionId, changes) {
    for (const sessions of mockWeeks.values()) {
        const session = sessions.find((s) => s.id === sessionId);
        if (session) {
            Object.assign(session, changes);
            return { ...session };
        }
    }
    throw new Error(`Session ${sessionId} not found`);
}

// ---- Public API ------------------------------------------------------------------------

export async function getSchedule(trainerId, weekStart) {
    if (USE_MOCK) {
        await wait(MOCK_LATENCY_MS);
        return mockWeek(weekStart, trainerId).map((s) => ({ ...s }));
    }
    return apiFetch(`/api/trainers/${trainerId}/schedule?weekStart=${weekStart}`);
}

export async function startSession(sessionId) {
    if (USE_MOCK) {
        await wait(MOCK_LATENCY_MS);
        return mockUpdate(sessionId, { status: "STARTED", note: null });
    }
    return apiFetch(`/api/sessions/${sessionId}/start`, { method: "POST" });
}

export async function completeSession(sessionId) {
    if (USE_MOCK) {
        await wait(MOCK_LATENCY_MS);
        return mockUpdate(sessionId, { status: "COMPLETED", note: null });
    }
    return apiFetch(`/api/sessions/${sessionId}/complete`, { method: "POST" });
}

export async function markNoShow(sessionId) {
    if (USE_MOCK) {
        await wait(MOCK_LATENCY_MS);
        return mockUpdate(sessionId, { status: "NO_SHOW", note: null });
    }
    return apiFetch(`/api/sessions/${sessionId}/no-show`, { method: "POST" });
}