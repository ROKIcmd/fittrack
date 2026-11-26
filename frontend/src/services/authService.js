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

    return data; // { id, fullName, email, role }
}

export function login({ email, password, role }) {
    return requestAuth("/login", { email, password, role });
}

export function register({ firstName, lastName, email, password }) {
    return requestAuth("/register", { firstName, lastName, email, password });
}

export function createTestTrainer() {
    return requestAuth("/dev/create-trainer", {});
}