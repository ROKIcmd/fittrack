import { CalendarClock, CalendarDays, Dumbbell, House, LogOut, TrendingUp, Utensils } from "lucide-react";
import { Logo, ProfilePill, SidebarNavItem } from "../MemberDashComp";

export const TRAINER_NAV = [
    { key: "dashboard", label: "Dashboard", href: "/trainer/dashboard", icon: House },
    { key: "workout-plans", label: "Workout plans", href: "/trainer/workout-plans", icon: Dumbbell },
    { key: "diet-plans", label: "Diet plans", href: "/trainer/diet-plans", icon: Utensils },
    { key: "rescheduling", label: "Rescheduling", href: "/trainer/rescheduling", icon: CalendarClock },
    { key: "body-metrics", label: "Body Metrics", href: "/trainer/body-metrics", icon: TrendingUp },
];
const SCHEDULE_NAV = { key: "schedule", label: "My schedule", href: "/trainer/schedule", icon: CalendarDays };

export default function TrainerLayout({
                                          activeKey,
                                          pageTitle,
                                          subtitle,
                                          trainer,
                                          onLogout,
                                          backgroundSrc = "/assets/trainer-bg.png",
                                          children,
                                      }) {
    const renderItem = (item, i) => (
        <SidebarNavItem key={item.key} icon={item.icon} label={item.label} href={item.href} active={item.key === activeKey} delay={i * 50} />
    );

    return (
        <div className="min-h-screen bg-[#050a12] p-3 text-white sm:p-4">
            <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1440px] gap-4 overflow-hidden rounded-3xl border border-white/5 bg-[#0b1320] p-4">
                <aside className="hidden w-56 shrink-0 flex-col rounded-2xl bg-[#17243a] p-5 lg:flex">
                    <Logo />
                    <p className="mt-3 font-ui text-[9px] uppercase tracking-widest text-slate-400">Trainer workspace</p>

                    <nav aria-label="Trainer navigation" className="mt-8 flex flex-col gap-1">
                        {TRAINER_NAV.map(renderItem)}
                        <div className="mt-6">{renderItem(SCHEDULE_NAV, TRAINER_NAV.length)}</div>
                    </nav>

                    <div className="mt-auto">
                        <p className="font-ui text-[9px] uppercase tracking-widest text-slate-500">Coach workspace</p>
                        <p className="mt-2 font-ui text-sm font-bold">{trainer?.fullName}</p>
                        <p className="font-body text-xs text-slate-400">{trainer?.title}</p>
                        <button
                            type="button"
                            onClick={onLogout}
                            className="mt-5 flex w-full items-center gap-3 border-t border-white/10 pt-5 font-ui text-xs text-slate-300 hover:text-white focus-visible:outline-2 focus-visible:outline-sky-400"
                        >
                            <LogOut size={18} aria-hidden="true" /> Log out
                        </button>
                    </div>
                </aside>

                <main className="relative min-w-0 flex-1 overflow-hidden rounded-2xl">
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-64 bg-cover bg-center opacity-40"
                        style={{ backgroundImage: `linear-gradient(to bottom, transparent, #0b1320), url(${backgroundSrc})` }}
                    />
                    <div className="relative flex flex-col gap-6 px-6 py-5">
                        <header className="flex items-start justify-between gap-4">
                            <div>
                                <p className="font-ui text-[11px] text-slate-400">
                                    Trainer workspace / <span className="text-slate-200">{pageTitle}</span>
                                </p>
                                <h1 className="mt-4 font-ui text-3xl font-bold">{pageTitle}</h1>
                                {subtitle && <p className="mt-3 font-body text-xs text-slate-400">{subtitle}</p>}
                            </div>
                            <ProfilePill name={trainer?.fullName} avatarSrc={trainer?.avatarSrc} />
                        </header>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
