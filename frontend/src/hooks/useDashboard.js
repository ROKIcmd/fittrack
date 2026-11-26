// src/hooks/useDashboard.js
import { useEffect, useState } from "react";

export function useDashboard(fetcher, id) {
    const [state, setState] = useState({ data: null, loading: Boolean(id), error: null });

    useEffect(() => {
        if (!id) {
            setState({ data: null, loading: false, error: "No user is logged in." });
            return;
        }

        let cancelled = false;
        setState({ data: null, loading: true, error: null });

        fetcher(id)
            .then((data) => {
                if (!cancelled) setState({ data, loading: false, error: null });
            })
            .catch((err) => {
                if (!cancelled) setState({ data: null, loading: false, error: err.message });
            });

        return () => {
            cancelled = true;
        };
    }, [fetcher, id]);

    return state;
}