import { useEffect, useId, useMemo, useRef, useState } from "react";

// Reusable animated line + area chart (hand-built SVG, no chart library).
//
// points: [{ x: number, y: number, label?: string }]   (sorted by x)
// xTicks: [{ x, label }]    yLabel: axis title    unit: tooltip unit
//
// Animation (all CSS, only when the user has NOT asked for reduced motion):
//   gridlines fade in, the line draws left to right, the area fades up, dots pop
//   in one after another, the last-point pulse loops softly. Hovering or
//   focusing moves the tooltip with a short transition.

const PAD = { top: 22, right: 22, bottom: 26, left: 38 };
const HEIGHT = 168;

const smooth = (pts) =>
  pts.reduce((d, p, i) => {
    if (i === 0) return `M${p.px},${p.py}`;
    const prev = pts[i - 1];
    const cx = (prev.px + p.px) / 2;
    return `${d} C${cx},${prev.py} ${cx},${p.py} ${p.px},${p.py}`;
  }, "");

export default function AnimatedLineChart({ points, xTicks, yLabel, unit = "", ariaLabel, replayKey }) {
  const uid = useId().replace(/:/g, "");
  const box = useRef(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!box.current) return undefined;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  const geo = useMemo(() => {
    if (!points.length || width < 80) return null;
    const ys = points.map((p) => p.y);
    const lo = Math.floor(Math.min(...ys) - 0.5);
    const hi = Math.ceil(Math.max(...ys) + 0.5);
    const yMin = lo % 2 ? lo - 1 : lo;
    const yMax = hi % 2 ? hi + 1 : hi;
    const xMin = Math.min(...points.map((p) => p.x), ...(xTicks || []).map((t) => t.x));
    const xMax = Math.max(...points.map((p) => p.x), ...(xTicks || []).map((t) => t.x));
    const sx = (x) => PAD.left + ((x - xMin) / (xMax - xMin || 1)) * (width - PAD.left - PAD.right);
    const sy = (y) => PAD.top + (1 - (y - yMin) / (yMax - yMin || 1)) * (HEIGHT - PAD.top - PAD.bottom);
    const pts = points.map((p) => ({ ...p, px: sx(p.x), py: sy(p.y) }));
    const ticks = [];
    for (let v = yMin; v <= yMax; v += 2) ticks.push({ v, py: sy(v) });
    const line = smooth(pts);
    const base = HEIGHT - PAD.bottom;
    const area = `${line} L${pts[pts.length - 1].px},${base} L${pts[0].px},${base} Z`;
    return { pts, ticks, line, area, base, sx };
  }, [points, width, xTicks]);

  const shown = geo && geo.pts[active ?? geo.pts.length - 1];
  const tipLeft = shown ? Math.min(Math.max(shown.px - 28, 4), width - 60) : 0;

  return (
    <div ref={box} className="relative w-full select-none" style={{ height: HEIGHT }}>
      {/* Keyframes live here so the component is copy-paste friendly. */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .ftc-${uid} .ftc-grid { animation: ftc-fade .6s ease-out both; }
          .ftc-${uid} .ftc-line { stroke-dasharray: 1; stroke-dashoffset: 1; animation: ftc-draw 1.4s cubic-bezier(.4,0,.2,1) .15s forwards; }
          .ftc-${uid} .ftc-area { animation: ftc-fade 1s ease-out .9s both; }
          .ftc-${uid} .ftc-dot { transform-box: fill-box; transform-origin: center; animation: ftc-pop .35s cubic-bezier(.34,1.56,.64,1) both; }
          .ftc-${uid} .ftc-pulse { transform-box: fill-box; transform-origin: center; animation: ftc-pulse 2.2s ease-out 1.9s infinite; }
          .ftc-${uid} .ftc-tip { animation: ftc-fade .5s ease-out 1.5s both; }
        }
        @media (prefers-reduced-motion: reduce) { .ftc-${uid} .ftc-line { stroke-dasharray: none; } }
        .ftc-${uid} .ftc-tip { transition: left .25s ease, top .25s ease; }
        @keyframes ftc-draw { to { stroke-dashoffset: 0; } }
        @keyframes ftc-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ftc-pop { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
        @keyframes ftc-pulse { 0% { opacity: .55; transform: scale(1); } 100% { opacity: 0; transform: scale(3.2); } }
      `}</style>

      {geo && (
        <div className={`ftc-${uid} absolute inset-0`} key={replayKey}>
          <svg width={width} height={HEIGHT} role="img" aria-label={ariaLabel} className="block overflow-visible">
            <defs>
              <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#3b82f6" stopOpacity="0.55" />
                <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {geo.ticks.map((t) => (
              <g key={t.v} className="ftc-grid">
                <line x1={PAD.left} x2={width - PAD.right} y1={t.py} y2={t.py} stroke="#ffffff" strokeOpacity="0.07" />
                <text x={PAD.left - 8} y={t.py + 3} textAnchor="end" fontSize="8" fill="#afbdcf">{t.v}</text>
              </g>
            ))}
            {(xTicks || []).map((t) => (
              <text key={t.label} x={geo.sx(t.x)} y={HEIGHT - 6} textAnchor="middle" fontSize="7" fill="#afbdcf">{t.label}</text>
            ))}
            {yLabel && (
              <text transform={`translate(10 ${(PAD.top + geo.base) / 2}) rotate(-90)`} textAnchor="middle" fontSize="7" fill="#afbdcf">{yLabel}</text>
            )}

            <path className="ftc-area" d={geo.area} fill={`url(#${uid}-fill)`} />
            <path
              className="ftc-line"
              d={geo.line}
              pathLength="1"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 5px rgba(59,130,246,.8))" }}
            />

            {active !== null && (
              <line x1={shown.px} x2={shown.px} y1={PAD.top} y2={geo.base} stroke="#3b82f6" strokeOpacity="0.4" strokeDasharray="3 3" />
            )}

            {geo.pts.map((p, i) => {
              const last = i === geo.pts.length - 1;
              return (
                <g key={`${p.x}-${i}`}>
                  {last && <circle className="ftc-pulse" cx={p.px} cy={p.py} r="4" fill="#3b82f6" />}
                  <circle
                    className="ftc-dot"
                    cx={p.px}
                    cy={p.py}
                    r={last || i === active ? 4 : 2.2}
                    fill={last || i === active ? "#ffffff" : "#8cbaff"}
                    stroke={last || i === active ? "#3b82f6" : "none"}
                    strokeWidth="2"
                    style={{ animationDelay: `${1 + i * 0.07}s` }}
                  />
                  {/* big invisible target so hover and keyboard focus are easy */}
                  <circle
                    cx={p.px}
                    cy={p.py}
                    r="11"
                    fill="transparent"
                    tabIndex={0}
                    role="img"
                    aria-label={`${p.label || p.x}: ${p.y}${unit}`}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    style={{ outline: "none" }}
                  />
                </g>
              );
            })}
          </svg>

          <div
            className="ftc-tip pointer-events-none absolute rounded-lg border border-[#3b82f6]/60 bg-[#0b1626] px-2 py-1 text-center shadow-[0_0_14px_rgba(59,130,246,0.35)]"
            style={{ left: tipLeft, top: Math.max(shown.py - 44, 0), width: 56 }}
          >
            <p className="text-[10px] font-semibold leading-[13px] text-[#f8fafc]">{shown.y} {unit}</p>
            <p className="text-[8px] leading-[11px] text-[#afbdcf]">{shown.label}</p>
          </div>
        </div>
      )}
    </div>
  );
}
