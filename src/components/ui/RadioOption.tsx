import type { ReactNode } from "react";

interface RadioOptionProps {
  selected: boolean;
  onSelect: () => void;
  icon: ReactNode;
  title: string;
  subtitle: string;
}

export function RadioOption({ selected, onSelect, icon, title, subtitle }: RadioOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full items-center gap-3 rounded-card border-2 bg-surface p-4 text-left transition ${
        selected ? "border-gold-500" : "border-transparent"
      } shadow-[var(--shadow-sm)]`}
    >
      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-navy-900" : "border-border"
        }`}
      >
        {selected && <span className="size-2.5 rounded-full bg-navy-900" />}
      </span>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-navy-900">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-[15px] font-semibold text-ink">{title}</span>
        <span className="block text-[13px] text-text-secondary">{subtitle}</span>
      </span>
    </button>
  );
}
