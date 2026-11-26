import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTrainerSchedule } from "../../hooks/useTrainerSchedule";
import { DEMO_TRAINER_ID, DEMO_TRAINER_PROFILE } from "../../data/trainerSchedule";
import { formatShortDate, formatWeekRange, weekdayLong } from "../../utils/scheduleDates";
import SectionCard from "../../components/SectionCard";
import TrainerLayout from "../../components/trainer/TrainerLayout";
import WeekStrip from "../../components/trainer/WeekStrip";
import SessionListItem from "../../components/trainer/SessionListItem";
import SessionDetailPanel from "../../components/trainer/SessionDetailPanel";

export default function TrainerSchedulePage() {
    const navigate = useNavigate();
    const auth = useAuth() ?? {};

    // Falls back to the seeded demo trainer until the logged-in user's shape is wired here.
    const trainer = {
        ...DEMO_TRAINER_PROFILE,
        id: auth.user?.id ?? DEMO_TRAINER_ID,
        fullName: auth.user?.fullName ?? DEMO_TRAINER_PROFILE.fullName,
    };
    const logout = () => {
        (auth.logoutUser ?? auth.logout)?.();
        navigate("/login");
    };

    const s = useTrainerSchedule(trainer.id);
    const todayCount = s.countsByDay[s.today] || 0;
    const subtitle = "Manage your sessions and record each client's attendance.";

    return (
        <TrainerLayout activeKey="schedule" pageTitle="My schedule" subtitle={subtitle} trainer={trainer} onLogout={logout}>
            <div className="flex items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="font-ui text-lg font-bold">{formatWeekRange(s.weekStart)}</h2>
                        <button type="button" onClick={s.prevWeek} aria-label="Previous week" className="rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white">
                            <ChevronLeft size={18} />
                        </button>
                        <button type="button" onClick={s.nextWeek} aria-label="Next week" className="rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                    <p className="mt-1 font-body text-xs text-slate-400">
                        {todayCount} {todayCount === 1 ? "session" : "sessions"} today · {formatShortDate(s.today)}
                    </p>
                </div>
                <p className="font-body text-[11px] text-slate-500">All times local</p>
            </div>

            <WeekStrip days={s.days} selectedIso={s.selectedDate} todayIso={s.today} countsByDay={s.countsByDay} onSelect={s.selectDate} />

            {s.error && (
                <p role="alert" className="rounded-xl bg-rose-950/60 px-4 py-3 font-body text-sm text-rose-200">
                    {s.error}
                </p>
            )}

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                <SectionCard
                    title={`${weekdayLong(s.selectedDate)}'s sessions`}
                    delay={160}
                    right={
                        <span className="font-body text-[11px] text-slate-400">
              {s.summary.completed} completed · {s.summary.remaining} remaining
            </span>
                    }
                >
                    <div className="flex flex-col gap-3" aria-busy={s.loading}>
                        {s.loading && <p className="py-8 text-center font-body text-sm text-slate-500">Loading schedule…</p>}
                        {!s.loading && s.daySessions.length === 0 && (
                            <p className="py-8 text-center font-body text-sm text-slate-500">No sessions scheduled for this day.</p>
                        )}
                        {!s.loading &&
                            s.daySessions.map((session, i) => (
                                <SessionListItem
                                    key={session.id}
                                    session={session}
                                    selected={session.id === s.selectedSession?.id}
                                    onSelect={s.selectSession}
                                    delay={i * 60}
                                />
                            ))}
                    </div>
                    <p className="mt-5 font-body text-[11px] text-slate-500">Review the selected session's attendance on the right.</p>
                </SectionCard>

                <SessionDetailPanel
                    session={s.selectedSession}
                    busy={s.busy}
                    onStart={s.start}
                    onComplete={s.complete}
                    onNoShow={s.markNoShow}
                    onViewProgress={(session) => navigate(`/trainer/members/${session.memberId}/progress`)}
                />
            </div>
        </TrainerLayout>
    );
}