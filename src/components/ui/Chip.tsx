import type { ButtonHTMLAttributes } from "react";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function Chip({ active = false, className = "", children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      className={`shrink-0 rounded-chip px-4 py-2 text-[13px] font-semibold whitespace-nowrap transition ${
        active
          ? "gradient-navy text-ivory-50"
          : "bg-surface text-navy-900 border border-border"
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
