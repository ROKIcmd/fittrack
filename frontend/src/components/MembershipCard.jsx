export default function MembershipCard({ name, price, period = "month", inclusions, card, pill }) {
  return (
    <article className={`flex min-h-[288px] flex-col items-center rounded-[40px] border border-white/20 px-6 py-6 ${card}`}>
      <div className={`w-full max-w-[297px] rounded-full py-3 text-center text-2xl font-bold ${pill}`}>{name}</div>
      <p className="mt-4 font-ui text-2xl font-bold">
        PHP {price}
        <span className="ml-1 text-base font-normal opacity-80">/ {period}</span>
      </p>
      <div className="mt-2 self-start pl-4 text-lg font-normal">
        <p className="font-semibold">Inclusion:</p>
        <ul className="mt-1 list-disc space-y-1 pl-6">
          {inclusions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}