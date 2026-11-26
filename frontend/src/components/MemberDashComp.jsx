import { useEffect, useState } from "react"
import { Animate, CountUp } from "../Styles/Animations"
import { Link } from "react-router-dom";

/* ------------------------------------------------------------------ */
/* Design tokens (taken from the Figma file)                           */
/* ------------------------------------------------------------------ */
export const fonts = {
    heading: "font-['Britannic_Bold','Georgia',serif]",
    body: "font-['Goudy_Old_Style','Georgia',serif]",
    mono: "font-['Google_Sans_Code','Courier_New',monospace]",
    ui: "font-['Inter',sans-serif]",
}

/* ------------------------------------------------------------------ */
/* Icons (inline SVG, inherit color through currentColor)              */
/* ------------------------------------------------------------------ */
const Svg = ({ size = 20, children, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
    >
        {children}
    </svg>
)

export const Icon = {
    Home: (p) => (
        <Svg {...p}>
            <path d="M3 11l9-8 9 8" />
            <path d="M5 10v10h5v-6h4v6h5V10" />
        </Svg>
    ),
    Sparkle: (p) => (
        <Svg {...p} fill="currentColor" stroke="none">
            <path d="M12 1c.6 5.4 3.6 9.4 11 11-7.4 1.6-10.4 5.6-11 11-.6-5.4-3.6-9.4-11-11 7.400-1.600 10.400-5.600 11-11z" />
        </Svg>
    ),
    UserCircle: (p) => (
        <Svg {...p}>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="10" r="3" />
            <path d="M6.5 18.500c1.300-2.200 3.100-3.200 5.500-3.200s4.200 1 5.500 3.200" />
        </Svg>
    ),
    Dumbbell: (p) => (
        <Svg {...p}>
            <path d="M6.500 6.500v11M17.500 6.500v11M3 9v6M21 9v6M6.500 12h11" />
        </Svg>
    ),
    Clipboard: (p) => (
        <Svg {...p}>
            <rect x="5" y="4" width="14" height="17" rx="2" />
            <path d="M9 4V3h6v1M9 11h6M9 15h6" />
        </Svg>
    ),
    TrendUp: (p) => (
        <Svg {...p}>
            <path d="M3 3v18h18" />
            <path d="M7 15l4-4 3 3 6-7" />
        </Svg>
    ),
    Gear: (p) => (
        <Svg {...p}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.400 15a1.700 1.700 0 00.300 1.800l.1.1a2 2 0 11-2.800 2.800l-.1-.1a1.700 1.700 0 00-1.800-.3 1.700 1.700 0 00-1 1.500V21a2 2 0 11-4 0v-.1a1.700 1.700 0 00-1.100-1.500 1.700 1.700 0 00-1.800.3l-.1.1a2 2 0 11-2.800-2.800l.1-.1a1.700 1.700 0 00.3-1.800 1.700 1.700 0 00-1.500-1H3a2 2 0 110-4h.1a1.700 1.700 0 001.500-1.100 1.700 1.700 0 00-.3-1.800l-.1-.1a2 2 0 112.800-2.800l.1.1a1.700 1.700 0 001.800.3H9a1.700 1.700 0 001-1.500V3a2 2 0 114 0v.1a1.700 1.700 0 001 1.500 1.700 1.700 0 001.800-.3l.1-.1a2 2 0 112.800 2.800l-.1.1a1.700 1.700 0 00-.3 1.800V9a1.700 1.700 0 001.500 1H21a2 2 0 110 4h-.1a1.700 1.700 0 00-1.500 1z" />
        </Svg>
    ),
    Logout: (p) => (
        <Svg {...p}>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <path d="M16 17l5-5-5-5M21 12H9" />
        </Svg>
    ),
    Bell: (p) => (
        <Svg {...p} fill="currentColor" stroke="none">
            <path d="M12 2a1.500 1.500 0 011.500 1.500v.7A7 7 0 0119 11v4.500l1.800 2.400a.8.8 0 01-.6 1.300H3.800a.8.8 0 01-.6-1.300L5 15.500V11a7 7 0 015.500-6.800v-.7A1.500 1.500 0 0112 2zM9.500 21a2.500 2.500 0 005 0z" />
        </Svg>
    ),
    ChevronDown: (p) => (
        <Svg {...p}>
            <path d="M6 9l6 6 6-6" />
        </Svg>
    ),
    GraphUp: (p) => (
        <Svg {...p}>
            <path d="M3 3v18h18" />
            <path d="M7 16v-4M12 16V9M17 16V6" />
            <path d="M15 4h4v4" />
        </Svg>
    ),
}

/* ------------------------------------------------------------------ */
/* Layout primitives                                                   */
/* ------------------------------------------------------------------ */
export function Card({ className = "", hover = true, children, ...props }) {
    return (
        <section
            className={`rounded-[18px] border border-[#2b394c] bg-[#1f2937] shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${
                hover ? "hover-lift" : ""
            } ${className}`}
            {...props}
        >
            {children}
        </section>
    )
}

export function CardTitle({ children, className = "", rule = true }) {
    return (
        <div className={className}>
            <h2 className={`${fonts.heading} text-xl text-white`}>{children}</h2>
            {rule && <div className="mt-1 h-px w-full bg-white/25" />}
        </div>
    )
}

/* ------------------------------------------------------------------ */
/* Buttons & badges                                                    */
/* ------------------------------------------------------------------ */
export function PillButton({
                               variant = "solid",
                               size = "md",
                               to,
                               href,
                               className = "",
                               children,
                               ...props
                           }) {
    const sizes = {
        sm: "px-3 py-1 text-[11px]",
        md: "px-4 py-1.5 text-xs",
        lg: "px-6 py-2 text-sm",
    }
    const variants = {
        solid: "bg-[#3b82f6] text-white shadow-[0_6px_16px_rgba(59,130,246,0.45)] hover:bg-[#2563eb]",
        outline:
            "border-2 border-[#3b82f6] bg-transparent text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white",
    }
    const cls = `btn-shine inline-flex cursor-pointer items-center justify-center gap-1 rounded-full font-bold transition-all duration-300 hover:-translate-y-0.5 active:scale-95 ${fonts.mono} ${sizes[size]} ${variants[variant]} ${className}`

    if (to) {
        return <Link to={to} className={cls} {...props}>{children}</Link>
    }
    return <a href={href} className={cls} {...props}>{children}</a>
}

const STATUS_STYLES = {
    completed: "border-[#71f360] bg-[#71f360]/20 text-[#16c000]",
    rescheduled: "border-white bg-[#d3b4aa]/50 text-white",
    no_show: "border-red-400 bg-red-500/20 text-red-300",
    expired: "border-red-400 bg-red-500/20 text-red-300",
    active: "border-2 border-[#71f360] bg-[#1f2937] text-[#71f360]",
    upcoming: "border-2 border-[#3b82f6] bg-transparent text-[#3b82f6]",
}

const STATUS_LABELS = {
    completed: "Completed",
    rescheduled: "Rescheduled",
    no_show: "No Show",
    expired: "Expired",
    active: "Active",
    upcoming: "Upcoming",
}

export function StatusBadge({ status = "completed", children, className = "" }) {
    return (
        <span
            className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
                status === "upcoming" ? fonts.mono + " font-bold" : fonts.heading
            } ${STATUS_STYLES[status]} ${className}`}
        >
            {status === "active" && (
                <span className="h-2.5 w-2.5 rounded-full bg-[#71f360] shadow-[0_0_8px_#71f360]" />
            )}
            {status === "upcoming" && (
                <span className="h-2 w-2 rounded-full bg-[#3b82f6] shadow-[0_0_8px_#3b82f6]" />
            )}
            {children}
        </span>
    )
}

/* ------------------------------------------------------------------ */
/* Progress bar                                                        */
/* ------------------------------------------------------------------ */
export function ProgressBar({ value = 0 }) {
    return (
        <div
            className="relative h-[17px] w-full overflow-hidden rounded-full bg-[#d9d9d9]"
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            <div
                className="anim-grow relative h-full rounded-full bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]"
                style={{ width: `${value}%` }}
            >
                <span className="anim-shimmer absolute inset-0 rounded-full" />
            </div>
        </div>
    )
}

/* ------------------------------------------------------------------ */
/* Stat card (Current weight, Body fat, ...)                           */
/* ------------------------------------------------------------------ */
export function StatCard({ label, value, unit, decimals = 1, delay = 0 }) {
    return (
        <Animate
            type="scale"
            delay={delay}
            className="hover-lift flex flex-1 flex-col items-center justify-center rounded-[25px] border border-white/10 bg-[#76adff]/30 px-3 py-3 text-center"
        >
            <span className={`${fonts.ui} text-sm text-white/50`}>{label}</span>
            <span className={`${fonts.ui} mt-1 text-[25px] font-bold leading-none text-white`}>
                <CountUp value={value} decimals={decimals} delay={delay * 1000 + 300} />
                {unit && <span className="ml-1 text-sm font-normal text-white/50">{unit}</span>}
            </span>
        </Animate>
    )
}

/* ------------------------------------------------------------------ */
/* List rows                                                           */
/* ------------------------------------------------------------------ */
export function WorkoutLogItem({ title, meta, status, delay = 0 }) {
    return (
        <Animate
            type="up"
            delay={delay}
            className="hover-slide flex items-center justify-between gap-3 rounded-[20px] border border-white/20 bg-[#d9d9d9]/20 px-4 py-2 hover:bg-[#d9d9d9]/30"
        >
            <div className="min-w-0">
                <p className={`${fonts.heading} flex items-center gap-1.5 text-[11px] text-white`}>
                    <span className="h-[7px] w-[7px] rounded-full bg-[#3b82f6] shadow-[0_0_6px_#3b82f6]" />
                    {title}
                </p>
                <p className={`${fonts.body} mt-0.5 pl-3 text-[9px] leading-tight text-white/80`}>
                    {meta.map((line) => (
                        <span key={line} className="block">
                            {line}
                        </span>
                    ))}
                </p>
            </div>
            <StatusBadge status={status} className="shrink-0 !px-3 !py-1 !text-[11px]">
                {STATUS_LABELS[status] ?? status}
            </StatusBadge>
        </Animate>
    )
}

export function UpdateItem({ title, date, delay = 0 }) {
    return (
        <Animate
            type="up"
            delay={delay}
            className="hover-slide cursor-pointer rounded-full border border-white/10 bg-[#76adff]/30 px-5 py-2 hover:bg-[#76adff]/40"
        >
            <p className={`${fonts.ui} text-sm text-white`}>{title}</p>
            <p className={`${fonts.ui} text-[10px] text-white/50`}>Date: {date}</p>
        </Animate>
    )
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */
export function Logo({ compact = false }) {
    return (
        <div className="flex items-center gap-2">
            <img
                src="/images/fittrack-emblem.svg"
                alt=""
                className="h-8 w-8 object-contain"
            />
            <span className={`${fonts.ui} font-bold text-[#f8fafc] ${compact ? "text-lg" : "text-[22px]"}`}>
                FitTrack
            </span>
        </div>
    )
}

export function SidebarNavItem({ icon: IconComp, label, href = "#", active = false, delay = 0 }) {
    return (
        <Animate as="li" type="left" delay={delay}>
            <Link
                to={href}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-xl px-2 py-1.5 text-xs font-medium transition-all duration-300 hover:translate-x-1 hover:bg-white/5 ${fonts.ui} ${
                    active ? "text-[#3b82f6]" : "text-white"
                }`}
            >
                <IconComp
                    size={20}
                    className="shrink-0 transition-transform duration-300 group-hover:scale-110"
                />
                {label}
            </Link>
        </Animate>
    )
}

export function Sidebar({ items, onLogout }) {
    return (
        <aside className="anim-left sticky top-6 hidden h-[calc(100vh-3rem)] max-h-[713px] w-[154px] shrink-0 flex-col rounded-[25px] bg-[#1f2937] px-3 py-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] lg:flex">
            <div className="px-1">
                <Logo compact />
                <p className={`${fonts.ui} mt-1 text-[9px] font-medium text-[#afbdcf]`}>
                    TRAIN · TRACK · PROGRESS
                </p>
            </div>

            <nav className="mt-16 flex-1">
                <ul className="space-y-2.5">
                    {items.map((item, i) => (
                        <SidebarNavItem key={item.label} delay={0.3 + i * 0.07} {...item} />
                    ))}
                </ul>
            </nav>

            <div className="border-t border-white/20 pt-4">
                <button
                    type="button"
                    onClick={onLogout}
                    className={`group flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-xs font-medium text-white transition-all duration-300 hover:translate-x-1 hover:bg-red-500/10 hover:text-red-300 ${fonts.ui}`}
                >
                    <Icon.Logout size={20} />
                    Logout
                </button>
            </div>
        </aside>
    )
}

/* ------------------------------------------------------------------ */
/* Top bar                                                             */
/* ------------------------------------------------------------------ */
export function Breadcrumb({ label }) {
    return (
        <div className="flex items-center gap-3 text-white">
            <Icon.Home size={30} />
            <span className="h-7 w-px bg-white/60" />
            <span className={`${fonts.ui} text-[13px] font-medium`}>{label}</span>
        </div>
    )
}

export function ProfilePill({ name, avatarSrc }) {
    return (
        <div className="flex items-center gap-3 rounded-full bg-[#1f2937] px-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
            <button
                type="button"
                aria-label="Notifications"
                className="anim-bell relative text-white transition-colors hover:text-[#60a5fa]"
            >
                <Icon.Bell size={28} />
                <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-white" />
            </button>
            <span className="h-[47px] w-px bg-white/30" />
            {avatarSrc ? (
                <img src={avatarSrc} alt="" className="h-[46px] w-[46px] rounded-full object-cover" />
            ) : (
                <span className="h-[46px] w-[46px] rounded-full bg-[#d9d9d9]" />
            )}
            <span className={`${fonts.ui} text-[13px] font-medium text-white`}>{name}</span>
        </div>
    )
}

/* ------------------------------------------------------------------ */
/* Line chart (pure SVG, no chart library needed)                      */
/* ------------------------------------------------------------------ */
/**
 * Returns a 0 -> 1 progress value that accelerates over time (ease-in).
 * Starts slow and speeds up, so the chart line "gathers pace" as it draws.
 * Respects prefers-reduced-motion by jumping straight to 1.
 */
function useAcceleratingProgress({ duration = 3200, delay = 700, power = 2.2 } = {}) {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const reduce =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        if (reduce) {
            setProgress(1)
            return
        }

        let raf = 0
        let start
        const timer = setTimeout(() => {
            const tick = (now) => {
                if (start === undefined) start = now
                const t = Math.min((now - start) / duration, 1)
                setProgress(Math.pow(t, power)) // ease-in: slow start, fast finish
                if (t < 1) raf = requestAnimationFrame(tick)
            }
            raf = requestAnimationFrame(tick)
        }, delay)

        return () => {
            clearTimeout(timer)
            cancelAnimationFrame(raf)
        }
    }, [duration, delay, power])

    return progress
}

export function LineChart({
                              data, // [{ x: 1, y: 69.4 }, ...]
                              xTicks, // [{ value: 1, label: "Nov 1" }, ...]
                              yTicks, // [68, 70, 72, 74, 76]
                              yLabel,
                              highlightLabel, // { title: "74.5 kg", sub: "Nov 30" }
                              duration = 3200, // ms for the left-to-right draw
                              delay = 700, // ms before it starts
                          }) {
    const progress = useAcceleratingProgress({ duration, delay })
    const done = progress >= 1

    const W = 560
    const H = 230
    const pad = { top: 28, right: 28, bottom: 34, left: 46 }

    const xs = data.map((d) => d.x)
    const xMin = Math.min(...xs)
    const xMax = Math.max(...xs)
    const yMin = Math.min(...yTicks)
    const yMax = Math.max(...yTicks)

    const sx = (x) => pad.left + ((x - xMin) / ((xMax - xMin) || 1)) * (W - pad.left - pad.right)
    const sy = (y) => H - pad.bottom - ((y - yMin) / ((yMax - yMin) || 1)) * (H - pad.top - pad.bottom)

    const line = data.map((d, i) => `${i ? "L" : "M"}${sx(d.x)},${sy(d.y)}`).join(" ")
    const area = `${line} L${sx(xMax)},${H - pad.bottom} L${sx(xMin)},${H - pad.bottom} Z`
    const last = data[data.length - 1]

    // Current x position of the drawing "pen" (left -> right)
    const x0 = sx(xMin)
    const x1 = sx(xMax)
    const tipX = x0 + progress * (x1 - x0)
    const clipWidth = done ? W : tipX // open fully at the end so the glow isn't cut off

    // y position of the pen, interpolated along the line
    let tipY = sy(data[0].y)
    for (let i = 1; i < data.length; i++) {
        const a = data[i - 1]
        const b = data[i]
        if (tipX <= sx(b.x)) {
            const f = (tipX - sx(a.x)) / (sx(b.x) - sx(a.x) || 1)
            tipY = sy(a.y) + f * (sy(b.y) - sy(a.y))
            break
        }
        tipY = sy(b.y)
    }

    return (
        <div className="relative w-full">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Chart">
                <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                    <filter id="chartGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="b" />
                        <feMerge>
                            <feMergeNode in="b" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    {/* Reveals the area + line from left to right */}
                    <clipPath id="chartReveal">
                        <rect x="0" y="0" width={clipWidth} height={H} />
                    </clipPath>
                </defs>

                {/* grid + y labels */}
                {yTicks.map((t) => (
                    <g key={t}>
                        <line
                            x1={pad.left}
                            x2={W - pad.right}
                            y1={sy(t)}
                            y2={sy(t)}
                            stroke="rgba(148,163,184,0.15)"
                        />
                        <text x={pad.left - 10} y={sy(t) + 4} textAnchor="end" fontSize="10" fill="#cbd5e1">
                            {t}
                        </text>
                    </g>
                ))}
                {xTicks.map((t) => (
                    <g key={t.label}>
                        <line
                            x1={sx(t.value)}
                            x2={sx(t.value)}
                            y1={pad.top}
                            y2={H - pad.bottom}
                            stroke="rgba(148,163,184,0.1)"
                        />
                        <text x={sx(t.value)} y={H - 12} textAnchor="middle" fontSize="10" fill="#cbd5e1">
                            {t.label}
                        </text>
                    </g>
                ))}

                {yLabel && (
                    <text
                        transform={`translate(12 ${H / 2}) rotate(-90)`}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#cbd5e1"
                    >
                        {yLabel}
                    </text>
                )}

                {/* area, line, points */}
                <g clipPath="url(#chartReveal)">
                    <path d={area} fill="url(#chartFill)" />
                    <path
                        d={line}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        filter="url(#chartGlow)"
                    />
                </g>

                {/* data points pop in as the line reaches them */}
                {data.map((d, i) =>
                    sx(d.x) <= tipX + 0.5 ? (
                        <circle
                            key={i}
                            cx={sx(d.x)}
                            cy={sy(d.y)}
                            r={i === data.length - 1 ? 5 : 3}
                            fill="#93c5fd"
                            className="anim-pop"
                            style={{ transformBox: "fill-box", transformOrigin: "center" }}
                        />
                    ) : null
                )}

                {/* glowing pen that leads the line while it draws */}
                {!done && progress > 0 && (
                    <circle cx={tipX} cy={tipY} r="4.5" fill="#bfdbfe" filter="url(#chartGlow)" />
                )}

                {/* pulsing last point, once the line has finished */}
                {done && (
                    <circle
                        cx={sx(last.x)}
                        cy={sy(last.y)}
                        r="5"
                        fill="#60a5fa"
                        className="anim-dot-pulse"
                    />
                )}

                {/* tooltip, appears when the line completes */}
                {highlightLabel && done && (
                    <g
                        className="anim-pop"
                        style={{ transformBox: "fill-box", transformOrigin: "bottom center" }}
                    >
                        <rect
                            x={sx(last.x) - 40}
                            y={sy(last.y) - 50}
                            width="64"
                            height="36"
                            rx="8"
                            fill="#0f2447"
                            stroke="#3b82f6"
                        />
                        <text x={sx(last.x) - 8} y={sy(last.y) - 33} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
                            {highlightLabel.title}
                        </text>
                        <text x={sx(last.x) - 8} y={sy(last.y) - 20} textAnchor="middle" fontSize="9" fill="#cbd5e1">
                            {highlightLabel.sub}
                        </text>
                    </g>
                )}
            </svg>
        </div>
    )
}