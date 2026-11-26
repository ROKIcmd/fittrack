import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { PillButton } from "../MemberDashComp";

const TONES = {
    danger: "!bg-[#b8465a] !text-white hover:!bg-[#c9526a]",
    primary: "",
};

/**
 * Generic modal confirmation.
 * - Escape or backdrop click cancels (disabled while `busy`).
 * - Focus moves to the safe (cancel) button on open and returns to the opener on close.
 * - Tab is trapped between the two buttons.
 */
export default function ConfirmDialog({
                                          open,
                                          title,
                                          subtitle,
                                          children,
                                          confirmLabel = "Confirm",
                                          cancelLabel = "Cancel",
                                          tone = "primary",
                                          busy = false,
                                          onConfirm,
                                          onCancel,
                                      }) {
    const cancelRef = useRef(null);
    const confirmRef = useRef(null);
    const openerRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        openerRef.current = document.activeElement;
        cancelRef.current?.focus();
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKeyDown = (e) => {
            if (e.key === "Escape" && !busy) {
                e.preventDefault();
                onCancel();
            }
            if (e.key === "Tab") {
                const first = cancelRef.current;
                const last = confirmRef.current;
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last?.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first?.focus();
                }
            }
        };
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
            openerRef.current?.focus?.();
        };
    }, [open, busy, onCancel]);

    if (!open) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !busy) onCancel();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                className="w-full max-w-md rounded-2xl bg-[#17243a] p-6 shadow-2xl ring-1 ring-white/10"
            >
                <h2 id="confirm-dialog-title" className="font-ui text-xl font-bold text-white">
                    {title}
                </h2>
                {subtitle && <p className="mt-3 font-body text-xs text-slate-300">{subtitle}</p>}

                <hr className="my-4 border-white/10" />

                <div className="font-body text-sm text-slate-200">{children}</div>

                <div className="mt-7 grid grid-cols-2 gap-3">
                    <PillButton
                        ref={cancelRef}
                        disabled={busy}
                        onClick={onCancel}
                        className="w-full justify-center !bg-[#2a3a52] !text-white hover:!bg-[#33465f]"
                    >
                        {cancelLabel}
                    </PillButton>
                    <PillButton
                        ref={confirmRef}
                        disabled={busy}
                        onClick={onConfirm}
                        className={`w-full justify-center ${TONES[tone] ?? ""}`}
                    >
                        {busy ? "Saving…" : confirmLabel}
                    </PillButton>
                </div>
            </div>
        </div>,
        document.body,
    );
}