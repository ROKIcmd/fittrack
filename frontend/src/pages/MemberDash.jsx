import { AnimationStyles, Animate } from "../Styles/Animations.jsx";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardTitle,
    PillButton,
    StatusBadge,
    ProgressBar,
    StatCard,
    WorkoutLogItem,
    UpdateItem,
    Sidebar,
    Breadcrumb,
    ProfilePill,
    LineChart,
    Icon,
    fonts,
} from "../components/MemberDashComp.jsx";

/* ------------------------------------------------------------------ */
/* Sample data – replace with your API data later                      */
/* ------------------------------------------------------------------ */
const NAV_ITEMS = [
    { label: "Dashboard", icon: Icon.Home, href: "/member/dashboard", active: true },
    { label: "Membership", icon: Icon.Sparkle, href: "/member/membership" },
    { label: "Trainer", icon: Icon.UserCircle, href: "/member/trainer" },
    { label: "Workout Plan", icon: Icon.Dumbbell, href: "/member/plan" },
    { label: "Workout Log", icon: Icon.Clipboard, href: "/member/log" },
    { label: "Progress", icon: Icon.TrendUp, href: "/member/progress" },
    { label: "Profile", icon: Icon.Gear, href: "/member/profile" },
]

const MEMBERSHIP = { tier: "Gold", plan: "Monthly", progress: 84.5, remaining: "3 days remaining", renews: "Nov 17, 2026" }

const SCHEDULE = { date: "Nov 14, 2026 | Sat", category: "Legs" }

const WORKOUT_LOG = [
    { title: "Upper Body Push", status: "completed" },
    { title: "Upper Body Push", status: "completed" },
    { title: "Upper Body Push", status: "rescheduled" },
    { title: "Upper Body Push", status: "completed" },
    { title: "Upper Body Push", status: "completed" },
    { title: "Upper Body Push", status: "completed" },
].map((w) => ({ ...w, meta: ["Nov 12, 2026 | 45 min | 40kg", "6/6 Excercies"] }))

const MUSCLE_DATA = [
    { x: 1, y: 69.4 },
    { x: 3, y: 70.1 },
    { x: 5, y: 70.8 },
    { x: 7, y: 71.3 },
    { x: 9, y: 71.8 },
    { x: 12, y: 70.9 },
    { x: 14, y: 71.5 },
    { x: 16, y: 72.0 },
    { x: 18, y: 72.7 },
    { x: 20, y: 72.9 },
    { x: 22, y: 73.2 },
    { x: 24, y: 73.7 },
    { x: 26, y: 74.0 },
    { x: 28, y: 74.2 },
    { x: 30, y: 74.5 },
]
const X_TICKS = [1, 7, 14, 21, 28, 30].map((d) => ({ value: d, label: `Nov ${d}` }))
const Y_TICKS = [68, 70, 72, 74, 76]

const STATS = [
    { label: "Current Weight", value: 78.4, unit: "kg" },
    { label: "Body fat %", value: 15.2, unit: "%" },
    { label: "Muscle mass", value: 63.1, unit: "kg" },
    { label: "BMI Index", value: 25.6, unit: "" },
]

const UPDATES = [
    { title: "Membership Renewal Approved", date: "Nov 18, 2026" },
    { title: "Trainer Updated Body Metrics", date: "Nov 16, 2026" },
    { title: "Reschedule Declined", date: "Nov 15, 2026" },
    { title: "Reschedule Approved", date: "Nov 13, 2026" },
]

const TRAINER = { name: "Smith, John", experience: "5 years", clients: 4 }

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
function MemberDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear session/token if you're using one
        localStorage.removeItem("token");

        // Redirect to login page
        navigate("/");
    };

    return (
        <>
            <AnimationStyles />

            <div className="relative min-h-screen w-full overflow-hidden bg-[#090e16] text-white">
                {/* Background photo + dark overlay that fades into the page colour */}
                <img
                    src="/images/gym-bg.png"
                    alt=""
                    className="anim-bg pointer-events-none absolute left-0 top-0 h-[780px] w-full object-cover opacity-60"
                />
                <div className="pointer-events-none absolute left-0 top-0 h-[780px] w-full bg-gradient-to-b from-black/70 via-black/75 to-[#090e16]" />

                <div className="relative z-10 mx-auto flex max-w-[1340px] gap-6 px-4 py-6 sm:px-6">
                    <Sidebar items={NAV_ITEMS} onLogout={handleLogout} />

                    <main className="min-w-0 flex-1">
                        {/* ---------- Top bar ---------- */}
                        <header className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <Animate type="left" delay={0.1}>
                                    <Breadcrumb label="Dashboard" />
                                </Animate>
                                <Animate
                                    as="h1"
                                    type="up"
                                    delay={0.2}
                                    className={`${fonts.ui} mt-5 text-3xl font-semibold sm:text-4xl`}
                                >
                                    Welcome, <span className="text-[#60a5fa]">Juan!</span>
                                </Animate>
                            </div>
                            <Animate type="card">
                                <ProfilePill name="Dela Cruz, Juan" />
                            </Animate>
                        </header>

                        {/* ---------- Main grid ---------- */}
                        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_426px]">
                            {/* LEFT COLUMN */}
                            <div className="flex flex-col gap-5">
                                {/* Membership */}
                                <Animate type="up" delay={0.3}>
                                    <Card className="p-6">
                                        <CardTitle>Membership</CardTitle>

                                        <div className="mt-2 flex items-center gap-4">
                                            <span className={`${fonts.heading} flex items-center gap-2 text-3xl text-[#ffe34b]`}>
                                                <Icon.Sparkle size={22} />
                                                {MEMBERSHIP.tier}
                                            </span>
                                            <span className="h-4 w-px bg-white/40" />
                                            <span className={`${fonts.body} text-3xl`}>{MEMBERSHIP.plan}</span>
                                        </div>

                                        <StatusBadge status="active" className="mt-2 !px-3 !py-0.5 !text-sm">
                                            Active
                                        </StatusBadge>

                                        <div className="mt-5">
                                            <ProgressBar value={MEMBERSHIP.progress} />
                                            <div className={`${fonts.body} mt-3 flex items-center justify-between text-base`}>
                                                <span>{MEMBERSHIP.remaining}</span>
                                                <span className="h-4 w-px bg-white/40" />
                                                <span>Renew {MEMBERSHIP.renews}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-end">
                                            <PillButton variant="outline" size="sm" href="/member/membership">
                                                Manage →
                                            </PillButton>
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

                                                <button
                                                    type="button"
                                                    className={`${fonts.ui} flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-1.5 text-xs transition hover:border-[#3b82f6] hover:bg-white/10`}
                                                >
                                                    November 2026
                                                    <Icon.ChevronDown size={14} />
                                                </button>
                                            </div>

                                            <div className="mt-2">
                                                <LineChart
                                                    data={MUSCLE_DATA}
                                                    xTicks={X_TICKS}
                                                    yTicks={Y_TICKS}
                                                    yLabel="Muscle Mass (kg)"
                                                    highlightLabel={{ title: "74.5 kg", sub: "Nov 30" }}
                                                />
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
                                            <StatusBadge
                                                status="upcoming"
                                                className="!border !px-2.5 !py-0.5 !text-[11px]"
                                            >
                                                Upcoming
                                            </StatusBadge>
                                        </div>
                                        <div className={`${fonts.body} mt-1 space-y-1 pl-6 text-base font-bold`}>
                                            <p>Date/Day: {SCHEDULE.date}</p>
                                            <p>Routine Category: {SCHEDULE.category}</p>
                                        </div>
                                        <div className="mt-1 flex justify-end">
                                            <a
                                                href="/member/plan"
                                                className={`link-underline ${fonts.mono} text-xs font-bold text-[#3b82f6] hover:text-[#60a5fa]`}
                                            >
                                                Reschedule →
                                            </a>
                                        </div>
                                    </Card>
                                </Animate>

                                {/* Recent workout log */}
                                <Animate type="up" delay={0.5}>
                                    <Card className="p-5">
                                        <div className="flex items-center justify-between">
                                            <h2 className={`${fonts.heading} text-lg`}>Recent Workout Log</h2>
                                            <PillButton size="sm" href="/member/log">
                                                View Logs
                                            </PillButton>
                                        </div>
                                        <div className="mt-2 h-px w-full bg-white/25" />

                                        <div className="mt-4 space-y-3">
                                            {WORKOUT_LOG.map((w, i) => (
                                                <WorkoutLogItem
                                                    key={i}
                                                    title={w.title}
                                                    meta={w.meta}
                                                    status={w.status}
                                                    delay={0.7 + i * 0.08}
                                                />
                                            ))}
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
                                        {STATS.map((s, i) => (
                                            <StatCard
                                                key={s.label}
                                                label={s.label}
                                                value={s.value}
                                                unit={s.unit}
                                                delay={0.7 + i * 0.1}
                                            />
                                        ))}
                                    </div>
                                </Card>
                            </Animate>

                            {/* Updates */}
                            <Animate type="up" delay={0.7}>
                                <Card className="h-full p-5">
                                    <h2 className={`${fonts.heading} text-base`}>Updates</h2>
                                    <div className="mt-1 h-[3px] w-full rounded bg-white" />
                                    <div className="mt-4 space-y-3">
                                        {UPDATES.map((u, i) => (
                                            <UpdateItem key={u.title} {...u} delay={0.9 + i * 0.1} />
                                        ))}
                                    </div>
                                </Card>
                            </Animate>

                            {/* Personal trainer */}
                            <Animate type="up" delay={0.8} className="md:col-span-2 xl:col-span-1">
                                <Card className="flex h-full flex-col p-5">
                                    <h2 className={`${fonts.heading} text-base`}>Personal Trainer</h2>

                                    <div className="mt-6 flex flex-1 items-center gap-5">
                                        <img
                                            src="/images/trainer.png"
                                            alt={`Trainer ${TRAINER.name}`}
                                            className="h-[127px] w-[137px] shrink-0 rounded-[25px] object-cover shadow-lg transition-transform duration-500 hover:scale-105"
                                        />
                                        <span className="anim-float text-white">
                                            <Icon.Sparkle size={30} />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className={`${fonts.heading} text-xl`}>{TRAINER.name}</p>
                                            <div className="my-2 h-px w-full bg-white/50" />
                                            <p className={`${fonts.body} text-xs leading-snug`}>
                                                Experience: {TRAINER.experience}
                                                <br />
                                                Current Clients: {TRAINER.clients}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-center">
                                        <PillButton size="sm" href="/member/trainer">
                                            Trainer Profile
                                        </PillButton>
                                    </div>
                                </Card>
                            </Animate>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default MemberDashboard
