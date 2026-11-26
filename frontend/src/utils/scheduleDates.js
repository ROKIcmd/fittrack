// Local-time date helpers for the trainer schedule.
// All dates are "YYYY-MM-DD" strings (same shape the backend's LocalDate serialises to).
// Deliberately avoids toISOString(), which shifts the day for UTC+ timezones.

const pad = (n) => String(n).padStart(2, "0");

export const formatMediumDate = (iso) =>
    fromIso(iso).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

/** "9:00-10:00 AM" (no duration suffix) */
export function formatTimeSpan(time, durationMinutes) {
    const strip = (t) => formatTime(t).replace(/^0/, "");
    const start = strip(time);
    const end = strip(endTime(time, durationMinutes));
    const [sTime, sMer] = start.split(" ");
    const [, eMer] = end.split(" ");
    return `${sMer === eMer ? sTime : start}-${end}`;
}

export const toIso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fromIso = (s) => {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
};

export const todayIso = () => toIso(new Date());

export const addDays = (iso, n) => {
    const d = fromIso(iso);
    d.setDate(d.getDate() + n);
    return toIso(d);
};

/** Monday of the week containing `iso`. */
export const startOfWeek = (iso) => {
    const d = fromIso(iso);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    return toIso(d);
};

export const weekDays = (weekStartIso) => Array.from({ length: 7 }, (_, i) => addDays(weekStartIso, i));

/** "November 16–22, 2026" (or "November 30 – December 6, 2026" across months). */
export function formatWeekRange(weekStartIso) {
    const a = fromIso(weekStartIso);
    const b = fromIso(addDays(weekStartIso, 6));
    const month = (d) => d.toLocaleDateString("en-US", { month: "long" });
    const sameMonth = a.getMonth() === b.getMonth();
    const range = sameMonth
        ? `${month(a)} ${a.getDate()}–${b.getDate()}`
        : `${month(a)} ${a.getDate()} – ${month(b)} ${b.getDate()}`;
    return `${range}, ${b.getFullYear()}`;
}

/** "Friday, November 20, 2026" */
export const formatLongDate = (iso) =>
    fromIso(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

/** "Fri, Nov 20" */
export const formatShortDate = (iso) =>
    fromIso(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

export const weekdayShort = (iso) =>
    fromIso(iso).toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();

export const weekdayLong = (iso) => fromIso(iso).toLocaleDateString("en-US", { weekday: "long" });

const toMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
};

/** "09:00:00" -> "09:00 AM" */
export function formatTime(time) {
    const mins = toMinutes(time) % (24 * 60);
    const h24 = Math.floor(mins / 60);
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${pad(h12)}:${pad(mins % 60)} ${h24 < 12 ? "AM" : "PM"}`;
}

export const endTime = (time, durationMinutes) => {
    const mins = (toMinutes(time) + durationMinutes) % (24 * 60);
    return `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}:00`;
};

/** "9:00–10:00 AM · 60 minutes" */
export function formatTimeRange(time, durationMinutes) {
    const strip = (t) => formatTime(t).replace(/^0/, "");
    const start = strip(time);
    const end = strip(endTime(time, durationMinutes));
    const [sTime, sMer] = start.split(" ");
    const [, eMer] = end.split(" ");
    return `${sMer === eMer ? sTime : start}–${end} · ${durationMinutes} minutes`;
}