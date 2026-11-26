import { useState } from "react";

const W = 700, H = 300, P = { l: 54, r: 28, t: 24, b: 44 };

// Render with key={month} so the line redraws when the month changes.
export default function ProgressChart({ points, month, xTicks }) {
  const [active, setActive] = useState(points.length - 1);
  const vals = points.map((p) => p.value);
  const min = Math.floor(Math.min(...vals) / 2) * 2;
  const max = Math.ceil(Math.max(...vals) / 2) * 2;
  const yTicks = Array.from({ length: (max - min) / 2 + 1 }, (_, i) => min + i * 2);
  const d0 = points[0].day, d1 = points[points.length - 1].day;
  const x = (d) => P.l + ((d - d0) / (d1 - d0)) * (W - P.l - P.r);
  const y = (v) => H - P.b - ((v - min) / (max - min)) * (H - P.t - P.b);

  const line = points.map((p, i) => `${i ? "L" : "M"}${x(p.day)} ${y(p.value)}`).join(" ");
  const area = `${line} L${x(d1)} ${H - P.b} L${x(d0)} ${H - P.b} Z`;
  const a = points[active];
  const tipX = Math.min(Math.max(x(a.day) - 38, 4), W - 84);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Muscle mass over the month">
      <defs>
        <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b82f6" stopOpacity="0.55" />
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {yTicks.map((t) => (
        <g key={t}>
          <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke="#3b4a60" strokeOpacity="0.6" />
          <text x={P.l - 12} y={y(t) + 4} textAnchor="end" fill="#9fb4d4" fontSize="12">{t}</text>
        </g>
      ))}
      {xTicks.map((d) => (
        <g key={d}>
          <line x1={x(d)} x2={x(d)} y1={P.t} y2={H - P.b} stroke="#3b4a60" strokeOpacity="0.4" />
          <text x={x(d)} y={H - P.b + 22} textAnchor="middle" fill="#9fb4d4" fontSize="12">{month} {d}</text>
        </g>
      ))}
      <text transform={`translate(14 ${H / 2}) rotate(-90)`} textAnchor="middle" fill="#9fb4d4" fontSize="11">Muscle Mass (kg)</text>

      <path d={area} fill="url(#area)" className="animate-fade-in" style={{ animationDelay: "1.1s" }} />
      <path
        d={line} pathLength="1" fill="none" stroke="#3b82f6" strokeWidth="3"
        strokeLinejoin="round" strokeLinecap="round" className="animate-draw"
        style={{ filter: "drop-shadow(0 0 6px #3b82f6)" }}
      />

      {points.map((p, i) => (
        <g key={p.day}>
          <circle
            cx={x(p.day)} cy={y(p.value)} r={i === active ? 6 : 3.5} fill="#60a5fa"
            className="animate-pop-in transition-all"
            style={{ animationDelay: `${(i / (points.length - 1)) * 1.4}s`, transformOrigin: "center", transformBox: "fill-box", filter: "drop-shadow(0 0 5px #3b82f6)" }}
          />
          <circle cx={x(p.day)} cy={y(p.value)} r="11" fill="transparent" onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} style={{ cursor: "pointer" }} />
        </g>
      ))}

      <circle key={`ring${active}`} cx={x(a.day)} cy={y(a.value)} r="9" fill="none" stroke="#60a5fa" className="animate-ring" style={{ transformOrigin: "center", transformBox: "fill-box" }} />
      <g key={`tip${active}`} className="animate-pop-in" style={{ animationDelay: "0.2s", transformOrigin: `${tipX + 38}px ${y(a.value) - 14}px` }}>
        <rect x={tipX} y={y(a.value) - 60} width="76" height="42" rx="10" fill="#0f1b33" stroke="#3b82f6" />
        <text x={tipX + 38} y={y(a.value) - 40} textAnchor="middle" fill="#fff" fontSize="15" fontWeight="700">{a.value} kg</text>
        <text x={tipX + 38} y={y(a.value) - 25} textAnchor="middle" fill="#9fb4d4" fontSize="11">{month} {a.day}</text>
      </g>
    </svg>
  );
}
