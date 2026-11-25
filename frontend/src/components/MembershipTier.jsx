import Panel from "./Panel";
import MembershipCard from "./MembershipCard";

export default function MembershipTiers({ tiers, title = "Membership Types:", className = "" }) {
  return (
    <section className={className}>
      <h2 className="mb-5 px-6 text-3xl font-bold md:px-20">{title}</h2>
      <Panel className="mx-3 grid gap-6 rounded-[2.5rem] p-4 md:mx-9 md:grid-cols-3 md:gap-8 md:rounded-[50px]">
        {tiers.map((tier) => (
          <MembershipCard key={tier.name} {...tier} />
        ))}
      </Panel>
    </section>
  );
}