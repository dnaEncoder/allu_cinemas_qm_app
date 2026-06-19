import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "outlineOnDark" | "gold" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

// Each variant must own every colour utility it sets (bg/border/text) so two
// variants never leave same-property Tailwind classes to fight over cascade
// order when a screen passes extra className overrides.
const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "gradient-navy text-ivory-50 disabled:opacity-50",
  secondary: "bg-surface border-2 border-navy-900 text-navy-900 disabled:opacity-50",
  ghost: "bg-transparent text-navy-900 disabled:opacity-50",
  outlineOnDark: "bg-transparent border-2 border-ivory-50/40 text-ivory-50 disabled:opacity-50",
  gold: "gradient-gold text-navy-950 disabled:opacity-50",
  danger: "bg-danger text-ivory-50 disabled:opacity-50",
};

export function Button({
  variant = "primary",
  loading = false,
  icon,
  fullWidth = true,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-btn px-6 font-semibold text-[15px] tracking-wide transition active:scale-[0.98] disabled:active:scale-100 ${
        fullWidth ? "w-full" : ""
      } h-[54px] ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {loading ? <LoaderCircle className="size-5 animate-spin" /> : icon}
      <span>{children}</span>
    </button>
  );
}
