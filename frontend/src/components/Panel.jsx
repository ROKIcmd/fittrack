// The dark navy rounded container used across the app.
export default function Panel({ className = "", children, as: Tag = "div" }) {
  return <Tag className={`bg-[#1E293B] ${className}`}>{children}</Tag>;
}