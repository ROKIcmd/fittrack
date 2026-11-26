// Dark rounded card with a title and an animated divider. Reusable on any member page.
export default function SectionCard({ title, delay = 0, right, className = "", children }) {
  return (
    <section
      style={{ animationDelay: `${delay}ms` }}
      className={`animate-fade-up rounded-[25px] border border-[#2b394c] bg-[#1f2937] p-5 lg:p-6 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-white">{title}</h2>
        {right}
      </div>
      <hr
        style={{ animationDelay: `${delay + 150}ms` }}
        className="animate-grow-x my-3 origin-left border-0 border-t-4 border-[#3b4a60]"
      />
      {children}
    </section>
  );
}
