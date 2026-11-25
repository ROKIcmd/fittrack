import { useState } from "react";
import MemberLayout from "../../components/MemberLayout";
import LogListItem from "../../components/LogListItem";
import LogDetails from "../../components/LogDetails";
import { workoutLogs } from "../../data/workoutLogs";

export default function WorkoutLogPage() {
  const [selectedId, setSelectedId] = useState(workoutLogs[0]?.id);
  const selectedLog = workoutLogs.find((l) => l.id === selectedId);

  return (
    <MemberLayout pageTitle="Workout Log">
      <div className="grid gap-5 lg:h-[564px] lg:grid-cols-[1.25fr_1fr]">
        {/* Left: all logs */}
        <section style={{ animationDelay: "300ms" }} className="animate-fade-up flex min-h-0 flex-col rounded-[25px] bg-[#1f2937]/80 p-5 lg:p-7">
          <h2 className="font-display text-lg">Recent Workout Log</h2>
          <hr className="my-3 border-0 border-t-4 border-[#3b4a60]" />
          <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-3 [scrollbar-color:white_transparent] [scrollbar-width:thin] lg:max-h-none lg:min-h-0 lg:flex-1">
            {workoutLogs.map((log, i) => (
              <LogListItem key={log.id} index={i} log={log} selected={log.id === selectedId} onSelect={setSelectedId} />
            ))}
          </div>
        </section>

        {/* Right: details of the selected log */}
        <section style={{ animationDelay: "420ms" }} className="animate-fade-up min-h-[420px] rounded-[18px] border border-[#2b394c] bg-[#1f2937] p-5 lg:min-h-0 lg:p-6">
          {/* key makes React remount on selection, replaying the entrance animation */}
          <LogDetails key={selectedLog?.id} log={selectedLog} />
        </section>
      </div>
    </MemberLayout>
  );
}
