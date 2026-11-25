import { useEffect, useRef, useState } from "react"

export const animationStyles = `
@keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}
@keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to   { opacity: 1; transform: translateX(0); }
}
@keyframes slideInRight {
    from { opacity: 0; transform: translateX(40px) scale(0.97); }
    to   { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes kenBurns {
    from { transform: scale(1); }
    to   { transform: scale(1.08); }
}
@keyframes floatY {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-6px); }
}
@keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.45); }
    50%      { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
}
@keyframes spin {
    to { transform: rotate(360deg); }
}
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
}

/* ---- New: dashboard animations ---- */
@keyframes scaleIn {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
}
@keyframes popIn {
    0%   { opacity: 0; transform: scale(0.6); }
    60%  { opacity: 1; transform: scale(1.08); }
    100% { opacity: 1; transform: scale(1); }
}
@keyframes growX {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
}
@keyframes drawLine {
    from { stroke-dashoffset: 1; }
    to   { stroke-dashoffset: 0; }
}
@keyframes dotPulse {
    0%   { transform: scale(1);   opacity: 0.9; }
    70%  { transform: scale(2.6); opacity: 0; }
    100% { transform: scale(2.6); opacity: 0; }
}
@keyframes shimmer {
    from { background-position: -200% 0; }
    to   { background-position: 200% 0; }
}
@keyframes bellRing {
    0%, 100% { transform: rotate(0); }
    10%, 30% { transform: rotate(14deg); }
    20%, 40% { transform: rotate(-14deg); }
    50%      { transform: rotate(0); }
}

.anim-bg        { animation: kenBurns 24s ease-in-out infinite alternate; }
.anim-left      { animation: slideInLeft 0.8s cubic-bezier(.22,1,.36,1) both; }
.anim-card      { animation: slideInRight 0.9s cubic-bezier(.22,1,.36,1) 0.15s both; }
.anim-up        { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) both; }
.anim-float     { animation: floatY 4s ease-in-out infinite; }
.anim-glow      { animation: glowPulse 2.4s ease-out infinite; }
.anim-spin      { animation: spin 0.8s linear infinite; }
.anim-shake     { animation: shake 0.4s ease; }
.anim-fade      { animation: fadeIn 0.3s ease both; }

.anim-scale     { animation: scaleIn 0.6s cubic-bezier(.22,1,.36,1) both; }
.anim-pop       { animation: popIn 0.6s cubic-bezier(.34,1.56,.64,1) both; }
.anim-grow      { transform-origin: left center; animation: growX 1.2s cubic-bezier(.22,1,.36,1) 0.5s both; }
.anim-draw      { stroke-dasharray: 1; animation: drawLine 1.8s ease-out 0.5s both; }
.anim-area      { animation: fadeIn 1s ease 1.4s both; }
.anim-dot-pulse { transform-box: fill-box; transform-origin: center; animation: dotPulse 2s ease-out infinite; }
.anim-shimmer   {
    background-image: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
    background-size: 200% 100%;
    animation: shimmer 2.4s linear infinite;
}
.anim-bell:hover { animation: bellRing 0.8s ease; transform-origin: top center; }

.delay-1 { animation-delay: 0.30s; }
.delay-2 { animation-delay: 0.40s; }
.delay-3 { animation-delay: 0.50s; }
.delay-4 { animation-delay: 0.60s; }
.delay-5 { animation-delay: 0.70s; }
.delay-6 { animation-delay: 0.80s; }

/* Hover effects */
.hover-lift {
    transition: transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s ease, border-color 0.3s ease;
}
.hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 40px rgba(0,0,0,0.45);
    border-color: rgba(59,130,246,0.55);
}
.hover-slide { transition: transform 0.25s ease, background-color 0.25s ease; }
.hover-slide:hover { transform: translateX(4px); }

.btn-shine { position: relative; overflow: hidden; }
.btn-shine::after {
    content: "";
    position: absolute;
    top: 0; left: -75%;
    width: 50%; height: 100%;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.35), transparent);
    transform: skewX(-20deg);
    transition: left 0.6s ease;
}
.btn-shine:hover::after { left: 130%; }

.link-underline {
    background: linear-gradient(currentColor, currentColor) 0 100% / 0% 1px no-repeat;
    transition: background-size 0.3s ease;
}
.link-underline:hover { background-size: 100% 1px; }

@media (prefers-reduced-motion: reduce) {
    .anim-bg, .anim-left, .anim-card, .anim-up, .anim-float,
    .anim-glow, .anim-shake, .anim-fade, .anim-scale, .anim-pop,
    .anim-grow, .anim-draw, .anim-area, .anim-dot-pulse, .anim-shimmer,
    .anim-bell:hover { animation: none !important; }
    .hover-lift:hover, .hover-slide:hover { transform: none; }
}
`

/* Map of friendly names -> CSS classes */
const ANIMATION_CLASSES = {
    bg: "anim-bg",
    left: "anim-left",
    card: "anim-card",
    up: "anim-up",
    float: "anim-float",
    glow: "anim-glow",
    spin: "anim-spin",
    shake: "anim-shake",
    fade: "anim-fade",
    scale: "anim-scale",
    pop: "anim-pop",
    grow: "anim-grow",
    draw: "anim-draw",
    area: "anim-area",
    shimmer: "anim-shimmer",
}

/**
 * Injects the animation CSS. Render once near the top of your app/page.
 * Safe to render more than once.
 */
export function AnimationStyles() {
    return <style data-animations>{animationStyles}</style>
}

/**
 * Wrapper that applies an animation to its children.
 *
 * Props:
 *  - as:        element/tag to render (default "div")
 *  - type:      "up" | "left" | "card" | "fade" | "float" | "glow" | "spin" |
 *               "shake" | "bg" | "scale" | "pop" | "grow" | "draw" | "area" |
 *               "shimmer"                                   (default "up")
 *  - delay:     delay in seconds, e.g. 0.3 (optional)
 *  - className: extra classes (optional)
 */
export function Animate({
                            as: Tag = "div",
                            type = "up",
                            delay,
                            className = "",
                            style,
                            children,
                            ...props
                        }) {
    const animClass = ANIMATION_CLASSES[type] ?? ""
    const mergedStyle =
        delay !== undefined ? { animationDelay: `${delay}s`, ...style } : style

    return (
        <Tag
            className={`${animClass} ${className}`.trim()}
            style={mergedStyle}
            {...props}
        >
            {children}
        </Tag>
    )
}

/**
 * Animates a number from 0 to `value` when it first appears.
 *
 *   <CountUp value={78.4} decimals={1} />
 */
export function CountUp({ value, decimals = 0, duration = 1200, delay = 300 }) {
    const [display, setDisplay] = useState(0)
    const frame = useRef(0)

    useEffect(() => {
        const reduce =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        if (reduce) {
            setDisplay(value)
            return
        }

        let start
        const timeout = setTimeout(() => {
            const tick = (now) => {
                if (start === undefined) start = now
                const progress = Math.min((now - start) / duration, 1)
                const eased = 1 - Math.pow(1 - progress, 3)
                setDisplay(value * eased)
                if (progress < 1) frame.current = requestAnimationFrame(tick)
            }
            frame.current = requestAnimationFrame(tick)
        }, delay)

        return () => {
            clearTimeout(timeout)
            cancelAnimationFrame(frame.current)
        }
    }, [value, duration, delay])

    return <>{display.toFixed(decimals)}</>
}

export default AnimationStyles