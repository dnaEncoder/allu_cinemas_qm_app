import { Building2, Clock, MapPin, QrCode, Ticket, UtensilsCrossed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/shell/Logo";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { movies } from "../data/movies";
import { useAppStore } from "../store/useAppStore";
import { THEATRE_CONTEXT } from "../store/useAppStore";
import { timeBasedGreeting } from "../lib/greeting";
import { ORDER_STATUS_LABEL } from "../lib/orderStatus";

const QUICK_ACTIONS = [
  { label: "Current Movies", icon: Building2, action: "movies" as const },
  { label: "Scan QR", icon: QrCode, action: "menu" as const },
  { label: "Order Food", icon: UtensilsCrossed, action: "menu" as const },
  { label: "My Token", icon: Ticket, action: "token" as const },
];

export function HomeScreen() {
  const navigate = useNavigate();
  const activeOrder = useAppStore((s) => s.activeOrder);
  const pushToast = useAppStore((s) => s.pushToast);

  function handleQuickAction(action: "movies" | "menu" | "token") {
    if (action === "menu") navigate("/menu");
    else if (action === "token") {
      if (activeOrder) navigate("/tracking");
      else pushToast("No active order yet");
    } else {
      document.getElementById("now-playing")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="px-5 pt-[max(env(safe-area-inset-top),20px)] pb-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] text-text-secondary">{timeBasedGreeting()}</p>
          <h1 className="font-display text-[22px] font-bold text-ink">Welcome to Allu Cinemas</h1>
          <p className="mt-1 flex items-center gap-1 text-[12px] text-text-secondary">
            <MapPin className="size-3.5" /> {THEATRE_CONTEXT.location}
          </p>
        </div>
        <Logo size="md" />
      </div>

      <div className="gradient-navy relative mt-5 overflow-hidden rounded-hero p-6 shadow-[var(--shadow-lg)]">
        <div className="pointer-events-none absolute -right-10 -top-10 size-44 rounded-full bg-gold-500/10" />
        <div className="pointer-events-none absolute -bottom-12 -left-6 size-40 rounded-full bg-gold-500/10" />
        <p className="font-display text-[26px] leading-tight font-bold text-gold-300">
          Where Cinema Meets Grandeur
        </p>
        <p className="mt-2 text-[13px] text-ivory-50/80">
          Experience premium cinema, seamless ordering, and faster food pickup.
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <Button
            variant="gold"
            onClick={() => document.getElementById("now-playing")?.scrollIntoView({ behavior: "smooth" })}
          >
            View Current Movies
          </Button>
          <Button variant="outlineOnDark" onClick={() => navigate("/menu")}>
            Order Food
          </Button>
        </div>
      </div>

      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-ink">Quick Actions</h2>
          <span className="text-[12px] font-semibold text-text-tertiary">View All</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_ACTIONS.map(({ label, icon: Icon, action }) => (
            <button
              key={label}
              type="button"
              onClick={() => handleQuickAction(action)}
              className="flex flex-col items-center gap-2 rounded-card bg-surface px-1 py-3 text-center shadow-[var(--shadow-sm)] transition active:scale-95"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-surface-muted text-navy-900">
                <Icon className="size-5" />
              </span>
              <span className="text-[11px] font-semibold text-ink">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="now-playing" className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-ink">Now Playing</h2>
          <span className="text-[12px] font-semibold text-text-tertiary">View All</span>
        </div>
        <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5">
          {movies.map((movie) => (
            <div key={movie.title} className="w-36 shrink-0 rounded-card bg-surface p-3 shadow-[var(--shadow-sm)]">
              <div className="gradient-navy mb-2 flex h-20 items-center justify-center rounded-xl">
                <Building2 className="size-7 text-gold-300" />
              </div>
              <p className="truncate text-[13px] font-bold text-ink">{movie.title}</p>
              <p className="text-[11px] text-text-secondary">
                {movie.language} · {movie.runtime}
              </p>
              <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-info">
                <Clock className="size-3" /> {movie.nextShow}
              </p>
            </div>
          ))}
        </div>
      </section>

      {activeOrder && (
        <section className="mt-7">
          <Card
            className="gradient-navy flex items-center justify-between gap-3 p-4 text-ivory-50"
            onClick={() => navigate("/tracking")}
          >
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-gold-300 uppercase">
                Active Token · {ORDER_STATUS_LABEL[activeOrder.status]}
              </p>
              <p className="font-display text-2xl font-bold text-gold-300">{activeOrder.token}</p>
              <p className="text-[12px] text-ivory-50/75">Pickup Counter {activeOrder.pickupCounter}</p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/tracking")}
              className="shrink-0 rounded-chip border border-gold-300/50 px-3 py-2 text-[12px] font-semibold text-gold-300"
            >
              Track Order
            </button>
          </Card>
        </section>
      )}
    </div>
  );
}
