import { StatusBadge } from "../MemberDashComp";

// Single place that maps backend session statuses to a label and to a status key the shared
// member StatusBadge understands. If the shared badge doesn't style one of these keys yet,
// add it to StatusBadge in MemberDashComp.jsx; nothing here needs to change.
const STATUS_MAP = {
    COMPLETED: { label: "Completed", badge: "completed" },
    STARTED: { label: "In progress", badge: "started" },
    SCHEDULED: { label: "Scheduled", badge: "scheduled" },
    UPCOMING: { label: "Upcoming", badge: "upcoming" },
    NO_SHOW: { label: "No-show", badge: "missed" },
};

export const statusLabel = (status) => STATUS_MAP[status]?.label ?? status;

export default function SessionStatusBadge({ status, className = "" }) {
    const entry = STATUS_MAP[status] ?? { label: status, badge: "scheduled" };
    return (
        <StatusBadge status={entry.badge} className={className}>
            {entry.label}
        </StatusBadge>
    );
}