// Dummy data for the trainer schedule.
//
// Session shape mirrors the backend `TrainingSession` model (id, memberId, trainerId, title,
// date, startTime, durationMinutes, status) plus a few fields the API will need to join in
// (memberName, focus, note). When the backend endpoint exists, only
// services/trainerScheduleService.js needs to change; nothing here is imported by the UI.
//
// Status values:
//   COMPLETED  - finished (backend Status.COMPLETED)
//   STARTED    - trainer started it (backend Status.STARTED)
//   NO_SHOW    - client did not attend (backend Status.NO_SHOW)
//   SCHEDULED  - due now, awaiting the trainer to start / mark no-show
//   UPCOMING   - later today / later in the week (UI label only; the backend can derive this
//                from date + startTime, so it does not need to be stored)

import { addDays, startOfWeek } from "../utils/scheduleDates";

export const DEMO_TRAINER_ID = "T-TEST-001";

// Keyed by day offset from Monday (0 = Mon ... 6 = Sun).
const WEEK_TEMPLATE = {
    4: [
        { memberId: "M-002", memberName: "Ana Garcia", title: "Fitness starter", focus: "Personal training", startTime: "08:00:00", durationMinutes: 45, status: "COMPLETED" },
        { memberId: "M-TEST-001", memberName: "Juan Dela Cruz", title: "Upper body push", focus: "Personal training", startTime: "09:00:00", durationMinutes: 60, status: "SCHEDULED", note: "Awaiting acknowledgement" },
        { memberId: "M-003", memberName: "Maria Santos", title: "Full body circuit", focus: "Personal training", startTime: "11:00:00", durationMinutes: 45, status: "UPCOMING" },
        { memberId: "M-004", memberName: "Carlo Reyes", title: "Strength foundation", focus: "Personal training", startTime: "14:00:00", durationMinutes: 60, status: "UPCOMING" },
    ],
    5: [
        { memberId: "M-005", memberName: "Rafael Lim", title: "Mobility and core", focus: "Personal training", startTime: "10:00:00", durationMinutes: 45, status: "UPCOMING" },
        { memberId: "M-006", memberName: "Bea Navarro", title: "Lower body strength", focus: "Personal training", startTime: "13:00:00", durationMinutes: 60, status: "UPCOMING" },
    ],
};

export function buildSeedWeek(weekStartIso, trainerId = DEMO_TRAINER_ID) {
    const monday = startOfWeek(weekStartIso);
    return Object.entries(WEEK_TEMPLATE).flatMap(([offset, rows]) => {
        const date = addDays(monday, Number(offset));
        return rows.map((row, i) => ({
            id: `TS-${date}-${i + 1}`,
            trainerId,
            date,
            note: null,
            ...row,
        }));
    });
}

export const DEMO_TRAINER_PROFILE = {
    id: DEMO_TRAINER_ID,
    fullName: "John Smith",
    title: "Personal trainer",
    avatarSrc: null,
};