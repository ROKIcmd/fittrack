import { useEffect, useRef, useState } from "react";

// Small building blocks shared by every trainer page (plans, rescheduling,
// body metrics, dashboard). Styling is Tailwind only, nothing global.
// Entrance animations use the animate-* classes from your index.css, which
// already respect prefers-reduced-motion.

export const cx = (...parts) => parts.filter(Boolean).join(" ");

const FOCUS = "outline-none transition focus-visible:ring-2 focus-visible:ring-[#3b82f6]/70";

export function Card({ as: Tag = "section", delay = 0, className = "", children, ...rest }) {
  return (
    <Tag
      className={cx("animate-fade-up overflow-hidden rounded-[18px] bg-[#1f2937]", className)}
      style={{ animationDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

const PILL_TONES = {
  success: "bg-[#183e32] text-[#8ce3b1]",
  warn: "bg-[#453923] text-[#f8cf7d]",
  info: "bg-[#284b7a] text-[#a8ceff]",
  danger: "bg-[#4a2430] text-[#f4a3b5]",
};

export function Pill({ tone = "success", className = "", children }) {
  return (
    <span
      className={cx(
        "inline-flex h-6 min-w-[69px] items-center justify-center rounded-xl px-3 text-[10px] font-medium",
        PILL_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const BUTTONS = {
  primary: "bg-[#3b82f6] text-[#f8fafc] hover:bg-[#5b9bf8] hover:shadow-[0_8px_24px_-8px_rgba(59,130,246,0.7)]",
  secondary: "bg-[#2c3a4d] text-[#f8fafc] hover:bg-[#364860]",
  danger: "bg-[#2c3a4d] text-[#f4a3b5] hover:bg-[#4a2430]",
};

export function Button({ variant = "secondary", size = "md", as: Tag = "button", className = "", children, ...rest }) {
  return (
    <Tag
      type={Tag === "button" ? "button" : undefined}
      className={cx(
        "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold",
        "transition duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
        size === "md" ? "h-[34px] px-5 text-xs" : "h-9 px-5 text-[11px]",
        FOCUS,
        BUTTONS[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// "+ Add exercise" style text button
export function TextButton({ className = "", ...rest }) {
  return (
    <button
      type="button"
      className={cx("rounded text-xs font-semibold text-[#8cbaff] transition hover:text-[#b3d1ff]", FOCUS, className)}
      {...rest}
    />
  );
}

export function Divider({ className = "" }) {
  return <hr className={cx("h-px border-0 bg-[#374658]", className)} />;
}

export function Label({ children, htmlFor, className = "" }) {
  return (
    <label htmlFor={htmlFor} className={cx("mb-[5px] block text-[10px] font-medium leading-[15px] text-[#afbdcf]", className)}>
      {children}
    </label>
  );
}

const inputBase =
  "w-full rounded-[8px] bg-[#17212f] px-3 text-xs text-[#f8fafc] placeholder:text-[#afbdcf] focus:ring-2 focus:ring-[#3b82f6]/70 hover:bg-[#1a2636]";

export function TextInput({ className = "", invalid, ...rest }) {
  return (
    <input
      className={cx(inputBase, "h-9 outline-none transition", invalid && "ring-2 ring-[#f4a3b5]/70", className)}
      {...rest}
    />
  );
}

export function TextArea({ className = "", ...rest }) {
  return <textarea className={cx(inputBase, "resize-none py-[9px] outline-none transition", className)} {...rest} />;
}

export function SearchInput({ value, onChange, placeholder, label, className = "" }) {
  return (
    <label className={cx("block", className)}>
      <span className="sr-only">{label || placeholder}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-[9px] bg-[#17212f] px-[13px] text-xs text-[#f8fafc] outline-none transition placeholder:text-[#afbdcf] hover:bg-[#1a2636] focus:ring-2 focus:ring-[#3b82f6]/70"
      />
    </label>
  );
}

// Figma shows selects as "Value  ▾". A native <select> sits invisibly on top so
// keyboard, mobile pickers and screen readers all work.
export function SelectInput({ id, label, value, onChange, options, className = "", pill = false }) {
  const items = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const current = items.find((o) => o.value === value);
  return (
    <div
      className={cx(
        "relative flex items-center whitespace-pre text-xs transition focus-within:ring-2 focus-within:ring-[#3b82f6]/70",
        pill
          ? "h-[34px] justify-center rounded-[17px] bg-[#2c3a4d] font-semibold hover:bg-[#364860]"
          : "h-9 rounded-[8px] bg-[#17212f] px-3 text-[#f8fafc] hover:bg-[#1a2636]",
        className,
      )}
    >
      <span aria-hidden="true" className={cx("truncate", !current && "text-[#afbdcf]")}>
        {(current ? current.label : "Select…") + "  ▾"}
      </span>
      <select
        id={id}
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
      >
        {!current && <option value="">Select…</option>}
        {items.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Inline status message that eases in (success / error / info)
export function Notice({ tone = "success", children, className = "" }) {
  if (!children) return null;
  const tones = {
    success: "bg-[#18352d] text-[#8ce3b1]",
    error: "bg-[#4a2430] text-[#f4a3b5]",
    info: "bg-[#20395a] text-[#a8ceff]",
  };
  return (
    <p role="status" className={cx("animate-pop-in rounded-[10px] px-3 py-2 text-[11px] leading-4", tones[tone], className)}>
      {children}
    </p>
  );
}

// Count-up number for stat cards. Skips the animation for reduced-motion users.
export function CountUp({ value, decimals = 0, duration = 900 }) {
  const [shown, setShown] = useState(value);
  const first = useRef(true);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(value);
      return undefined;
    }
    const from = first.current ? 0 : shown;
    first.current = false;
    const started = performance.now();
    let frame;
    const tick = (now) => {
      const t = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(from + (value - from) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <>{Number(shown).toFixed(decimals)}</>;
}

// Drop zone + "Choose file" for plan uploads (PDF / DOCX up to 20 MB).
// Nothing is uploaded anywhere: the file name is just attached to the draft.
const MAX_BYTES = 20 * 1024 * 1024;
const OK_EXT = /\.(pdf|docx)$/i;

export function UploadBox({ fileName, onFile }) {
  const input = useRef(null);
  const [over, setOver] = useState(false);
  const [error, setError] = useState("");

  const accept = (file) => {
    if (!file) return;
    if (!OK_EXT.test(file.name)) return setError("Only PDF or DOCX files are supported.");
    if (file.size > MAX_BYTES) return setError("That file is larger than 20 MB.");
    setError("");
    onFile(file.name);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setOver(false);
        accept(event.dataTransfer.files?.[0]);
      }}
      className={cx(
        "rounded-xl border border-dashed bg-[#17212f] px-[17px] pb-[22px] pt-[18px] transition duration-200",
        over ? "scale-[1.015] border-[#3b82f6] bg-[#1a2b42]" : "border-[#52647c]",
      )}
    >
      <p className="text-sm font-semibold leading-5">Upload an existing plan</p>
      <p className="mt-[9px] text-[11px] leading-4 text-[#afbdcf]">Drop a document here or browse</p>
      <p className="mt-1 text-[10px] leading-[15px] text-[#afbdcf]">PDF, DOCX · up to 20 MB</p>
      <input
        ref={input}
        type="file"
        accept=".pdf,.docx"
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          accept(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      <Button className="mt-[26px] w-full" onClick={() => input.current?.click()}>
        Choose file
      </Button>
      {fileName && !error && (
        <p className="animate-pop-in mt-2 truncate text-[10px] leading-[15px] text-[#8ce3b1]" title={fileName}>
          Attached: {fileName}
        </p>
      )}
      {error && <p className="animate-pop-in mt-2 text-[10px] leading-[15px] text-[#f4a3b5]">{error}</p>}
    </div>
  );
}
