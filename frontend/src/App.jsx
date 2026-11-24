import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const Placeholder = ({ title }) => (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold text-blue-500">{title}</h1>
        <p className="text-slate-400">Ready to build tomorrow!</p>
        <div className="flex flex-wrap gap-2 max-w-xl justify-center text-sm">
            <Link className="px-3 py-1 bg-slate-800 rounded" to="/">Landing</Link>
            <Link className="px-3 py-1 bg-slate-800 rounded" to="/login">Login</Link>
            <Link className="px-3 py-1 bg-slate-800 rounded" to="/register">Register</Link>
            <Link className="px-3 py-1 bg-slate-800 rounded" to="/member/dashboard">Member Dash</Link>
            <Link className="px-3 py-1 bg-slate-800 rounded" to="/trainer/dashboard">Trainer Dash</Link>
        </div>
    </div>
);

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* FE 1: Public & Auth */}
                <Route path="/" element={<Placeholder title="Landing Page" />} />
                <Route path="/login" element={<Placeholder title="Login (Member / Trainer)" />} />
                <Route path="/register" element={<Placeholder title="Register Step 1" />} />
                <Route path="/register/details" element={<Placeholder title="Register Step 2" />} />
                <Route path="/payment" element={<Placeholder title="Membership Payment" />} />
                <Route path="/member/profile" element={<Placeholder title="Member Profile" />} />

                {/* FE 2: Member Workspace */}
                <Route path="/member/dashboard" element={<Placeholder title="Member Dashboard" />} />
                <Route path="/member/membership" element={<Placeholder title="Member Membership" />} />
                <Route path="/member/workout-plan" element={<Placeholder title="Workout Plan" />} />
                <Route path="/member/workout-log" element={<Placeholder title="Workout Log" />} />
                <Route path="/member/trainer" element={<Placeholder title="My Trainer" />} />
                <Route path="/member/progress" element={<Placeholder title="Member Progress" />} />

                {/* FE 3: Trainer Workspace */}
                <Route path="/trainer/dashboard" element={<Placeholder title="Trainer Dashboard" />} />
                <Route path="/trainer/workout-plans" element={<Placeholder title="Trainer Workout Plans" />} />
                <Route path="/trainer/diet-plans" element={<Placeholder title="Trainer Diet Plans" />} />
                <Route path="/trainer/rescheduling" element={<Placeholder title="Rescheduling Requests" />} />
                <Route path="/trainer/body-metrics" element={<Placeholder title="Body Metrics" />} />
                <Route path="/trainer/schedule" element={<Placeholder title="My Schedule" />} />
            </Routes>
        </BrowserRouter>
    );
}