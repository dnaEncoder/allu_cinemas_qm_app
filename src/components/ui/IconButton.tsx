import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  badge?: number;
  tone?: "light" | "navy";
}

export function IconButton({ children, badge, tone = "light", className = "", ...rest }: IconButtonProps) {
  const toneClasses = tone === "navy" ? "bg-navy-900 text-ivory-50" : "bg-surface text-navy-900";
  return (
    <button
      type="button"
      className={`relative flex size-10 shrink-0 items-center justify-center rounded-full shadow-[var(--shadow-sm)] transition active:scale-90 ${toneClasses} ${className}`}
      {...rest}
    >
      {children}
      {typeof badge === "number" && badge > 0 && (
        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-gold-500 text-[11px] font-bold text-navy-950">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}
