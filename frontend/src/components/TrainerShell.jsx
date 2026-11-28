import { Link, NavLink } from "react-router-dom";
import { Calendar, CalendarDays, ClipboardList, Dumbbell, House, LogOut, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTrainerStore } from "../data/trainerStore";

// Shared shell for trainer pages: gym header, sidebar, top bar, welcome text.
// Figma frame "Trainer / Dashboard" (94:17). Reuse it for the other trainer
// pages (workout plans, diet plans, rescheduling...) by passing different
// `breadcrumb` / `title` / children.

// `gap` reproduces the (uneven) spacing between the rows in the Figma sidebar.
const NAV = [
  { to: "/trainer/dashboard", label: "Dashboard", Icon: House, gap: "" },
  { to: "/trainer/workout-plans", label: "Workout plans", Icon: Dumbbell, gap: "lg:mt-[14px]" },
  { to: "/trainer/diet-plans", label: "Diet plans", Icon: ClipboardList, gap: "lg:mt-[14px]" },
  { to: "/trainer/rescheduling", label: "Rescheduling", Icon: CalendarDays, gap: "lg:mt-[14px]" },
  { to: "/trainer/body-metrics", label: "Body Metrics", Icon: TrendingUp, gap: "lg:mt-[5px]" },
  { to: "/trainer/schedule", label: "My schedule", Icon: Calendar, gap: "lg:mt-[31px]" },
];

const INTER_FONTS = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";

function hideBrokenImage(event) {
  event.currentTarget.style.display = "none";
}

export default function TrainerShell({
  breadcrumb = "Dashboard",
  title,
  subtitle,
  trainerName = "John Smith",
  trainerRole = "Personal trainer",
  avatarSrc = "/assets/trainer-avatar.png",
  headerImageSrc = "/assets/trainer-gym-header.png",
  children,
}) {
  const { logout } = useAuth();
  const { requests } = useTrainerStore();
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080d14] text-[#f8fafc] [font-family:Inter,ui-sans-serif,system-ui,sans-serif]">
      {/* Loads Inter without touching index.html */}
      <link rel="stylesheet" href={INTER_FONTS} />

      {/* Gym header photo (Figma: 1279 x 165, 76% black veil) */}
      <div className="animate-fade-in pointer-events-none absolute inset-x-0 top-0 h-[165px] overflow-hidden">
        <img src={headerImageSrc} alt="" onError={hideBrokenImage} className="size-full object-cover" />
        <div className="absolute inset-0 bg-black/[0.76]" />
      </div>

      <div className="relative flex min-h-screen flex-col gap-4 p-4 lg:flex-row lg:gap-6 lg:pr-[25px]">
        {/* ---- Sidebar (Figma: 184 x 868, radius 25) ---- */}
        <aside className="animate-slide-right flex flex-col rounded-[25px] bg-[#1f2937] lg:min-h-[868px] lg:w-[184px] lg:shrink-0">
          <div className="relative h-16 shrink-0 lg:h-[138px]">
            <img
              src="/assets/fittrack-emblem.svg"
              alt=""
              onError={hideBrokenImage}
              className="absolute left-6 top-[16px] w-[21px] lg:top-[30px]"
            />
            <span className="absolute left-[59px] top-[16px] text-[22px] font-bold leading-[31px] lg:top-[28px]">FitTrack</span>
            <span className="absolute left-[23px] top-[76px] hidden whitespace-nowrap text-[9px] font-semibold leading-[13px] text-[#afbdcf] lg:block">
              TRAINER WORKSPACE
            </span>
          </div>

          <nav
            aria-label="Trainer"
            className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0"
          >
            {NAV.map(({ to, label, Icon, gap }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex h-[43px] shrink-0 items-center gap-[9px] whitespace-nowrap rounded-[10px] pl-3 pr-4 text-xs transition-all duration-200 lg:w-[160px] lg:pr-0 ${gap} ${
                    isActive
                      ? "bg-[#243e63] font-semibold text-[#76adff]"
                      : "font-medium text-[#f8fafc] hover:bg-white/[0.06] hover:pl-[15px]"
                  }`
                }
              >
                <Icon className="size-[18px] shrink-0" strokeWidth={1.6} aria-hidden="true" />
                {label}
                {to === "/trainer/rescheduling" && pendingCount > 0 && (
                  <span
                    key={pendingCount}
                    aria-label={`${pendingCount} pending requests`}
                    className="animate-pop-in ml-auto grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#453923] px-1 text-[10px] font-semibold text-[#f8cf7d] lg:mr-3"
                  >
                    {pendingCount}
                  </span>
                )}
              </NavLink>
            ))}

            {/* Phones: logout lives in the nav strip */}
            <Link
              to="/login"
              onClick={logout}
              className="flex h-[43px] shrink-0 items-center gap-[9px] whitespace-nowrap rounded-[10px] pl-3 pr-4 text-xs font-medium text-[#f8fafc] hover:bg-white/[0.06] lg:hidden"
            >
              <LogOut className="size-[18px] shrink-0" strokeWidth={1.6} aria-hidden="true" />
              Log out
            </Link>
          </nav>

          {/* Coach block + logout (desktop) */}
          <div className="mt-auto hidden px-[23px] pb-[42px] lg:block">
            <p className="text-[9px] font-semibold leading-[13px] text-[#afbdcf]">COACH WORKSPACE</p>
            <p className="mt-[11px] text-sm font-semibold leading-5 text-[#f8fafc]">{trainerName}</p>
            <p className="mt-[3px] text-xs leading-[17px] text-[#afbdcf]">{trainerRole}</p>
            <hr className="mb-0 mt-7 h-px w-[138px] border-0 bg-[#374658]" />
            <Link
              to="/login"
              onClick={logout}
              className="mt-[23px] flex items-center gap-[10px] pl-px text-xs font-medium leading-[17px] text-[#f8fafc] transition-colors hover:text-[#76adff]"
            >
              <LogOut className="size-[18px] shrink-0" strokeWidth={1.6} aria-hidden="true" />
              Log out
            </Link>
          </div>
        </aside>

        {/* ---- Main column ---- */}
        <div className="flex min-w-0 flex-1 flex-col lg:mb-[9px]">
          <header
            className="animate-fade-in flex items-start justify-between gap-4"
            style={{ animationDelay: "120ms" }}
          >
            <div className="min-w-0 pt-[10px]">
              <p className="text-xs font-medium leading-[17px] text-[#afbdcf]">
                Trainer workspace <span className="mx-1">/</span> {breadcrumb}
              </p>
              <h1 className="mt-[17px] text-[26px] font-semibold leading-[38px] sm:text-[32px] sm:leading-[46px]">
                {title}
              </h1>
              {subtitle && <p className="mt-[5px] text-[13px] leading-[19px] text-[#afbdcf]">{subtitle}</p>}
            </div>

            {/* Account pill (Figma: 204 x 51, radius 26) */}
            <div className="mt-[7px] flex h-[51px] shrink-0 items-center gap-[11px] rounded-[26px] bg-[#1f2937] pl-2 pr-5 lg:min-w-[204px]">
              <span className="relative size-[37px] shrink-0 overflow-hidden rounded-[20px] bg-[#2c3a4d]">
                <img src={avatarSrc} alt="" onError={hideBrokenImage} className="size-full object-cover object-top" />
              </span>
              <span className="hidden flex-col gap-[2px] sm:flex">
                <span className="whitespace-nowrap text-xs font-semibold leading-[17px]">{trainerName}</span>
                <span className="whitespace-nowrap text-[10px] leading-[15px] text-[#afbdcf]">{trainerRole}</span>
              </span>
            </div>
          </header>

          <main className="mt-[30px]">{children}</main>
        </div>
      </div>
    </div>
  );
}
