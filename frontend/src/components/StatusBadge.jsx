const styles = {
  completed: "border-[#71f360] bg-[#71f360]/20 text-[#16c000]",
  rescheduled: "border-white bg-[#d3b4aa]/50 text-white",
  "no-show": "border-red-400 bg-red-500/20 text-red-400",
};

const labels = { completed: "Completed", rescheduled: "Rescheduled", "no-show": "No show" };

export default function StatusBadge({ status }) {
  return (
    <span
      className={`animate-pop-in inline-flex h-8 w-28 shrink-0 items-center justify-center whitespace-nowrap rounded-full border font-display text-xs ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}