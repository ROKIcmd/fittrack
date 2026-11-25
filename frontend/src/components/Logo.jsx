import { Link } from "react-router-dom";

<<<<<<< HEAD
export default function Logo({ className = "" }) {
  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`} aria-label="FitTrack home">
      <svg viewBox="0 0 48 48" className="h-11 w-11 text-blue-500" fill="currentColor" aria-hidden="true">
        <path d="M6 10a4 4 0 0 1 4-4h16v8H14v6h10v8H14v14H6V10z" />
        <path d="M30 24l6-6h-4v-4h14v14h-4v-4l-6 6-6-6z" transform="translate(-4 -6)" />
      </svg>
      <span className="font-ui text-2xl font-bold tracking-tight text-white">FitTrack</span>
=======
const sizes = {
  md: { icon: "h-11 w-11", text: "text-2xl" },
  sm: { icon: "h-8 w-8", text: "text-xl" },
};

export default function Logo({ size = "md", className = "" }) {
  const s = sizes[size];
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`} aria-label="FitTrack home">
      {/* shrink-0 stops the icon being squeezed away in narrow containers */}
      <svg viewBox="0 0 48 48" className={`${s.icon} shrink-0 text-blue-500`} aria-hidden="true">
        <path d="M6 12h17v9H15v5h10v9H15v11H6z" fill="currentColor" />
        <path d="M27 25 40 12" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        <path d="M30 8h12v12" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={`font-sans font-bold tracking-tight text-white ${s.text}`}>FitTrack</span>
>>>>>>> b187002708e6e78ebc6cc2b312a2356b1d666123
    </Link>
  );
}
