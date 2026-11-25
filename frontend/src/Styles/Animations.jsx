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

.anim-bg        { animation: kenBurns 24s ease-in-out infinite alternate; }
.anim-left      { animation: slideInLeft 0.8s cubic-bezier(.22,1,.36,1) both; }
.anim-card      { animation: slideInRight 0.9s cubic-bezier(.22,1,.36,1) 0.15s both; }
.anim-up        { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) both; }
.anim-float     { animation: floatY 4s ease-in-out infinite; }
.anim-glow      { animation: glowPulse 2.4s ease-out infinite; }
.anim-spin      { animation: spin 0.8s linear infinite; }
.anim-shake     { animation: shake 0.4s ease; }
.anim-fade      { animation: fadeIn 0.3s ease both; }

.delay-1 { animation-delay: 0.30s; }
.delay-2 { animation-delay: 0.40s; }
.delay-3 { animation-delay: 0.50s; }
.delay-4 { animation-delay: 0.60s; }
.delay-5 { animation-delay: 0.70s; }
.delay-6 { animation-delay: 0.80s; }

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
    .anim-glow, .anim-shake, .anim-fade { animation: none !important; }
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
}

/**
 * Injects the animation CSS. Render it once near the top of your app
 * or page (e.g. in App.jsx). It is safe to render more than once.
 */
export function AnimationStyles() {
    return <style data-animations>{animationStyles}</style>
}

/**
 * Wrapper that applies an animation to its children.
 *
 * Props:
 *  - as:        element/tag to render (default "div")
 *  - type:      "up" | "left" | "card" | "fade" | "float" | "glow" |
 *               "spin" | "shake" | "bg"   (default "up")
 *  - delay:     delay in seconds, e.g. 0.3 (optional)
 *  - className: extra classes (optional)
 *
 * Example:
 *   <Animate type="up" delay={0.4} className="mt-6">...</Animate>
 *   <Animate as="h1" type="left">Title</Animate>
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

export default AnimationStyles