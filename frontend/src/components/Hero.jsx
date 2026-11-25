// Dark hero with a grayscale photo on the right fading into black on the left.
export default function Hero({ image = "/assets/hero-gym.png", className = "", children }) {
  return (
    <header className={`relative isolate overflow-hidden pb-24 md:min-h-[660px] ${className}`}>
      <div
        className="absolute inset-y-0 right-0 -z-20 w-full bg-cover bg-center grayscale md:w-[75%]"
        style={{ backgroundImage: `url('/assets/hero-image.jpg')` }}
      />
      <div className="absolute inset-0 -z-10 bg-black/60 bg-linear-to-r from-black via-black/70 to-transparent md:bg-black/0 md:via-black/50" />
      {children}
    </header>
  );
}