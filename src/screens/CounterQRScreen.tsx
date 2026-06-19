import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/shell/Header";
import { Button } from "../components/ui/Button";
import { calculateCartTotals, formatCurrency, generateOrderId } from "../lib/pricing";
import { useAppStore } from "../store/useAppStore";

const COUNTDOWN_SECONDS = 5 * 60;

export function CounterQRScreen() {
  const navigate = useNavigate();
  const cart = useAppStore((s) => s.cart);
  const rewardApplied = useAppStore((s) => s.rewardApplied);
  const promoApplied = useAppStore((s) => s.promoApplied);
  const confirmOrder = useAppStore((s) => s.confirmOrder);
  const pushToast = useAppStore((s) => s.pushToast);

  const pendingOrderId = useMemo(() => generateOrderId(), []);
  const totals = calculateCartTotals(cart, rewardApplied, promoApplied);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (cart.length === 0 && !confirmed) {
      navigate("/menu", { replace: true });
      return;
    }
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const expired = secondsLeft <= 0;
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  function handleSimulateConfirmation() {
    confirmOrder("counter");
    pushToast("Counter payment confirmed", "success");
    setConfirmed(true);
    navigate("/tracking", { replace: true });
  }

  return (
    <div className="relative flex h-full flex-col">
      <Header title="Counter Payment QR" />
      <div className="flex-1 overflow-y-auto px-5 pb-36">
        <div className="rounded-card bg-surface p-5 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between text-[13px]">
            <div>
              <p className="text-text-secondary">Order ID</p>
              <p className="font-semibold text-ink">{pendingOrderId}</p>
            </div>
            <div className="text-right">
              <p className="text-text-secondary">Amount</p>
              <p className="font-bold text-ink">{formatCurrency(totals.total)}</p>
            </div>
          </div>

          <div className="mt-5 flex justify-center">
            <div className="relative rounded-2xl border border-border p-3">
              <QRCodeSVG
                value={`CINEFLOW-PROTOTYPE:${pendingOrderId}`}
                size={176}
                fgColor="#06265e"
                bgColor="#ffffff"
                level="H"
                marginSize={2}
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="gradient-gold flex size-11 items-center justify-center rounded-full border-4 border-white text-[9px] font-bold text-navy-950">
                  ALLU
                </span>
              </span>
            </div>
          </div>

          <p className="mt-4 flex items-center justify-center gap-2 text-[13px] font-semibold text-ink">
            <Clock className="size-4" /> Expires in {minutes}:{seconds}
          </p>

          <p className="mt-2 text-center text-[12px] font-semibold">
            {expired ? (
              <span className="text-danger">QR expired</span>
            ) : (
              <span className="text-warning">Counter payment pending</span>
            )}
          </p>
        </div>

        <div className="mt-4 rounded-card bg-surface-muted p-4">
          <p className="text-[12px] text-text-secondary">
            Show this QR at the counter to complete payment. Your order will move to preparation after payment
            confirmation. This QR is for prototype demonstration only and is not connected to a real payment
            network.
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-surface/95 px-5 py-4 backdrop-blur">
        {!expired ? (
          <Button onClick={handleSimulateConfirmation}>Simulate Counter Confirmation</Button>
        ) : (
          <Button onClick={() => navigate("/payment")}>Generate a New QR</Button>
        )}
        <Button variant="secondary" onClick={() => navigate("/payment")}>
          Change Payment Method
        </Button>
      </div>
    </div>
  );
}
