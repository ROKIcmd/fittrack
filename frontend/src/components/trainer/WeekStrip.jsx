import { Card } from "../MemberDashComp";
import { Animate } from "../../Styles/Animations";
import { fromIso, weekdayShort } from "../../utils/scheduleDates";

/** Mon-Sun selector. Pure presentational: pass `days` (ISO strings) and per-day counts. */
export default function WeekStrip({ days, selectedIso, todayIso, countsByDay = {}, onSelect }) {
    return (
        <Animate type="up" delay={120}>
            <Card hover={false} className="!p-2">
                <div role="tablist" aria-label="Week days" className="grid grid-cols-7 gap-1">
                    {days.map((iso) => {
                        const count = countsByDay[iso] || 0;
                        const selected = iso === selectedIso;
                        return (
                            <button
                                key={iso}
                                type="button"
                                role="tab"
                                aria-selected={selected}
                                onClick={() => onSelect(iso)}
                                className={`flex flex-col items-start gap-1 rounded-xl px-4 py-3 text-left font-ui text-[11px] transition-colors focus-visible:outline-2 focus-visible:outline-sky-400 ${
                                    selected ? "bg-[#2f5fa8] text-white" : "text-slate-300 hover:bg-white/5"
                                }`}
                            >
                <span className="flex items-center gap-1.5 tracking-wide">
                  {weekdayShort(iso)} {fromIso(iso).getDate()}
                    {iso === todayIso && <span aria-label="Today" className="h-1.5 w-1.5 rounded-full bg-sky-300" />}
                </span>
                                <span className={`text-[10px] ${selected ? "text-slate-200" : "text-slate-500"}`}>
                  {count ? `${count} ${count === 1 ? "session" : "sessions"}` : "—"}
                </span>
                            </button>
                        );
                    })}
                </div>
            </Card>
        </Animate>
    );
}