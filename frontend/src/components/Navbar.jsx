import Logo from "./Logo";

// Logo on the left; whatever you pass as children goes on the right.
export default function Navbar({ children, className = "" }) {
  return (
    <nav className={`flex items-center justify-between px-5 pt-8 md:px-20 md:pt-12 ${className}`}>
      <Logo />
      <div className="flex items-center gap-3 md:gap-6">{children}</div>
    </nav>
  );
}
