const API_BASE = "http://localhost:8080/api/auth";

async function requestAuth(path, payload) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.error || data.message || `Authentication failed (${res.status})`);
    }

    return data;
}

export function login({ email, password, role }) {
    return requestAuth("/login", { email, password, role });
}

export async function checkEmail(email) {
    const res = await fetch(`${API_BASE}/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || "Email is already taken");
    }
    return data;
}

export function register(payload) {
    return requestAuth("/register", payload);
}