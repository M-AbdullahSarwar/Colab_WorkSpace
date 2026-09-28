// Authored SVG, one stroke weight throughout. No glyph or emoji stands in for an icon.

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function IconThread({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2 4.5h12M2 8h8M2 11.5h5" />
    </svg>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8 3.5v9M3.5 8h9" />
    </svg>
  );
}

export function IconSend({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2.5 8h9M8.5 4.5 12 8l-3.5 3.5" />
    </svg>
  );
}

export function IconSignOut({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 13.5H3.5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1H6M10 11l3-3-3-3M13 8H6" />
    </svg>
  );
}

export function IconAlert({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8 2.5 14.5 13.5h-13L8 2.5ZM8 6.5v3M8 11.5h.01" />
    </svg>
  );
}

export function IconEmpty({ className }: IconProps) {
  return (
    <svg {...base} className={className} viewBox="0 0 32 32" strokeWidth={1.25}>
      <path d="M5 7h22M5 13h14M5 19h18M5 25h9" />
    </svg>
  );
}
