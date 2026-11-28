import { useMemo, useState } from "react";
import { Card, Divider, SearchInput, UploadBox, cx } from "./TrainerUI";

// Left-hand panel shared by Workout plans and Diet plans:
// title + counts, upload box, searchable saved plans, footer hint.
//
// plans: [{ id, name, subtitle, tone? ("warn" colours the subtitle) }]

export default function PlanLibrary({
  title,
  summary,
  plans,
  selectedId,
  onSelect,
  fileName,
  onFile,
  footer,
}) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? plans.filter((p) => `${p.name} ${p.subtitle}`.toLowerCase().includes(needle)) : plans;
  }, [plans, query]);

  return (
    <Card className="flex flex-col px-5 pb-5 pt-[19px] lg:h-[703px]" delay={80}>
      <h2 className="text-lg font-semibold leading-[26px]">{title}</h2>
      <p className="text-[11px] leading-4 text-[#afbdcf]">{summary}</p>

      <div className="mt-[18px]">
        <UploadBox fileName={fileName} onFile={onFile} />
      </div>

      <p className="mt-[23px] text-[10px] font-semibold leading-[15px] text-[#afbdcf]">SAVED PLANS</p>
      <SearchInput value={query} onChange={setQuery} placeholder="Search plans…" label="Search saved plans" className="mt-[9px]" />

      <ul className="mt-4 flex min-h-0 flex-1 flex-col gap-[11px] overflow-y-auto pr-px">
        {visible.map((plan, index) => (
          <li key={plan.id} className="animate-fade-up" style={{ animationDelay: `${index * 60}ms` }}>
            <button
              type="button"
              onClick={() => onSelect(plan.id)}
              aria-pressed={plan.id === selectedId}
              className={cx(
                "flex h-14 w-full flex-col items-start justify-center rounded-[10px] px-3 text-left transition duration-200",
                "hover:translate-x-[2px] focus-visible:ring-2 focus-visible:ring-[#3b82f6]/70 focus-visible:outline-none",
                plan.id === selectedId ? "bg-[#263d5c]" : "bg-[#17212f] hover:bg-[#1b2a3c]",
              )}
            >
              <span className="text-xs font-medium leading-[17px] text-[#f8fafc]">{plan.name}</span>
              <span className={cx("mt-[5px] text-[10px] leading-[15px]", plan.tone === "warn" ? "text-[#f8cf7d]" : "text-[#afbdcf]")}>
                {plan.subtitle}
              </span>
            </button>
          </li>
        ))}
        {visible.length === 0 && <li className="text-[11px] text-[#afbdcf]">No saved plans match “{query}”.</li>}
      </ul>

      <Divider className="mt-4" />
      <div className="pt-[18px] text-[11px] leading-4 text-[#afbdcf]">{footer}</div>
    </Card>
  );
}
