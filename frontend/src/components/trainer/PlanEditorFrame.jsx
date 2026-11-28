import { Button, Card, Divider, Notice } from "./TrainerUI";
import { formatLong } from "../../data/trainerStore";

// Right-hand editor card shared by Workout plans and Diet plans:
// heading + DRAFT tag + Save draft, then your form (children), then the
// "Starts <date>" footer with the assign button.

export default function PlanEditorFrame({
  title,
  statusLabel,
  onSaveDraft,
  startDate,
  onStartDate,
  assignLabel,
  onAssign,
  message,
  children,
}) {
  return (
    <Card className="flex flex-col px-6 pb-6 pt-[18px] lg:h-[703px]" delay={140}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-semibold leading-7">{title}</h2>
        <div className="flex items-center gap-[97px] max-sm:gap-3">
          <span
            className={`text-[10px] font-semibold leading-[15px] transition-colors ${
              statusLabel === "ASSIGNED" ? "text-[#8ce3b1]" : "text-[#f8cf7d]"
            }`}
          >
            {statusLabel}
          </span>
          <Button className="w-[125px]" onClick={onSaveDraft}>
            Save draft
          </Button>
        </div>
      </div>
      <Divider className="mt-[15px]" />

      <div className="min-h-0 flex-1 pt-4">{children}</div>

      {message && <Notice tone={message.tone} className="mb-3">{message.text}</Notice>}
      <Divider />
      <div className="flex flex-wrap items-center justify-between gap-3 pt-[19px]">
        <label className="relative text-[11px] leading-4 text-[#afbdcf]">
          Starts <span className="underline decoration-dotted underline-offset-2">{formatLong(startDate)}</span>
          <input
            type="date"
            aria-label="Start date"
            value={startDate}
            onChange={(event) => event.target.value && onStartDate(event.target.value)}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </label>
        <Button variant="primary" className="w-[191px]" onClick={onAssign}>
          {assignLabel}
        </Button>
      </div>
    </Card>
  );
}
