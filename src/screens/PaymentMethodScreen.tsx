import { CreditCard, Info, QrCode, Smartphone, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/shell/Header";
import { Logo } from "../components/shell/Logo";
import { Button } from "../components/ui/Button";
import { RadioOption } from "../components/ui/RadioOption";
import { calculateCartTotals, cartItemCount, cartMaxPrepTime, formatCurrency } from "../lib/pricing";
import { useAppStore } from "../store/useAppStore";
import { THEATRE_CONTEXT } from "../store/useAppStore";
import type { PaymentMethod } from "../types";

const METHODS: { id: PaymentMethod; title: string; subtitle: string; icon: typeof Smartphone }[] = [
  { id: "upi", title: "UPI", subtitle: "Pay using UPI apps", icon: Smartphone },
  { id: "card", title: "Cards", subtitle: "Debit / Credit Cards", icon: CreditCard },
  { id: "wallet", title: "Wallets", subtitle: "Pay using wallet", icon: Wallet },
  { id: "counter", title: "Counter Payment QR", subtitle: "Pay at counter using QR", icon: QrCode },
];

const MESSAGES: Record<PaymentMethod, string> = {
  upi: "You'll complete a simulated UPI payment. No real UPI credentials are requested.",
  card: "You'll complete a simulated card payment. No real card details are requested.",
  wallet: "You'll complete a simulated wallet payment. No real wallet credentials are requested.",
  counter: "Place your order now and complete payment at the counter using a QR code.",
};

export function PaymentMethodScreen() {
  const navigate = useNavigate();
  const cart = useAppStore((s) => s.cart);
  const rewardApplied = useAppStore((s) => s.rewardApplied);
  const promoApplied = useAppStore((s) => s.promoApplied);
  const selectedPayment = useAppStore((s) => s.selectedPayment);
  const setSelectedPayment = useAppStore((s) => s.setSelectedPayment);

  const totals = calculateCartTotals(cart, rewardApplied, promoApplied);

  function handleContinue() {
    if (selectedPayment === "counter") {
      navigate("/payment/counter");
    } else {
      navigate("/payment/processing");
    }
  }

  return (
    <div className="relative flex h-full flex-col">
      <Header title="Choose Payment Method" showLogo={false} />
      <div className="flex-1 overflow-y-auto px-5 pb-32">
        <div className="flex justify-center py-2">
          <Logo size="lg" align="center" />
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {METHODS.map((method) => (
            <RadioOption
              key={method.id}
              selected={selectedPayment === method.id}
              onSelect={() => setSelectedPayment(method.id)}
              icon={<method.icon className="size-4" />}
              title={method.title}
              subtitle={method.subtitle}
            />
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-2 rounded-card bg-surface p-4 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-text-secondary">{cartItemCount(cart)} items · Total</span>
            <span className="font-bold text-ink">{formatCurrency(totals.total)}</span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-text-secondary">Pickup Counter</span>
            <span className="font-semibold text-ink">{THEATRE_CONTEXT.pickupCounter}</span>
          </div>
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-text-secondary">Estimated Ready Time</span>
            <span className="font-semibold text-ink">{cartMaxPrepTime(cart)} mins</span>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-card bg-surface-muted p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-info" />
          <p className="text-[12px] text-text-secondary">{MESSAGES[selectedPayment]}</p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-surface/95 px-5 py-4 backdrop-blur">
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </div>
  );
}
