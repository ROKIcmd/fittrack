import { useState } from "react"
import { AnimationStyles } from "../Styles/Animations"
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("member")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [shakeKey, setShakeKey] = useState(0)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError("Please enter a valid email address.")
            setShakeKey((k) => k + 1)
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.")
            setShakeKey((k) => k + 1)
            return
        }

        setLoading(true)

        try {
            const user = await loginUser({
                email,
                password,
                role
            })

            // Redirect based on the role returned by the backend.
            if (user.role.toLowerCase() === "member") {
                navigate("/member/dashboard")
            } else if (user.role.toLowerCase() === "trainer") {
                navigate("/trainer/dashboard")
            } else {
                setError("Unrecognized user role.")
                setShakeKey((k) => k + 1)
            }

        } catch (err) {
            setError(err.message || "Login failed. Please try again.")
            setShakeKey((k) => k + 1)
        } finally {
            setLoading(false)
        }
    }

    const inputWrapper =
        "group flex h-16 w-full items-center gap-4 rounded-[30px] border-2 border-transparent bg-[#f1f5f9] px-5 shadow-sm transition-all duration-300 focus-within:border-[#3b82f6] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.25)] hover:bg-white"

    const inputField =
        "w-full bg-transparent font-['Goudy_Old_Style','Georgia',serif] text-base text-[#0f172a] placeholder:text-black/25 focus:outline-none"

    const iconClass =
        "shrink-0 text-[#6b7280] transition-colors duration-300 group-focus-within:text-[#3b82f6]"

    const roleBtn = (active) =>
        `rounded-[25px] border-2 px-7 py-[7px] transition-all duration-300 ${
            active
                ? "border-[#3b82f6] bg-[#3b82f6] shadow-[0_6px_20px_rgba(59,130,246,0.45)]"
                : "border-white/80 bg-transparent hover:border-[#3b82f6] hover:text-[#93c5fd]"
        }`

    return (
        <>
            <AnimationStyles />

            <div className="relative min-h-screen w-full overflow-hidden bg-black">
                {/* Background photo with slow zoom */}
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRETb9eNmVn_d0m2uCvtrp1yfKuUp98a3JhrrZURbQSvQ&s=10"
                    alt=""
                    className="anim-bg pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0f172a]/30 via-[#111827]/40 to-black/60" />
                <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-[#3b82f6]/10 blur-3xl" />

                <div className="relative z-10 mx-auto flex min-h-screen max-w-[1366px] flex-col items-center justify-center gap-12 px-6 py-10 lg:flex-row lg:justify-between lg:gap-0 lg:px-16">
                    {/* Left: branding */}
                    <section className="anim-left w-full max-w-[581px] text-white">
                        <div className="mb-14 flex items-center gap-3">
                            <div className="anim-float anim-glow flex h-[58px] w-[58px] items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur">
                                <img
                                    src="/images/fittrack-emblem.svg"
                                    alt=""
                                    className="h-[42px] w-[42px] object-contain"
                                />
                            </div>
                            <span className="font-['Inter',sans-serif] text-[34px] font-bold tracking-tight text-[#f8fafc]">
                                FitTrack
                            </span>
                        </div>

                        <h1 className="anim-up delay-1 font-['Britannic_Bold','Georgia',serif] text-5xl leading-tight tracking-tight lg:text-[60px]">
                            Consistency is the{" "}
                            <span className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] bg-clip-text text-transparent">
                                Key.
                            </span>
                        </h1>

                        <div className="anim-up delay-2 mt-8 h-1 w-20 rounded-full bg-[#3b82f6]" />

                        <p className="anim-up delay-3 mt-8 max-w-[400px] font-['Goudy_Bookletter_1911','Georgia',serif] text-2xl leading-relaxed text-slate-200 lg:text-[28px]">
                            Track your workouts, manage your membership, and reach
                            your fitness goals - all in one place.
                        </p>
                    </section>

                    {/* Right: card */}
                    <section className="anim-card flex w-full max-w-[534px] flex-col items-center rounded-[40px] border border-white/10 bg-[#1f2937]/90 px-8 pb-12 pt-12 shadow-[0_30px_80px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:rounded-[50px] sm:px-14">
                        {/* Role toggle */}
                        <div
                            role="tablist"
                            className="anim-up delay-2 flex items-center gap-4 font-['Google_Sans_Code','Courier_New',monospace] text-[20px] text-white"
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={role === "member"}
                                onClick={() => setRole("member")}
                                className={roleBtn(role === "member")}
                            >
                                Member
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={role === "trainer"}
                                onClick={() => setRole("trainer")}
                                className={roleBtn(role === "trainer")}
                            >
                                Trainer
                            </button>
                        </div>

                        <h2 className="anim-up delay-3 mt-9 font-['Britannic_Bold','Georgia',serif] text-4xl tracking-wide text-white sm:text-[48px]">
                            WELCOME BACK!
                        </h2>
                        <p className="anim-up delay-3 mt-2 text-sm text-slate-400">
                            Sign in to continue as a{" "}
                            <span className="font-semibold capitalize text-[#60a5fa]">{role}</span>
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            noValidate
                            className="mt-8 w-full"
                        >
                            {/* Email */}
                            <label className={`anim-up delay-4 ${inputWrapper}`}>
                                <svg className={iconClass} width="28" height="24" viewBox="0 0 30 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                    <rect x="2" y="2" width="26" height="20" rx="3" />
                                    <path d="M4 6l11 8 11-8" />
                                </svg>
                                <span className="h-[34px] w-[2px] bg-[#9ca3af]/60" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="serato@cit.edu"
                                    autoComplete="email"
                                    aria-label="Email"
                                    className={inputField}
                                />
                            </label>

                            {/* Password */}
                            <label className={`anim-up delay-5 mt-6 ${inputWrapper}`}>
                                <svg className={iconClass} width="28" height="26" viewBox="0 0 30 26" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                    <rect x="3" y="11" width="24" height="13" rx="3" />
                                    <path d="M9 11V8a6 6 0 0112 0v3" />
                                </svg>
                                <span className="h-[34px] w-[2px] bg-[#9ca3af]/60" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter Password"
                                    autoComplete="current-password"
                                    aria-label="Password"
                                    className={inputField}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="shrink-0 rounded-full p-1 text-[#6b7280] transition hover:scale-110 hover:text-[#3b82f6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6]"
                                >
                                    <svg width="24" height="18" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                        <path d="M1 9s4-7 11-7 11 7 11 7-4 7-11 7S1 9 1 9z" />
                                        <circle cx="12" cy="9" r="3" fill="currentColor" />
                                        {showPassword && <path d="M3 16L21 2" />}
                                    </svg>
                                </button>
                            </label>

                            {/* Error message */}
                            <div className="min-h-[28px] pt-2">
                                {error && (
                                    <p
                                        key={shakeKey}
                                        role="alert"
                                        className="anim-shake anim-fade text-center text-sm text-red-400"
                                    >
                                        {error}
                                    </p>
                                )}
                            </div>

                            <div className="anim-up delay-5 text-right">
                                <a
                                    href="#"
                                    className="link-underline font-['Goudy_Old_Style','Georgia',serif] text-xl text-[#60a5fa] transition-colors hover:text-[#93c5fd]"
                                >
                                    Forgot Password?
                                </a>
                            </div>

                            <div className="anim-up delay-6 mt-6 flex justify-center">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-shine flex h-[58px] w-[203px] items-center justify-center gap-3 rounded-[25px] bg-gradient-to-b from-[#3b82f6] to-[#2563eb] font-['Google_Sans_Code','Courier_New',monospace] text-2xl font-bold text-white shadow-[0_10px_25px_rgba(59,130,246,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(59,130,246,0.6)] active:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:translate-y-0"
                                >
                                    {loading ? (
                                        <>
                                            <span className="anim-spin h-5 w-5 rounded-full border-2 border-white/40 border-t-white" />
                                            <span className="text-lg">Please wait</span>
                                        </>
                                    ) : (
                                        "Log In"
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="anim-fade mt-9 h-px w-[375px] max-w-full bg-gradient-to-r from-transparent via-white/70 to-transparent" />

                        <p className="anim-up delay-6 mt-8 font-['Goudy_Old_Style','Georgia',serif] text-2xl text-[#f1f5f9]">
                            Need an account?{" "}
                            <a
                                href="#"
                                className="link-underline text-[#60a5fa] transition-colors hover:text-[#93c5fd]"
                            >
                                Sign up
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </>
    )
}
export default Login