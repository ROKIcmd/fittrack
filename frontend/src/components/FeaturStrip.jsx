import Panel from "./Panel";

export default function FeatureStrip({ features, className = "" }) {
  return (
    <Panel
      as="section"
      className={`relative z-10 grid grid-cols-2 gap-y-8 rounded-[2.5rem] px-6 py-8 lg:grid-cols-4 lg:gap-y-0 lg:rounded-full lg:px-10 lg:py-0 ${className}`}
    >
      {features.map(({ Icon, label }, i) => (
        <div
          key={label}
          className={`flex items-center gap-4 lg:h-[124px] lg:px-6 ${
            i > 0 ? "lg:my-auto lg:h-[83px] lg:border-l-4 lg:border-white" : ""
          }`}
        >
          <Icon className="h-10 w-10 shrink-0 md:h-12 md:w-12" strokeWidth={1.5} />
          <span className="text-xl font-bold leading-tight md:text-2xl">{label}</span>
        </div>
      ))}
    </Panel>
  );
}