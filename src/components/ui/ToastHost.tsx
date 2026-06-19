import { useEffect } from "react";
import { CircleCheckBig, Info, X } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

const TONE_ICON = {
  default: Info,
  success: CircleCheckBig,
  error: X,
};

function ToastRow({ id, text, tone }: { id: string; text: string; tone: "default" | "success" | "error" }) {
  const dismissToast = useAppStore((s) => s.dismissToast);
  const Icon = TONE_ICON[tone];

  useEffect(() => {
    const timer = setTimeout(() => dismissToast(id), 2600);
    return () => clearTimeout(timer);
  }, [id, dismissToast]);

  const toneClasses =
    tone === "error"
      ? "bg-danger text-ivory-50"
      : tone === "success"
        ? "gradient-navy text-ivory-50"
        : "bg-navy-800 text-ivory-50";

  return (
    <div
      role="status"
      className={`flex items-center gap-2 rounded-chip px-4 py-3 shadow-[var(--shadow-md)] ${toneClasses} animate-[toast-in_200ms_ease-out]`}
    >
      <Icon className="size-4 shrink-0" />
      <span className="text-[13px] font-medium">{text}</span>
    </div>
  );
}

export function ToastHost() {
  const toasts = useAppStore((s) => s.toasts);
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[calc(max(env(safe-area-inset-top),20px)+64px)] z-50 flex flex-col items-center gap-2 px-6">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full max-w-[320px]">
          <ToastRow {...toast} />
        </div>
      ))}
    </div>
  );
}
