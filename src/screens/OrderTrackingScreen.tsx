import { CircleCheckBig, House, LifeBuoy, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/shell/Header";
import { Button } from "../components/ui/Button";
import { ProductVisual } from "../components/ui/ProductVisual";
import { formatCurrency } from "../lib/pricing";
import { formatTime } from "../lib/format";
import { ORDER_STATUS_DESCRIPTION, ORDER_STATUS_LABEL } from "../lib/orderStatus";
import { ORDER_STATUS_SEQUENCE, THEATRE_CONTEXT, useAppStore } from "../store/useAppStore";

const PAYMENT_LABEL: Record<string, string> = {
  upi: "Paid online · UPI",
  card: "Paid online · Card",
  wallet: "Paid online · Wallet",
  counter: "Paid at counter",
};

export function OrderTrackingScreen() {
  const navigate = useNavigate();
  const activeOrder = useAppStore((s) => s.activeOrder);
  const advanceOrderStatus = useAppStore((s) => s.advanceOrderStatus);
  const pushToast = useAppStore((s) => s.pushToast);

  if (!activeOrder) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Track Your Order" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-10 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-surface-muted text-navy-900">
            <Ticket className="size-7" />
          </span>
          <p className="text-[14px] font-semibold text-ink">No active order</p>
          <p className="text-[13px] text-text-secondary">Order something from the menu to get a token.</p>
          <Button onClick={() => navigate("/home")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(activeOrder.status);
  const isCollected = activeOrder.status === "collected";

  return (
    <div className="pb-8">
      <Header title="Track Your Order" />
      <div className="px-5">
        <div className="gradient-navy relative overflow-hidden rounded-hero p-5">
          <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-gold-500/10" />
          <span className="flex size-10 items-center justify-center rounded-full bg-gold-500/15 text-gold-300">
            <Ticket className="size-5" />
          </span>
          <p className="mt-3 text-[11px] font-semibold tracking-wide text-gold-300/80 uppercase">
            {ORDER_STATUS_LABEL[activeOrder.status]}
          </p>
          <p className="font-display text-3xl font-bold text-gold-300">{activeOrder.token}</p>
          <div className="mt-3 flex items-center gap-4 text-[12px] text-ivory-50/80">
            <span>Pickup Counter {activeOrder.pickupCounter}</span>
            <span>
              {isCollected
                ? "Collected"
                : `Ready in approx. ${Math.max(...activeOrder.items.map((item) => item.estimatedPreparationMinutes))} mins`}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {ORDER_STATUS_SEQUENCE.map((status, index) => {
            const done = index <= currentIndex;
            const current = index === currentIndex && status !== "collected";
            const timestamp = activeOrder.statusTimestamps[status];
            return (
              <div key={status} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                      done
                        ? current
                          ? "border-2 border-gold-500 text-gold-600"
                          : "bg-navy-900 text-ivory-50"
                        : "border-2 border-border text-transparent"
                    }`}
                  >
                    {done && !current && <CircleCheckBig className="size-3.5" />}
                  </span>
                  {index < ORDER_STATUS_SEQUENCE.length - 1 && (
                    <span className={`mt-1 h-8 w-[2px] ${done ? "bg-navy-900" : "bg-border"}`} />
                  )}
                </div>
                <div className="pb-2">
                  <p className={`text-[14px] font-bold ${current ? "text-gold-600" : done ? "text-ink" : "text-text-tertiary"}`}>
                    {ORDER_STATUS_LABEL[status]}
                  </p>
                  <p className="text-[12px] text-text-secondary">{ORDER_STATUS_DESCRIPTION[status]}</p>
                  {timestamp && <p className="mt-0.5 text-[11px] text-text-tertiary">{formatTime(timestamp)}</p>}
                </div>
              </div>
            );
          })}
        </div>

        {!isCollected && (
          <button
            type="button"
            onClick={advanceOrderStatus}
            className="mt-2 w-full rounded-chip border border-dashed border-navy-900/40 py-2 text-[12px] font-semibold text-navy-900"
          >
            Advance Demo Status (prototype only)
          </button>
        )}

        <h2 className="mt-6 mb-2 text-[15px] font-bold text-ink">Order Summary</h2>
        <div className="flex flex-col gap-2">
          {activeOrder.items.map((item, index) => (
            <div key={index} className="flex items-center gap-3 rounded-card bg-surface p-3 shadow-[var(--shadow-sm)]">
              <ProductVisual
                image={item.image}
                icon={item.icon}
                className="size-11 shrink-0 rounded-xl"
                iconClassName="size-5 text-gold-300"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-ink">
                  {item.name} {item.quantity > 1 && `x${item.quantity}`}
                </p>
                {item.size && <p className="text-[11px] text-text-secondary">{item.size}</p>}
              </div>
              <span className="text-[13px] font-bold text-ink">{formatCurrency(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[12px] text-text-secondary">
          {PAYMENT_LABEL[activeOrder.paymentMethod]} · {THEATRE_CONTEXT.screen} · Seat {THEATRE_CONTEXT.seat}
        </p>

        <div className="mt-5 flex gap-3">
          <Button variant="secondary" icon={<House className="size-4" />} onClick={() => navigate("/menu")}>
            Add More Items
          </Button>
          <Button
            variant="gold"
            icon={<LifeBuoy className="size-4" />}
            onClick={() => pushToast("Support isn't wired up in this prototype")}
          >
            Need Help?
          </Button>
        </div>
      </div>
    </div>
  );
}
