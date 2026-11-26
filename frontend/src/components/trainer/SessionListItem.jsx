import { Animate } from "../../Styles/Animations";
import { endTime, formatTime } from "../../utils/scheduleDates";
import SessionStatusBadge from "./SessionStatusBadge";

/** One row in the day's session list. Mirrors member WorkoutLogItem, but selectable. */
export default function SessionListItem({ session, selected, onSelect, delay = 0 }) {
    const { memberName, title, durationMinutes, startTime, status, note } = session;
    return (
        <Animate type="up" delay={delay}>
            <button
                type="button"
                onClick={() => onSelect(session.id)}
                aria-pressed={selected}
                className={`flex w-full items-center gap-4 rounded-xl border px-4 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-sky-400 ${
                    selected ? "border-sky-500/70 bg-[#233f6b]" : "border-transparent bg-[#141f30] hover:bg-[#182539]"
                }`}
            >
                <div className="w-20 shrink-0 border-r border-white/10 pr-4 font-ui text-xs">
                    <p className="font-bold text-white">{formatTime(startTime)}</p>
                    <p className="mt-1.5 text-slate-500">{formatTime(endTime(startTime, durationMinutes))}</p>
                </div>

                <div className="min-w-0 flex-1">
                    <p className="truncate font-ui text-sm font-bold text-white">{memberName}</p>
                    <p className="mt-1.5 truncate font-body text-xs text-slate-400">
                        {title} · {durationMinutes} min
                    </p>
                    {note && <p className="mt-1 truncate font-body text-[11px] text-amber-300/80">{note}</p>}
                </div>

                <SessionStatusBadge status={status} className="shrink-0" />
            </button>
        </Animate>
    );
}