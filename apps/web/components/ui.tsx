import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { IconAlert } from "./icons";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "quiet" | "danger";
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const shared =
    "inline-flex items-center justify-center gap-2 h-9 px-3.5 text-sm font-medium rounded-[3px] " +
    "transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-45";

  const variants = {
    primary:
      "bg-accent text-accent-ink hover:bg-accent-hover disabled:hover:bg-accent",
    quiet:
      "text-ink-muted hover:text-ink hover:bg-sunk border border-rule disabled:hover:bg-transparent",
    // Destructive stays outline until deliberately engaged, and never sits
    // close enough to a neighbour to be hit by accident.
    danger:
      "text-remove border border-rule hover:border-remove hover:bg-remove/5",
  };

  return (
    <button className={`${shared} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export function Field({ label, hint, id, className = "", ...props }: FieldProps) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={
          "h-9 px-2.5 bg-surface text-ink text-sm rounded-[3px] border border-rule " +
          "hover:border-rule-strong " +
          "transition-colors duration-150 " +
          className
        }
        {...props}
      />
      {hint ? <p className="text-xs text-ink-faint">{hint}</p> : null}
    </div>
  );
}

export function Alert({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 px-3 py-2.5 rounded-[3px] border border-remove/35 bg-remove/6 text-sm text-remove"
    >
      <IconAlert className="w-4 h-4 mt-0.5 shrink-0" />
      <span className="text-ink">{children}</span>
    </div>
  );
}

/** The two auth surfaces share one composition so they read as one system. */
export function AuthShell({
  title,
  intro,
  children,
  footer,
}: {
  title: string;
  intro: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[24rem]">
        <div className="mb-8">
          <h1 className="text-[1.375rem] font-semibold tracking-[-0.02em] text-ink">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">{intro}</p>
        </div>
        {children}
        <div className="mt-6 pt-5 border-t border-rule text-sm text-ink-muted">
          {footer}
        </div>
      </div>
    </main>
  );
}
