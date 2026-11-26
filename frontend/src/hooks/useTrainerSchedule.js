import { useCallback, useEffect, useMemo, useState } from "react";
import { completeSession, getSchedule, markNoShow, startSession } from "../services/trainerScheduleService";
import { addDays, startOfWeek, todayIso, weekDays } from "../utils/scheduleDates";

const byTime = (a, b) => a.startTime.localeCompare(b.startTime);

/**
 * State and actions for the trainer "My schedule" page.
 * Backend-agnostic: all I/O goes through services/trainerScheduleService.js.
 */
export function useTrainerSchedule(trainerId) {
    const today = todayIso();
    const [weekStart, setWeekStart] = useState(() => startOfWeek(today));
    const [sessions, setSessions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);

    // Load the visible week.
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        getSchedule(trainerId, weekStart)
            .then((data) => {
                if (cancelled) return;
                const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date) || byTime(a, b));
                setSessions(sorted);
                setSelectedDate((current) => {
                    const days = weekDays(weekStart);
                    if (days.includes(current)) return current;
                    if (days.includes(today)) return today;
                    return sorted[0]?.date ?? weekStart;
                });
                setSelectedId(null);
            })
            .catch((e) => !cancelled && setError(e.message || "Could not load schedule"))
            .finally(() => !cancelled && setLoading(false));
        return () => {
            cancelled = true;
        };
    }, [trainerId, weekStart, today]);

    // First load: if today is empty, jump to the first day that has sessions.
    useEffect(() => {
        if (loading || !sessions.length) return;
        if (!sessions.some((s) => s.date === selectedDate) && selectedDate === today) {
            setSelectedDate(sessions[0].date);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, sessions]);

    const days = useMemo(() => weekDays(weekStart), [weekStart]);

    const countsByDay = useMemo(() => {
        const counts = {};
        sessions.forEach((s) => (counts[s.date] = (counts[s.date] || 0) + 1));
        return counts;
    }, [sessions]);

    const daySessions = useMemo(() => sessions.filter((s) => s.date === selectedDate).sort(byTime), [sessions, selectedDate]);

    const selectedSession = useMemo(() => {
        if (!daySessions.length) return null;
        return (
            daySessions.find((s) => s.id === selectedId) ??
            daySessions.find((s) => s.status === "SCHEDULED" || s.status === "STARTED") ??
            daySessions[0]
        );
    }, [daySessions, selectedId]);

    const summary = useMemo(() => {
        const completed = daySessions.filter((s) => s.status === "COMPLETED").length;
        return { total: daySessions.length, completed, remaining: daySessions.length - completed };
    }, [daySessions]);

    const replaceSession = (updated) => setSessions((list) => list.map((s) => (s.id === updated.id ? updated : s)));

    const runAction = useCallback(async (fn, sessionId) => {
        setBusy(true);
        setError(null);
        try {
            replaceSession(await fn(sessionId));
        } catch (e) {
            setError(e.message || "Action failed");
        } finally {
            setBusy(false);
        }
    }, []);

    return {
        today,
        weekStart,
        days,
        countsByDay,
        selectedDate,
        daySessions,
        selectedSession,
        summary,
        loading,
        busy,
        error,
        selectDate: (iso) => {
            setSelectedDate(iso);
            setSelectedId(null);
        },
        selectSession: setSelectedId,
        nextWeek: () => setWeekStart((w) => addDays(w, 7)),
        prevWeek: () => setWeekStart((w) => addDays(w, -7)),
        thisWeek: () => setWeekStart(startOfWeek(today)),
        start: (id) => runAction(startSession, id),
        complete: (id) => runAction(completeSession, id),
        markNoShow: (id) => runAction(markNoShow, id),
    };
}