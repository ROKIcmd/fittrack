import { Bell, ClipboardList } from "lucide-react";
import Sidebar from "./Sidebar";

// Shared shell for member pages: sidebar, top bar, welcome heading, gym background.
export default function MemberLayout({ pageTitle, PageIcon = ClipboardList, userName = "Dela Cruz, Juan", firstName = "Juan", children }) {
  return (
    <div className="relative min-h-screen bg-[#090e16] font-body text-white">
      <div
        className="absolute inset-0 bg-cover bg-top animate-fade-in"
        style={{ backgroundImage: "url('/assets/hero-image.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/70" />

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
              <span className="hidden font-sans text-xs font-medium sm:block">{userName}</span>
            </div>
          </header>

          <h1 className="animate-fade-up mt-4 font-sans text-3xl font-semibold lg:mt-6 lg:text-4xl" style={{ animationDelay: "250ms" }}>
            Welcome, <span className="text-[#60a5fa]">{firstName}!</span>
          </h1>

          <main className="mt-5 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
