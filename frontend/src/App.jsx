import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import WorkoutLogPage from "./pages/Member/WorkoutLogPage.jsx";
import WorkoutPlanPage from "./pages/Member/WorkoutPlanPage.jsx";
import MemberDashboard from "./pages/MemberDash.jsx";
import Login from "./pages/Login.jsx";
import MemberSignup from "./pages/MemberSignup/MemberSignup.jsx";
import { AuthProvider } from "./context/AuthContext";
import { MembershipProvider } from "./context/MembershipContext.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import RegistrationDetails from "./pages/RegistrationDetails/RegistrationDetails.jsx";
import Registration from "./pages/Registration/Registration.jsx";
import PaymentPage from "./pages/Member/PaymentPage.jsx";
import ProfilePage from "./pages/Member/ProfilePage.jsx";
import MembershipPage from "./pages/Member/MembershipPage.jsx";
import ProgressPage from "./pages/Member/ProgressPage.jsx";
import TrainerSchedulePage from "./pages/Trainer/TrainerSchedulePage";

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
        <AuthProvider>
            <MembershipProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<MemberSignup />} />
                        <Route path="/register/details" element={<Registration />} />

                        {/* Member pages: need a logged-in user */}
                        <Route element={<RequireAuth />}>
                            <Route path="/payment" element={<PaymentPage />} />
                            <Route path="/member/dashboard" element={<MemberDashboard />} />
                            <Route path="/member/membership" element={<MembershipPage />} />
                            <Route path="/member/workout-plan" element={<WorkoutPlanPage />} />
                            <Route path="/member/workout-log" element={<WorkoutLogPage />} />
                            <Route path="/member/trainer" element={<Placeholder title="My Trainer" />} />
                            <Route path="/member/progress" element={<ProgressPage />} />
                            <Route path="/member/progress/started" element={<ProgressPage status="started" />} />
                            <Route path="/member/progress/no-show" element={<ProgressPage status="no-show" />} />
                            <Route path="/member/profile" element={<ProfilePage />} />
                        </Route>

                        {/* Trainer workspace (placeholders for now) */}
                        <Route path="/trainer/dashboard" element={<Placeholder title="Trainer Dashboard" />} />
                        <Route path="/trainer/workout-plans" element={<Placeholder title="Trainer Workout Plans" />} />
                        <Route path="/trainer/diet-plans" element={<Placeholder title="Trainer Diet Plans" />} />
                        <Route path="/trainer/rescheduling" element={<Placeholder title="Rescheduling Requests" />} />
                        <Route path="/trainer/body-metrics" element={<Placeholder title="Body Metrics" />} />
                        <Route path="/trainer/schedule" element={<TrainerSchedulePage/>} />
                    </Routes>
                </BrowserRouter>
            </MembershipProvider>
        </AuthProvider>
    );
}
