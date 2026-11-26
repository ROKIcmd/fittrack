import { Bell, ClipboardList } from "lucide-react";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

// Shared shell for every member page (sidebar, top bar, welcome heading, gym background).
// The name comes from the logged-in user; pass userName / firstName only to override it.
// Optional: heading / subtitle replace "Welcome, <name>!"; photo={false} gives a plain dark background.
export default function MemberLayout({
  pageTitle, PageIcon = ClipboardList, userName, firstName, heading, subtitle, photo = true, children,
}) {
  const { user } = useAuth();
  const fullName = userName ?? user?.fullName ?? "Guest";
  const first = firstName ?? fullName.split(" ")[0];

  return (
    <div className="relative min-h-screen bg-[#090e16] font-body text-white">
      {photo && (
        <>
          <div className="absolute inset-0 bg-cover bg-top animate-fade-in" style={{ backgroundImage: "url('/assets/hero-image.jpg')" }} />
          <div className="absolute inset-0 bg-black/70" />
        </>
      )}

      <div className="relative flex min-h-screen flex-col gap-4 p-4 lg:flex-row lg:gap-6 lg:p-5">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col lg:pl-2">
          <header className="animate-fade-in flex items-center justify-between gap-4" style={{ animationDelay: "150ms" }}>
            <div className="flex items-center gap-3">
              <PageIcon className="h-7 w-7" strokeWidth={1.5} />
              <span className="h-7 border-l-2 border-[#3b4a60]" />
              <span className="font-sans text-sm font-medium">{pageTitle}</span>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-[#1f2937] px-5 py-3">
              <Bell className="h-6 w-6 fill-white" />
              <span className="h-8 border-l-2 border-[#3b4a60]" />
              <span className="h-10 w-10 rounded-full bg-[#d9d9d9]" />
              <span className="hidden font-sans text-xs font-medium sm:block">{fullName}</span>
            </div>
          </header>

          <div className="animate-fade-up mt-4 lg:mt-6" style={{ animationDelay: "250ms" }}>
            {heading ? (
              <>
                <h1 className="font-sans text-3xl font-semibold lg:text-4xl">{heading}</h1>
                {subtitle && <p className="mt-1 font-sans text-sm text-white/60">{subtitle}</p>}
              </>
            ) : (
              <h1 className="font-sans text-3xl font-semibold lg:text-4xl">
                Welcome, <span className="text-[#60a5fa]">{first}!</span>
              </h1>
            )}
          </div>

          <main className="mt-5 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
