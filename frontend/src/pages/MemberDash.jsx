import { AnimationStyles, Animate } from "../Styles/Animations.jsx";
import { Navigate, Link } from "react-router-dom";
import { House } from "lucide-react";
import MemberLayout from "../components/MemberLayout";
import {
    Card,
    CardTitle,
    PillButton,
    StatusBadge,
    ProgressBar,
    StatCard,
    WorkoutLogItem,
    UpdateItem,
    LineChart,
    Icon,
    fonts,
} from "../components/MemberDashComp.jsx";
import { useAuth } from "../context/AuthContext";
import { dashboardService } from "../services/dashboardService";
import { useDashboard } from "../hooks/useDashboard";

/* ------------------------------------------------------------------ */
/* Formatting helpers                                                  */
/* ------------------------------------------------------------------ */
// Parses "2026-11-27" as a local date (new Date("2026-11-27") would be UTC)
function parseDate(value) {
    if (!value) return null;
    const [y, m, d] = String(value).split("-").map(Number);
    return new Date(y, m - 1, d);
}

function fmtDate(value, opts = { month: "short", day: "numeric", year: "numeric" }) {
    const d = parseDate(value);
    return d ? d.toLocaleDateString("en-US", opts) : "";
}

// For LocalDateTime strings like "2026-11-25T10:30:00"
function fmtDateTime(value) {
    if (!value) return "";
    return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function titleCase(s) {
    return s ? s.charAt(0) + s.slice(1).toLowerCase() : "";
}

function formatTime(value) {
    // "18:00:00" -> "6:00 PM"
    if (!value) return "";
    const [h, m] = String(value).split(":").map(Number);
    const d = new Date(2000, 0, 1, h, m);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// Turns the backend's muscle progress points into the shape LineChart expects
function buildChart(points) {
    if (!points || points.length === 0) {
        return { data: [], xTicks: [], yTicks: [], last: null };
    }

    const origin = parseDate(points[0].date);
    const data = points.map((p) => ({
        x: Math.round((parseDate(p.date) - origin) / 86400000), // days since first check-in
        y: p.muscleMassKg,
    }));

    const step = Math.max(1, Math.ceil(points.length / 6));
    const xTicks = points
        .map((p, i) => ({ value: data[i].x, label: fmtDate(p.date, { month: "short", day: "numeric" }) }))
        .filter((_, i) => i % step === 0 || i === points.length - 1);

    const ys = data.map((d) => d.y);
    const lo = Math.floor(Math.min(...ys));
    const hi = Math.max(Math.ceil(Math.max(...ys)), lo + 2);
    const tickStep = Math.ceil((hi - lo) / 4);
    const yTicks = [];
    for (let v = lo; v <= hi; v += tickStep) yTicks.push(v);

    const lastPoint = points[points.length - 1];
    return {
        data,
        xTicks,
        yTicks,
        last: { title: `${lastPoint.muscleMassKg} kg`, sub: fmtDate(lastPoint.date, { month: "short", day: "numeric" }) },
    };
}

function Empty({ children }) {
    return <p className={`${fonts.body} text-sm text-white/60`}>{children}</p>;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
function MemberDashboard() {
    const { user } = useAuth();
    const { data, loading, error } = useDashboard(dashboardService.getMemberDashboard, user?.id);

    if (!user) return <Navigate to="/login" replace />;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#090e16] text-white">
                <p className={fonts.body}>Loading your dashboard…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#090e16] text-red-400">
                <p className={fonts.body}>{error}</p>
            </div>
        );
    }

    const {
        firstName,
        membership,
        upcomingSession,
        recentWorkouts = [],
        muscleGainProgress = [],
        bodyStats,
        notifications = [],
        trainer,
    } = data;

    const chart = buildChart(muscleGainProgress);
    const chartMonth = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

    return (
        <>
            <AnimationStyles />
            {/* Sidebar, top bar, "Welcome" heading and background now come from the shared MemberLayout */}
            <MemberLayout pageTitle="Dashboard" PageIcon={House} userName={user.fullName} firstName={firstName}>
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_426px]">
                            {/* LEFT COLUMN */}
                            <div className="flex flex-col gap-5">
                                {/* Membership */}
                                <Animate type="up" delay={0.3}>
                                    <Card className="p-6">
                                        <CardTitle>Membership</CardTitle>

                                        {membership ? (
                                            <>
                                                <div className="mt-2 flex items-center gap-4">
                                                    <span className={`${fonts.heading} flex items-center gap-2 text-3xl text-[#ffe34b]`}>
                                                        <Icon.Sparkle size={22} />
                                                        {titleCase(membership.tier)}
                                                    </span>
                                                    <span className="h-4 w-px bg-white/40" />
                                                    <span className={`${fonts.body} text-3xl`}>
                                                        {titleCase(membership.cycle)}
                                                    </span>
                                                </div>

                                                <StatusBadge
                                                    status={membership.active ? "active" : "expired"}
                                                    className="mt-2 !px-3 !py-0.5 !text-sm"
                                                >
                                                    {membership.active ? "Active" : "Expired"}
                                                </StatusBadge>

                                                <div className="mt-5">
                                                    <ProgressBar value={membership.progress} />
                                                    <div className={`${fonts.body} mt-3 flex items-center justify-between text-base`}>
                                                        <span>{membership.daysRemaining} days remaining</span>
                                                        <span className="h-4 w-px bg-white/40" />
                                                        <span>Renew {fmtDate(membership.renewalDate)}</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <Empty>No membership on record.</Empty>
                                        )}

                                        <div className="mt-4 flex justify-end">
                                            <PillButton variant="outline" size="sm" to="/member/membership">Manage →</PillButton>
                                        </div>
                                    </Card>
                                </Animate>

                                {/* Muscle gain chart */}
                                <Animate type="up" delay={0.45}>
                                    <Card className="border-[#2b394c] bg-gradient-to-br from-[#0c1a33] via-[#0b1730] to-[#0a1224] p-5">
                                        <div className="rounded-2xl border border-[#1e3a6b]/60 bg-[#071226]/70 p-4 shadow-[inset_0_0_30px_rgba(59,130,246,0.12)]">
                                            <div className="flex flex-wrap items-center justify-between gap-3">
                                                <h2 className={`${fonts.ui} flex items-center gap-3 text-lg font-semibold`}>
                                                    <span className="text-[#3b82f6]">
                                                        <Icon.GraphUp size={30} />
                                                    </span>
                                                    <span>
                                                        Muscle Gain <span className="text-[#3b82f6]">Progress</span>
                                                    </span>
                                                </h2>

                                                <span className={`${fonts.ui} rounded-full border border-white/25 bg-white/5 px-4 py-1.5 text-xs`}>
                                                    {chartMonth}
                                                </span>
                                            </div>

                                            <div className="mt-2">
                                                {chart.data.length > 0 ? (
                                                    <LineChart
                                                        data={chart.data}
                                                        xTicks={chart.xTicks}
                                                        yTicks={chart.yTicks}
                                                        yLabel="Muscle Mass (kg)"
                                                        highlightLabel={chart.last}
                                                    />
                                                ) : (
                                                    <Empty>No body metrics recorded yet.</Empty>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </Animate>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="flex flex-col gap-5">
                                {/* Schedule */}
                                <Animate type="up" delay={0.35}>
                                    <Card className="relative p-4">
                                        <div className="flex items-start justify-between">
                                            <h2 className={`${fonts.heading} text-sm`}>Schedule</h2>
                                            {upcomingSession && (
                                                <StatusBadge status="upcoming" className="!border !px-2.5 !py-0.5 !text-[11px]">
                                                    Upcoming
                                                </StatusBadge>
                                            )}
                                        </div>

                                        {upcomingSession ? (
                                            <div className={`${fonts.body} mt-1 space-y-1 pl-6 text-base font-bold`}>
                                                <p>
                                                    Date/Day: {fmtDate(upcomingSession.date, { month: "short", day: "numeric", year: "numeric", weekday: "short" })}
                                                    {" | "}{formatTime(upcomingSession.startTime)}
                                                </p>
                                                <p>Routine Category: {upcomingSession.routineCategory}</p>
                                            </div>
                                        ) : (
                                            <div className="mt-1 pl-6">
                                                <Empty>No upcoming session scheduled.</Empty>
                                            </div>
                                        )}

                                        <div className="mt-1 flex justify-end">
                                            <Link
                                                to="/member/workout-plan"
                                                className={`link-underline ${fonts.mono} text-xs font-bold text-[#3b82f6] hover:text-[#60a5fa]`}
                                            >
                                                Reschedule →
                                            </Link>
                                        </div>
                                    </Card>
                                </Animate>

                                {/* Recent workout log */}
                                <Animate type="up" delay={0.5}>
                                    <Card className="p-5">
                                        <div className="flex items-center justify-between">
                                            <h2 className={`${fonts.heading} text-lg`}>Recent Workout Log</h2>
                                            <PillButton size="sm" to="/member/workout-log">View Logs</PillButton>
                                        </div>
                                        <div className="mt-2 h-px w-full bg-white/25" />

                                        <div className="mt-4 space-y-3">
                                            {recentWorkouts.length > 0 ? (
                                                recentWorkouts.map((w, i) => (
                                                    <WorkoutLogItem
                                                        key={w.id}
                                                        title={w.title}
                                                        meta={[
                                                            `${fmtDate(w.date, { month: "short", day: "numeric", year: "numeric" })} | ${w.durationMinutes} min | ${w.loadKg}kg`,
                                                            `${w.exercisesCompleted}/${w.totalExercises} Exercises`,
                                                        ]}
                                                        status={w.status.toLowerCase()}
                                                        delay={0.7 + i * 0.08}
                                                    />
                                                ))
                                            ) : (
                                                <Empty>No workouts logged yet.</Empty>
                                            )}
                                        </div>
                                    </Card>
                                </Animate>
                            </div>
                        </div>

                        {/* ---------- Bottom row ---------- */}
                        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-[200px_minmax(0,1fr)_426px]">
                            {/* Body stats */}
                            <Animate type="up" delay={0.6}>
                                <Card className="h-full p-2.5" hover={false}>
                                    <div className="flex h-full flex-col gap-2.5">
                                        {bodyStats ? (
                                            [
                                                { label: "Current Weight", value: bodyStats.weightKg, unit: "kg" },
                                                { label: "Body fat %", value: bodyStats.bodyFatPercent, unit: "%" },
                                                { label: "Muscle mass", value: bodyStats.muscleMassKg, unit: "kg" },
                                                { label: "BMI Index", value: bodyStats.bmi, unit: "" },
                                            ].map((s, i) => (
                                                <StatCard
                                                    key={s.label}
                                                    label={s.label}
                                                    value={s.value}
                                                    unit={s.unit}
                                                    delay={0.7 + i * 0.1}
                                                />
                                            ))
                                        ) : (
                                            <div className="p-2"><Empty>No body stats yet.</Empty></div>
                                        )}
                                    </div>
                                </Card>
                            </Animate>

                            {/* Updates */}
                            <Animate type="up" delay={0.7}>
                                <Card className="h-full p-5">
                                    <h2 className={`${fonts.heading} text-base`}>Updates</h2>
                                    <div className="mt-1 h-[3px] w-full rounded bg-white" />
                                    <div className="mt-4 space-y-3">
                                        {notifications.length > 0 ? (
                                            notifications.map((n, i) => (
                                                <UpdateItem
                                                    key={`${n.createdAt}-${i}`}
                                                    title={n.title}
                                                    date={fmtDateTime(n.createdAt)}
                                                    delay={0.9 + i * 0.1}
                                                />
                                            ))
                                        ) : (
                                            <Empty>No updates.</Empty>
                                        )}
                                    </div>
                                </Card>
                            </Animate>

                            {/* Personal trainer */}
                            <Animate type="up" delay={0.8} className="md:col-span-2 xl:col-span-1">
                                <Card className="flex h-full flex-col p-5">
                                    <h2 className={`${fonts.heading} text-base`}>Personal Trainer</h2>

                                    {trainer ? (
                                        <>
                                            <div className="mt-6 flex flex-1 items-center gap-5">
                                                <img
                                                    src="/images/trainer.png"
                                                    alt={`Trainer ${trainer.fullName}`}
                                                    className="h-[127px] w-[137px] shrink-0 rounded-[25px] object-cover shadow-lg transition-transform duration-500 hover:scale-105"
                                                />
                                                <span className="anim-float text-white">
                                                    <Icon.Sparkle size={30} />
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <p className={`${fonts.heading} text-xl`}>{trainer.fullName}</p>
                                                    <div className="my-2 h-px w-full bg-white/50" />
                                                    <p className={`${fonts.body} text-xs leading-snug`}>
                                                        Experience: {trainer.yearsOfExperience} years
                                                        <br />
                                                        Current Clients: {trainer.currentClients}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex justify-center">
                                                <PillButton size="sm" to="/member/trainer">Trainer Profile</PillButton>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="mt-6">
                                            <Empty>No trainer assigned yet.</Empty>
                                        </div>
                                    )}
                                </Card>
                            </Animate>
                        </div>
            </MemberLayout>
        </>
    );
}

export default MemberDashboard;