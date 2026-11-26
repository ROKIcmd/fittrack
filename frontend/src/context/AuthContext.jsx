import { createContext, useContext, useState } from "react";
import {
    login as loginRequest,
    register as registerRequest,
} from "../services/authService";

const AuthContext = createContext(null);
const KEY = "fittrack-user";

// Read the saved user (if any) so a page refresh doesn't log you out
function readSavedUser() {
    try { return JSON.parse(sessionStorage.getItem(KEY)); } catch { return null; }
}

export function AuthProvider({ children }) {
    const [user, setUserState] = useState(readSavedUser);

    function setUser(next) {
        setUserState(next);
        try {
            if (next) sessionStorage.setItem(KEY, JSON.stringify(next));
            else sessionStorage.removeItem(KEY);
        } catch { /* storage unavailable */ }
    }

    async function loginUser(credentials) {
        const loggedInUser = await loginRequest(credentials);
        setUser(loggedInUser);
        return loggedInUser;
    }

    async function registerUser(payload, { autoLogin = true } = {}) {
        const createdUser = await registerRequest(payload);
        if (autoLogin) {
            setUser(createdUser);
        }
        return createdUser;
    }

    function logoutUser() {
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login: loginUser,
                register: registerUser,
                logout: logoutUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}