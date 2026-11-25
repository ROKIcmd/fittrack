import StatusBadge from "./StatusBadge";

export default function LogListItem({ log, selected, onSelect, index = 0 }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(log.id)}
      style={{ animationDelay: `${450 + index * 80}ms` }}
      className={`animate-fade-up flex w-full items-center justify-between gap-3 rounded-[20px] border px-4 py-3 text-left transition ${
        selected
          ? "border-blue-400 bg-blue-500/25"
          : "border-white/20 bg-[#d9d9d9]/20 hover:bg-[#d9d9d9]/30"
      }`}
    >
      <div className="min-w-0">
        <p className="flex items-center gap-2 font-display text-sm text-white">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
          <span className="truncate">{log.title}</span>
        </p>
        <p className="mt-1 pl-[18px] text-xs text-white/80">
          {log.date} | {log.duration} | {log.weight}
          <br />
          {log.done}/{log.total} Exercises
        </p>
      </div>
      <StatusBadge status={log.status} />
    </button>
  );
}
