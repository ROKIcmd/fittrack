import { Link } from "react-router-dom";

export default function Logo({ className = "" }) {
  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`} aria-label="FitTrack home">
      <svg viewBox="0 0 48 48" className="h-11 w-11 text-blue-500" fill="currentColor" aria-hidden="true">
        <path d="M6 10a4 4 0 0 1 4-4h16v8H14v6h10v8H14v14H6V10z" />
        <path d="M30 24l6-6h-4v-4h14v14h-4v-4l-6 6-6-6z" transform="translate(-4 -6)" />
      </svg>
      <span className="font-ui text-2xl font-bold tracking-tight text-white">FitTrack</span>
    </Link>
  );
}
