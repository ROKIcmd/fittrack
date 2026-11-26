import { Link } from "react-router-dom";

const sizes = {
  md: { icon: "h-11 w-11", text: "text-2xl" },
  sm: { icon: "h-8 w-8", text: "text-xl" },
};

// The one FitTrack logo. size: "md" | "sm". scale: optional number (used by the sign-up page).
export default function Logo({ size = "md", scale, className = "", style }) {
  const s = sizes[size];
  const scaled = scale ? { transform: `scale(${scale})`, transformOrigin: "left center", ...style } : style;
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`} style={scaled} aria-label="FitTrack home">
      <svg viewBox="0 0 48 48" className={`${s.icon} shrink-0 text-blue-500`} aria-hidden="true">
        <path d="M6 12h17v9H15v5h10v9H15v11H6z" fill="currentColor" />
        <path d="M27 25 40 12" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        <path d="M30 8h12v12" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={`font-sans font-bold tracking-tight text-white ${s.text}`}>FitTrack</span>
    </Link>
  );
}
