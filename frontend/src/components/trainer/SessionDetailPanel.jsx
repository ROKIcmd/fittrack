import { useState } from "react";
import { Card, PillButton } from "../MemberDashComp";
import { Animate } from "../../Styles/Animations";
import { formatLongDate, formatMediumDate, formatTimeRange, formatTimeSpan } from "../../utils/scheduleDates";
import SessionStatusBadge from "./SessionStatusBadge";
import ConfirmDialog from "./ConfirmDialog";

const DANGER = "!bg-[#4a2630] !text-rose-100 hover:!bg-[#5b2b38]";

/**
 * Right-hand "Selected session" panel.
 * Actions are callbacks so the page decides what they do (service calls, navigation).
 * Marking a no-show asks for confirmation first.
 */
export default function SessionDetailPanel({ session, busy = false, onStart, onComplete, onNoShow, onViewProgress }) {
    const [confirmingNoShow, setConfirmingNoShow] = useState(false);

    if (!session) {
        return (
            <Card hover={false} className="flex h-full min-h-[320px] flex-col justify-center text-center">
                <p className="font-ui text-[11px] uppercase tracking-widest text-slate-500">Selected session</p>
                <p className="mt-3 font-body text-sm text-slate-400">Select a session to see its details.</p>
            </Card>
        );
    }

    const { status } = session;
    const isDue = status === "SCHEDULED";
    const isRunning = status === "STARTED";
    const isClosed = status === "COMPLETED" || status === "NO_SHOW";
    const firstName = session.memberName.split(" ")[0];

    const confirmNoShow = async () => {
        await onNoShow(session.id); // hook resolves after the update (or error) is handled
        setConfirmingNoShow(false);
    };

    return (
        <Animate type="up" delay={200} className="h-full">
            <Card hover={false} className="flex h-full flex-col gap-5 p-5">
                <p className="font-ui text-[11px] uppercase tracking-widest text-slate-500">Selected session</p>

                <div>
                    <h2 className="font-ui text-xl font-bold text-white">{session.memberName}</h2>
                    <p className="mt-1.5 font-body text-sm text-slate-400">
                        {session.title} · {session.focus}
                    </p>
                    <SessionStatusBadge status={status} className="mt-4" />
                </div>

                <div className="rounded-xl bg-[#141f30] px-4 py-4">
                    <p className="font-ui text-sm font-bold text-white">{formatLongDate(session.date)}</p>
                    <p className="mt-2 font-body text-xs text-slate-400">{formatTimeRange(session.startTime, session.durationMinutes)}</p>
                </div>

                <hr className="border-white/10" />

                <div className="flex flex-col gap-3">
                    {isRunning ? (
                        <PillButton disabled={busy} onClick={() => onComplete(session.id)} className="w-full justify-center">
                            Complete session
                        </PillButton>
                    ) : (
                        <PillButton disabled={busy || !isDue} onClick={() => onStart(session.id)} className="w-full justify-center">
                            Start session
                        </PillButton>
                    )}
                    <PillButton
                        disabled={busy || !isDue}
                        onClick={() => setConfirmingNoShow(true)}
                        className={`w-full justify-center ${DANGER}`}
                    >
                        Mark client as no-show
                    </PillButton>
                    <p className="font-body text-[11px] text-slate-500">
                        {isClosed ? "This session is closed." : "Record only when the session is due."}
                    </p>
                </div>

                <div className="mt-auto flex flex-col gap-3">
                    <p className="font-body text-[11px] text-slate-500">The same status appears in member progress.</p>
                    <PillButton onClick={() => onViewProgress(session)} className="w-full justify-center !bg-[#22324a] !text-white">
                        View member progress →
                    </PillButton>
                </div>
            </Card>

            <ConfirmDialog
                open={confirmingNoShow}
                title={`Mark ${firstName} as a no-show?`}
                subtitle={`${formatMediumDate(session.date)} · ${formatTimeSpan(session.startTime, session.durationMinutes)}`}
                cancelLabel="Keep scheduled"
                confirmLabel="Confirm no-show"
                tone="danger"
                busy={busy}
                onConfirm={confirmNoShow}
                onCancel={() => setConfirmingNoShow(false)}
            >
                <p>
                    This will record a no-show for this session and show the same status in {firstName}'s progress tab.
                </p>
                <p className="mt-5 text-xs text-slate-400">
                    Only confirm after the client has not arrived.
                    <br />
                    You can correct attendance from the schedule.
                </p>
            </ConfirmDialog>
        </Animate>
    );
}