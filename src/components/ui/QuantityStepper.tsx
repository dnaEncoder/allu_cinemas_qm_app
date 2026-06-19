import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: "sm" | "md";
}

export function QuantityStepper({ quantity, onIncrease, onDecrease, size = "md" }: QuantityStepperProps) {
  const dimension = size === "sm" ? "size-8" : "size-11";
  return (
    <div className="inline-flex items-center gap-3 rounded-chip border border-border bg-surface px-1">
      <button
        type="button"
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className={`${dimension} flex items-center justify-center rounded-full text-navy-900 transition active:scale-90`}
      >
        <Minus className="size-4" />
      </button>
      <span className="min-w-[1.5ch] text-center text-[15px] font-semibold text-ink">{quantity}</span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label="Increase quantity"
        className={`${dimension} flex items-center justify-center rounded-full text-navy-900 transition active:scale-90`}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
