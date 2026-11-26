const buyStyle = {
  Bronze: "border-[#d9a032] text-[#d9a032]",
  Silver: "border-white text-white",
  Gold: "border-yellow-300 text-yellow-300",
};

// Pass onBuy to show a "Buy" button (used on the Membership page).
export default function MembershipCard({
  name,
  price,
  period = "month",
  inclusions,
  card,
  pill,
  onBuy,
}) {
  return (
    <article
      className={`flex min-h-[288px] flex-col items-center rounded-[40px] border border-white/20 px-6 py-6 ${card}`}
    >
      <div
        className={`w-full max-w-[297px] rounded-full py-3 text-center text-2xl font-bold ${pill}`}
      >
        {name}
      </div>
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
      {onBuy && (
        <button
          type="button"
          onClick={onBuy}
          className={`mt-6 w-full max-w-[190px] rounded-full border-2 py-1.5 font-ui text-base font-bold transition hover:bg-white/10 active:scale-95 ${buyStyle[name] ?? "border-white text-white"}`}
        >
          Buy
        </button>
      )}
    </article>
  );
}