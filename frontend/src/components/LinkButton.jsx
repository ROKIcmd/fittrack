import { Link } from "react-router-dom";

const variants = {
  solid: "bg-blue-500 hover:bg-blue-600",
  outline: "border-2 border-white hover:bg-white/10",
};

const sizes = {
  sm: "rounded-full px-5 py-2 text-base md:px-9 md:text-xl",
  lg: "rounded-[30px] px-10 py-4 text-xl md:px-12 md:text-2xl",
};

// Pass `to` to render a router <Link>; otherwise renders a <button>.
export default function LinkButton({ to, variant = "solid", size = "sm", className = "", children, ...props }) {
  const classes = `inline-block font-ui font-bold text-white transition ${variants[variant]} ${sizes[size]} ${className}`;
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}