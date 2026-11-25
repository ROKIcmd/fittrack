
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    // Handle empty responses and non-JSON errors safely.
    const text = await response.text();
    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = { error: text };
        }
    }

    if (!response.ok) {
        throw new Error(
            data?.error || data?.message || `Request failed (${response.status})`
        );
    }

    return data;
}

// Register a new Member account.
export async function registerUser(userData) {
    return request("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
    });
}

// Log in an existing Member or Trainer.
export async function loginUser(credentials) {
    return request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
    });
}
