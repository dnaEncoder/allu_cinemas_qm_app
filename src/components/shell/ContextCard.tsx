import { Armchair, MapPin } from "lucide-react";
import { THEATRE_CONTEXT } from "../../store/useAppStore";
import { useAppStore } from "../../store/useAppStore";

export function ContextCard({ showChange = true }: { showChange?: boolean }) {
  const pushToast = useAppStore((s) => s.pushToast);

  return (
    <div className="flex items-center gap-3 rounded-card bg-surface-muted px-4 py-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface text-navy-900">
        <Armchair className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-ink">
          {THEATRE_CONTEXT.screen} · Seat {THEATRE_CONTEXT.seat}
        </p>
        <p className="flex items-center gap-1 truncate text-[12px] text-text-secondary">
          <MapPin className="size-3" /> Pickup from Counter {THEATRE_CONTEXT.pickupCounter}
        </p>
      </div>
      {showChange && (
        <button
          type="button"
          onClick={() => pushToast("Seat and screen are fixed for this prototype")}
          className="shrink-0 text-[13px] font-semibold text-info"
        >
          Change
        </button>
      )}
    </div>
  );
}
