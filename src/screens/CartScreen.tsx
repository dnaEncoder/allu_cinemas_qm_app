import { useState } from "react";
import { Gift, ShoppingBag, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ContextCard } from "../components/shell/ContextCard";
import { Header } from "../components/shell/Header";
import { Button } from "../components/ui/Button";
import { QuantityStepper } from "../components/ui/QuantityStepper";
import { ProductVisual } from "../components/ui/ProductVisual";
import { calculateCartTotals, formatCurrency } from "../lib/pricing";
import { useAppStore } from "../store/useAppStore";

export function CartScreen() {
  const navigate = useNavigate();
  const cart = useAppStore((s) => s.cart);
  const increaseQuantity = useAppStore((s) => s.increaseQuantity);
  const decreaseQuantity = useAppStore((s) => s.decreaseQuantity);
  const rewardApplied = useAppStore((s) => s.rewardApplied);
  const toggleReward = useAppStore((s) => s.toggleReward);
  const promoApplied = useAppStore((s) => s.promoApplied);
  const promoError = useAppStore((s) => s.promoError);
  const applyPromoCode = useAppStore((s) => s.applyPromoCode);
  const removePromo = useAppStore((s) => s.removePromo);
  const loyaltyPoints = useAppStore((s) => s.loyaltyPoints);
  const setSelectedPayment = useAppStore((s) => s.setSelectedPayment);

  const [promoInput, setPromoInput] = useState("");

  const totals = calculateCartTotals(cart, rewardApplied, promoApplied);

  function handlePromoSubmit() {
    if (!promoInput.trim()) return;
    applyPromoCode(promoInput);
  }

  function handleGenerateCounterQR() {
    setSelectedPayment("counter");
    navigate("/payment/counter");
  }

  if (cart.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <Header title="Your Order" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-10 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-surface-muted text-navy-900">
            <ShoppingBag className="size-7" />
          </span>
          <p className="text-[14px] font-semibold text-ink">Your cart is empty</p>
          <p className="text-[13px] text-text-secondary">Browse the menu to add something delicious.</p>
          <Button onClick={() => navigate("/menu")}>Browse Menu</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      <Header title="Your Order" />
      <div className="flex-1 overflow-y-auto px-5 pb-44">
        <ContextCard />

        <h2 className="mt-5 mb-2 text-[15px] font-bold text-ink">Order Summary</h2>
        <div className="flex flex-col gap-3">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-card bg-surface p-3 shadow-[var(--shadow-sm)]">
              <ProductVisual
                image={item.image}
                icon={item.icon}
                className="size-14 shrink-0 rounded-xl"
                iconClassName="size-6 text-gold-300"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-ink">{item.name}</p>
                {(item.size || item.flavour || (item.addOns && item.addOns.length > 0)) && (
                  <p className="truncate text-[11px] text-text-secondary">
                    {[item.size, item.flavour, ...(item.addOns ?? [])].filter(Boolean).join(" · ")}
                  </p>
                )}
                <div className="mt-2">
                  <QuantityStepper
                    size="sm"
                    quantity={item.quantity}
                    onIncrease={() => increaseQuantity(item.id)}
                    onDecrease={() => decreaseQuantity(item.id)}
                  />
                </div>
              </div>
              <span className="shrink-0 text-[14px] font-bold text-ink">
                {formatCurrency(item.unitPrice * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={toggleReward}
            className="flex items-center justify-between rounded-card bg-surface p-4 shadow-[var(--shadow-sm)]"
          >
            <span className="flex items-center gap-3 text-left">
              <span className="flex size-9 items-center justify-center rounded-xl bg-surface-muted text-navy-900">
                <Gift className="size-4" />
              </span>
              <span>
                <span className="block text-[13px] font-semibold text-ink">Apply Rewards &amp; Offers</span>
                <span className="block text-[11px] text-text-secondary">
                  You have {loyaltyPoints.toLocaleString("en-IN")} points
                </span>
              </span>
            </span>
            <span className={`rounded-chip px-3 py-1.5 text-[12px] font-semibold ${rewardApplied ? "bg-success/15 text-success" : "border border-navy-900 text-navy-900"}`}>
              {rewardApplied ? "Applied" : "Apply"}
            </span>
          </button>

          <div className="rounded-card bg-surface p-4 shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-surface-muted text-navy-900">
                <Tag className="size-4" />
              </span>
              {promoApplied ? (
                <div className="flex flex-1 items-center justify-between">
                  <span className="text-[13px] font-semibold text-ink">Promo ALLU10 applied</span>
                  <button type="button" onClick={removePromo} className="text-[12px] font-semibold text-info">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Add Promo Code"
                    className="flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-text-tertiary"
                  />
                  <button
                    type="button"
                    onClick={handlePromoSubmit}
                    className="shrink-0 rounded-chip border border-navy-900 px-3 py-1.5 text-[12px] font-semibold text-navy-900"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
            {promoError && <p className="mt-2 text-[12px] text-danger">{promoError}</p>}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 rounded-card bg-surface p-4 shadow-[var(--shadow-sm)]">
          <Row label="Subtotal" value={formatCurrency(totals.subtotal)} />
          <Row label="Taxes &amp; Charges" value={formatCurrency(totals.tax)} />
          {totals.discount > 0 && (
            <Row label="Reward / Promo Discount" value={`-${formatCurrency(totals.discount)}`} tone="success" />
          )}
          <div className="my-1 h-px bg-border" />
          <Row label="Total (incl. taxes)" value={formatCurrency(totals.total)} bold />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-surface/95 px-5 py-4 backdrop-blur">
        <Button onClick={() => navigate("/payment")}>Pay Now · {formatCurrency(totals.total)}</Button>
        <Button variant="secondary" onClick={handleGenerateCounterQR}>
          Generate Counter QR
        </Button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
  bold,
}: {
  label: string;
  value: string;
  tone?: "success";
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-[13px] ${bold ? "font-bold text-ink" : "text-text-secondary"}`}>{label}</span>
      <span
        className={`text-[13px] ${bold ? "font-bold text-ink text-[16px]" : tone === "success" ? "font-semibold text-success" : "font-semibold text-ink"}`}
      >
        {value}
      </span>
    </div>
  );
}
