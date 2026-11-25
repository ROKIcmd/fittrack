import { NavLink } from "react-router-dom";
import { House, Sparkles, CircleUser, Dumbbell, ClipboardList, TrendingUp, Settings, LogOut } from "lucide-react";
import Logo from "./Logo";

const links = [
  { to: "/member/dashboard", label: "Dashboard", Icon: House },
  { to: "/member/membership", label: "Membership", Icon: Sparkles },
  { to: "/member/trainer", label: "Trainer", Icon: CircleUser },
  { to: "/member/workout-plan", label: "Workout Plan", Icon: Dumbbell },
  { to: "/member/workout-log", label: "Workout Log", Icon: ClipboardList },
  { to: "/member/progress", label: "Progress", Icon: TrendingUp },
  { to: "/member/profile", label: "Profile", Icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="animate-slide-right flex flex-col rounded-[25px] bg-[#1f2937] p-4 lg:w-[154px] lg:shrink-0 lg:px-3 lg:py-5">
      <Logo size="sm" />
      <p className="mt-1 hidden text-[9px] text-[#afbdcf] lg:block">TRAIN · TRACK · PROGRESS</p>

      <nav className="mt-4 flex gap-1 overflow-x-auto lg:mt-24 lg:flex-1 lg:flex-col lg:gap-3 lg:overflow-visible">
        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-2 rounded-lg px-2 py-1 text-xs font-medium transition hover:text-blue-300 ${
                isActive ? "text-blue-500" : "text-white"
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 hidden border-t border-white/20 pt-4 lg:block">
        <NavLink to="/" className="flex items-center gap-2 px-2 text-xs font-medium text-white hover:text-blue-300">
          <LogOut className="h-5 w-5" strokeWidth={1.5} />
          Logout
        </NavLink>
      </div>
    </aside>
  );
}
