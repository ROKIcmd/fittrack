import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TrainerShell from "../../components/TrainerShell";
import { CountUp, Pill } from "../../components/trainer/TrainerUI";
import { useAuth } from "../../context/AuthContext";
import { trainerDashboardSample } from "../../data/trainerDashboard";
import { useTrainerStore } from "../../data/trainerStore";

// Trainer Dashboard  ->  route: /trainer/dashboard
// Figma frame "Trainer / Dashboard" (94:17), 1279 x 900.
//
// <TrainerDashboard />                 shows the Figma sample content
// <TrainerDashboard data={apiData} />  same shape as data/trainerDashboard.js

const FILTERS = [
  { value: "all", label: "All clients" },
  { value: "needs-diet", label: "Needs a diet plan" },
  { value: "needs-workout", label: "Needs a workout plan" },
];

const matchesFilter = {
  all: () => true,
  "needs-diet": (client) => client.diet === "not-set",
  "needs-workout": (client) => client.workout === "not-set",
};

const card = "animate-fade-up overflow-hidden rounded-[18px] bg-[#1f2937]";

function PlanPill({ status }) {
  return <Pill tone={status === "active" ? "success" : "warn"} className="w-[69px]">{status === "active" ? "Active" : "Not set"}</Pill>;
}

function StatCard({ stat, index }) {
  return (
    <div
      className={`${card} h-24 px-[18px] pt-[13px]`}
      style={{ animationDelay: `${200 + index * 70}ms` }}
    >
      <p className="text-xs font-medium leading-[17px] text-[#afbdcf]">{stat.label}</p>
      <div className="mt-1 grid grid-cols-[minmax(45px,auto)_1fr] items-end">
        <span className="text-[28px] font-semibold leading-[41px] tabular-nums text-[#f8fafc]"><CountUp key={stat.value} value={stat.value} /></span>
        <span
          className={`whitespace-nowrap pb-1 text-[10px] leading-[15px] ${
            stat.tone === "warn" ? "text-[#f8cf7d]" : "text-[#afbdcf]"
          }`}
        >
          {stat.note}
        </span>
      </div>
    </div>
  );
}

export default function TrainerDashboard({ data: baseData = trainerDashboardSample }) {
  const { user } = useAuth();
  const store = useTrainerStore();

  // Live numbers come from the shared trainer store, so assigning a plan or
  // approving a request on another page updates this dashboard too.
  const data = useMemo(() => {
    const clients = store.clients.map((c) => ({ ...c, id: c.id }));
    const pending = store.requests.filter((r) => r.status === "pending").length;
    const workouts = clients.filter((c) => c.workout === "active").length;
    const diets = clients.filter((c) => c.diet === "active").length;
    const needsDiet = clients.find((c) => c.diet === "not-set");
    const needsWorkout = clients.find((c) => c.workout === "not-set");
    const todo = needsDiet
      ? { title: `Complete ${needsDiet.name.split(" ")[0]}’s nutrition plan`, text: "Add a diet plan before the next session.", cta: "Create diet plan", to: "/trainer/diet-plans", checkIn: `Next check-in: ${needsDiet.nextSession}` }
      : needsWorkout
        ? { title: `Complete ${needsWorkout.name.split(" ")[0]}’s workout plan`, text: "Add a workout plan before the next session.", cta: "Create workout plan", to: "/trainer/workout-plans", checkIn: `Next check-in: ${needsWorkout.nextSession}` }
        : null;
    return {
      ...baseData,
      clients,
      stats: [
        { ...baseData.stats[0], value: clients.length },
        baseData.stats[1],
        { ...baseData.stats[2], value: pending },
        { ...baseData.stats[3], value: workouts + diets, note: `${workouts} workout · ${diets} diet` },
      ],
      attention: todo ? { ...baseData.attention, ...todo, count: 1 } : { count: 0, title: "You’re all caught up", text: "Every client has a workout and a diet plan.", cta: "View plans", to: "/trainer/workout-plans", checkIn: "" },
      requests: { ...baseData.requests, count: pending, text: pending ? baseData.requests.text : "No requests waiting for you." },
    };
  }, [baseData, store]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // Signed-in trainer's name if there is one, otherwise the sample/data name.
  const trainerName = user?.fullName || data.trainer.name;
  const firstName = trainerName.split(" ")[0];

  const visibleClients = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return data.clients.filter(
      (client) =>
        matchesFilter[filter](client) &&
        (!needle || client.name.toLowerCase().includes(needle) || client.goal.toLowerCase().includes(needle)),
    );
  }, [data.clients, query, filter]);

  const total = data.clients.length;
  const filterLabel = FILTERS.find((item) => item.value === filter).label;

  return (
    <TrainerShell
      breadcrumb="Dashboard"
      title={`Welcome, ${firstName}!`}
      subtitle="Your clients, sessions, and coaching priorities in one place."
      trainerName={trainerName}
      trainerRole={data.trainer.role}
    >
      {/* ---- Stat cards ---- */}
      <div className="grid grid-cols-1 gap-[18px] min-[520px]:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </div>

      <div className="mt-[18px] grid gap-[18px] lg:grid-cols-[minmax(0,1fr)_350px]">
        <div className="flex min-w-0 flex-col gap-[18px]">
          {/* ---- My clients ---- */}
          <section className={`${card} px-5 pb-[17px] pt-[18px]`} style={{ animationDelay: "480ms" }}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[19px] font-semibold leading-7">My clients</h2>
              <span className="text-[11px] leading-4 text-[#afbdcf] sm:mr-[39px]">
                {total} {total === 1 ? "client" : "clients"}
              </span>
            </div>

            <div className="mt-3 flex flex-col gap-[15px] text-xs sm:flex-row sm:items-center">
              <label className="relative block flex-1">
                <span className="sr-only">Search clients by name</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search clients by name…"
                  className="h-9 w-full rounded-[9px] bg-[#17212f] px-[13px] text-xs text-[#f8fafc] outline-none transition-shadow placeholder:text-[#afbdcf] focus:ring-2 focus:ring-[#3b82f6]/70"
                />
              </label>

              <div className="relative h-[34px] shrink-0 rounded-[17px] bg-[#2c3a4d] text-xs font-semibold transition-colors focus-within:ring-2 focus-within:ring-[#3b82f6]/70 hover:bg-[#33445a] sm:w-[209px]">
                <span className="flex h-full items-center justify-center whitespace-pre" aria-hidden="true">
                  {filterLabel}
                  {"  ▾"}
                </span>
                <select
                  aria-label="Filter clients"
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  className="absolute inset-0 size-full cursor-pointer rounded-[17px] opacity-0"
                >
                  {FILTERS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-[19px] overflow-x-auto">
              <table className="w-full min-w-[580px] table-fixed border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#374658] text-[10px] font-semibold leading-[15px] text-[#afbdcf]">
                    <th scope="col" className="w-[41.8%] pb-[10px] font-semibold">CLIENT / GOAL</th>
                    <th scope="col" className="w-[20.1%] pb-[10px] font-semibold">WORKOUT</th>
                    <th scope="col" className="w-[17.7%] pb-[10px] font-semibold">DIET</th>
                    <th scope="col" className="pb-[10px] font-semibold">NEXT SESSION</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleClients.map((client) => (
                    <tr
                      key={client.id}
                      className="h-12 border-b border-[#374658] align-middle transition-colors first:h-[54px] last:border-b-0 hover:bg-white/[0.03] [&:first-child>td]:pt-[6px]"
                    >
                      <td>
                        <p className="text-[13px] font-medium leading-[19px] text-[#f8fafc]">{client.name}</p>
                        <p className="text-[10px] leading-[15px] text-[#afbdcf]">{client.goal}</p>
                      </td>
                      <td><PlanPill status={client.workout} /></td>
                      <td><PlanPill status={client.diet} /></td>
                      <td className="text-[10px] leading-[15px] text-[#afbdcf]">{client.nextSession}</td>
                    </tr>
                  ))}
                  {visibleClients.length === 0 && (
                    <tr className="h-12">
                      <td colSpan={4} className="pt-3 text-xs text-[#afbdcf]">
                        No clients match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 text-[11px] leading-4">
              <p className="text-[#afbdcf]">
                {visibleClients.length === total
                  ? `Showing all ${total} assigned clients`
                  : `Showing ${visibleClients.length} of ${total} assigned clients`}
              </p>
              <Link
                to="/trainer/workout-plans"
                className="mr-[37px] font-semibold text-[#8cbaff] transition-colors hover:text-[#b3d1ff] max-sm:mr-0"
              >
                Manage plans →
              </Link>
            </div>
          </section>

          {/* ---- Needs your attention ---- */}
          <section className={`${card} px-5 pb-[25px] pt-[18px]`} style={{ animationDelay: "560ms" }}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold leading-[26px]">Needs your attention</h2>
              <span className="inline-flex h-6 w-[87px] items-center justify-center rounded-xl bg-[#453923] text-[10px] font-medium text-[#f8cf7d]">
                {data.attention.count} {data.attention.count === 1 ? "action" : "actions"}
              </span>
            </div>
            <p className="mt-4 text-sm font-medium leading-5">{data.attention.title}</p>
            <p className="mt-[6px] text-xs leading-[17px] text-[#afbdcf]">{data.attention.text}</p>
            <div className="mt-[19px] flex flex-wrap items-center justify-between gap-3">
              <Link
                to={data.attention.to}
                className="inline-flex h-[34px] w-[153px] items-center justify-center rounded-[17px] bg-[#3b82f6] text-xs font-semibold text-[#f8fafc] transition hover:bg-[#5b9bf8] active:scale-[0.98]"
              >
                {data.attention.cta}
              </Link>
              <span className="text-[11px] leading-4 text-[#afbdcf] sm:mr-[82px]">{data.attention.checkIn}</span>
            </div>
          </section>
        </div>

        {/* ---- Today's sessions ---- */}
        <section className={`${card} flex flex-col px-5 pb-[26px] pt-[18px]`} style={{ animationDelay: "520ms" }}>
          <h2 className="text-lg font-semibold leading-[26px]">Today’s sessions</h2>
          <p className="mt-[5px] text-[11px] leading-4 text-[#afbdcf]">{data.sessionsDate}</p>
          <hr className="mt-[14px] border-0 border-t border-[#374658]" />

          <ul className="mt-[20px] flex flex-col gap-4">
            {data.sessions.map((session) => (
              <li key={session.id}>
                <Link
                  to="/trainer/schedule"
                  className="relative block h-24 rounded-xl bg-[#17212f] px-[15px] pt-3 transition-colors hover:bg-[#1b2a3c]"
                >
                  <span className="absolute left-0 top-[15px] h-[66px] w-[3px] rounded-[2px] bg-[#3b82f6]" aria-hidden="true" />
                  <span className="block text-[11px] font-semibold leading-4 text-[#8cbaff]">{session.time}</span>
                  <span className="mt-[6px] block text-sm font-semibold leading-5 text-[#f8fafc]">{session.client}</span>
                  <span className="mt-[6px] block text-[11px] leading-4 text-[#afbdcf]">{session.detail}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-7">
            <hr className="border-0 border-t border-[#374658]" />
            <p className="mt-[18px] text-sm font-semibold leading-5">
              {data.requests.count} rescheduling {data.requests.count === 1 ? "request" : "requests"}
            </p>
            <p className="mt-1 text-[11px] leading-4 text-[#afbdcf]">{data.requests.text}</p>
            <Link
              to={data.requests.to}
              className="mt-5 flex h-[34px] w-full items-center justify-center rounded-[17px] bg-[#3b82f6] text-xs font-semibold text-[#f8fafc] transition hover:bg-[#5b9bf8] active:scale-[0.98]"
            >
              Review requests
            </Link>
          </div>
        </section>
      </div>
    </TrainerShell>
  );
}
