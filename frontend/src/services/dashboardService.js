// src/services/dashboardService.js
const API_BASE = "http://localhost:8080/api";

async function request(path) {
    let res;
    try {
        res = await fetch(`${API_BASE}${path}`);
    } catch {
        throw new Error("Can't reach the server. Is the backend running on port 8080?");
    }

    const text = await res.text();
    let data = null;
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            // Non-JSON body (e.g. an error page); fall through to the status message
        }
    }

    if (res.status === 404) {
        throw new Error("No dashboard found for this account.");
    }
    if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
    }
    return data;
}

export const dashboardService = {
    getMemberDashboard(memberId) {
        return request(`/members/${encodeURIComponent(memberId)}/dashboard`);
    },

    // [TODO] Placeholder: no trainer dashboard endpoint exists yet.
    getTrainerDashboard(trainerId) {
        return request(`/trainers/${encodeURIComponent(trainerId)}/dashboard`);
    },
};