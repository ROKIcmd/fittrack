import { useEffect, useMemo, useState } from "react";
import { Dumbbell } from "lucide-react";
import MemberLayout from "../../components/MemberLayout";
import SectionCard from "../../components/SectionCard";
import PlanCalendar from "../../components/PlanCalendar";
import PlanDetails from "../../components/PlanDetails";
import DietPlan from "../../components/DietPlan";
import RescheduleForm from "../../components/RescheduleForm";
import { fetchHolidays } from "../../data/holidays";
import { getPlan, getDiet, iso } from "../../data/workoutPlans";

const TODAY = new Date();
const TODAY_ISO = iso(TODAY);

export default function WorkoutPlanPage() {
  const [view, setView] = useState({ y: TODAY.getFullYear(), m: TODAY.getMonth() });
  const [selected, setSelected] = useState(TODAY_ISO);
  const [holidays, setHolidays] = useState({});
  const [requests, setRequests] = useState({}); // { originalDateIso: { newDate, slot, reason } }

  //Public holidays for the year being viewed (free API; calendar still works if it fails)
  useEffect(() => {
    fetchHolidays(view.y).then((map) => setHolidays((h) => ({ ...h, ...map }))).catch(() => {});
  }, [view.y]);

  // Sessions in the next 3 weeks that can still be rescheduled
  const sessions = useMemo(() => {
    const list = [];
    for (let i = 0; i < 21; i++) {
      const p = getPlan(iso(new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + i)));
      if (p && !requests[p.date]) list.push(p);
    }
    return list;
  }, [requests]);

  const shift = (delta) =>
    setView(({ y, m }) => {
      const d = new Date(y, m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  const submitRequest = ({ session, ...req }) => {
    // TODO: POST to your Java backend, e.g. fetch("http://localhost:8080/api/reschedule-requests", ...)
    setRequests((r) => ({ ...r, [session]: req }));
  };

  return (
    <MemberLayout pageTitle="Workout Plan" PageIcon={Dumbbell}>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-5">
          <SectionCard title="Schedule" delay={100}>
            <PlanCalendar
              year={view.y}
              month={view.m}
              selected={selected}
              todayIso={TODAY_ISO}
              planFor={getPlan}
              holidays={holidays}
              pending={requests}
              onSelect={setSelected}
              onPrev={() => shift(-1)}
              onNext={() => shift(1)}
            />
          </SectionCard>
          <SectionCard title="Reschedule" delay={260}>
            <RescheduleForm
              sessions={sessions}
              selectedIso={selected}
              todayIso={TODAY_ISO}
              holidays={holidays}
              onSubmit={submitRequest}
            />
          </SectionCard>
        </div>

        <div className="flex flex-col gap-5">
          <SectionCard title="Details" delay={160}>
            {/* key remounts these when the date changes, replaying the animation */}
            <PlanDetails key={selected} dateIso={selected} plan={getPlan(selected)} holiday={holidays[selected]} request={requests[selected]} />
          </SectionCard>
          <SectionCard title="Diet Plan" delay={320}>
            <DietPlan key={selected} diet={getDiet(selected)} />
          </SectionCard>
        </div>
      </div>
    </MemberLayout>
  );
}
