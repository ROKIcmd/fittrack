import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import WorkoutLogPage from "./pages/Member/WorkoutLogPage.jsx";
import WorkoutPlanPage from "./pages/Member/WorkoutPlanPage.jsx";
import MemberDashboard from "./pages/MemberDash.jsx";
import Login from "./pages/Login.jsx";
import MemberSignup from "./pages/MemberSignup/MemberSignup.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MembershipProvider } from "./context/MembershipContext.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import Registration from "./pages/Registration/Registration.jsx";
import PaymentPage from "./pages/Member/PaymentPage.jsx";
import ProfilePage from "./pages/Member/ProfilePage.jsx";
import MembershipPage from "./pages/Member/MembershipPage.jsx";
import ProgressPage from "./pages/Member/ProgressPage.jsx";
import TrainerDetails from "./pages/TrainerDetails/TrainerDetails.jsx";
import TrainerDashboard from "./pages/Trainer/TrainerDashboard.jsx";
import TrainerWorkoutPlans from "./pages/Trainer/TrainerWorkoutPlans.jsx";
import TrainerDietPlans from "./pages/Trainer/TrainerDietPlans.jsx";
import TrainerRescheduling from "./pages/Trainer/TrainerRescheduling.jsx";
import TrainerBodyMetrics from "./pages/Trainer/TrainerBodyMetrics.jsx";
import TrainerSchedulePage from "./pages/Trainer/TrainerSchedulePage.jsx";

const MEMBER_TRAINER_ROUTES = {
    dashboard: "/member/dashboard",
    membership: "/member/membership",
    trainer: "/member/trainer",
    workoutPlan: "/member/workout-plan",
    workoutLog: "/member/workout-log",
    progress: "/member/progress",
    profile: "/member/profile",
    logout: "/login",
};

function MemberTrainerRoute() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const memberName = user?.fullName || "Dela Cruz, Juan";
    const welcomeName = (user?.fullName || "Juan").split(" ")[0];

    return (
        <TrainerDetails
            memberName={memberName}
            welcomeName={welcomeName}
            routes={MEMBER_TRAINER_ROUTES}
            onNavigate={(path) => navigate(path)}
            onLogout={() => {
                logout();
                navigate("/login", { replace: true });
            }}
            onViewSchedule={() => navigate("/member/workout-plan")}
        />
    );
}

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
                            <Route path="/member" element={<Navigate to="/member/dashboard" replace />} />
                            <Route path="/member/dashboard" element={<MemberDashboard />} />
                            <Route path="/member/membership" element={<MembershipPage />} />
                            <Route path="/member/workout-plan" element={<WorkoutPlanPage />} />
                            <Route path="/member/workout-log" element={<WorkoutLogPage />} />
                            <Route path="/member/trainer" element={<MemberTrainerRoute />} />
                            <Route path="/member/progress" element={<ProgressPage />} />
                            <Route path="/member/progress/started" element={<ProgressPage status="started" />} />
                            <Route path="/member/progress/no-show" element={<ProgressPage status="no-show" />} />
                            <Route path="/member/profile" element={<ProfilePage />} />
                        </Route>

                        {/* Trainer workspace */}
                        <Route path="/trainer" element={<Navigate to="/trainer/dashboard" replace />} />
                        <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
                        <Route path="/trainer/workout-plans" element={<TrainerWorkoutPlans />} />
                        <Route path="/trainer/diet-plans" element={<TrainerDietPlans />} />
                        <Route path="/trainer/rescheduling" element={<TrainerRescheduling />} />
                        <Route path="/trainer/body-metrics" element={<TrainerBodyMetrics />} />
                        <Route path="/trainer/members/:memberId/progress" element={<TrainerBodyMetrics />} />
                        <Route path="/trainer/schedule" element={<TrainerSchedulePage />} />

                        {/* Convenience & fallback routes */}
                        <Route path="/dashboard" element={<Navigate to="/member/dashboard" replace />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </MembershipProvider>
        </AuthProvider>
    );
}
