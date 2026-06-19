import { useEffect, useRef, useState } from "react";
import { CircleCheckBig, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { calculateCartTotals, formatCurrency } from "../lib/pricing";
import { useAppStore } from "../store/useAppStore";

const METHOD_LABEL: Record<string, string> = {
  upi: "UPI",
  card: "Card",
  wallet: "Wallet",
  counter: "Counter",
};

export function FakePaymentScreen() {
  const navigate = useNavigate();
  const cart = useAppStore((s) => s.cart);
  const rewardApplied = useAppStore((s) => s.rewardApplied);
  const promoApplied = useAppStore((s) => s.promoApplied);
  const selectedPayment = useAppStore((s) => s.selectedPayment);
  const confirmOrder = useAppStore((s) => s.confirmOrder);
  const pushToast = useAppStore((s) => s.pushToast);

  const [stage, setStage] = useState<"processing" | "success">("processing");
  const hasConfirmed = useRef(false);
  const totals = calculateCartTotals(cart, rewardApplied, promoApplied);

  useEffect(() => {
    if (cart.length === 0 && !hasConfirmed.current) {
      navigate("/menu", { replace: true });
      return;
    }

    const processingTimer = setTimeout(() => {
      if (hasConfirmed.current) return;
      hasConfirmed.current = true;
      confirmOrder(selectedPayment);
      pushToast("Payment successful", "success");
      setStage("success");
    }, 1000);

    return () => clearTimeout(processingTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stage !== "success") return;
    const navTimer = setTimeout(() => navigate("/tracking", { replace: true }), 900);
    return () => clearTimeout(navTimer);
  }, [stage, navigate]);

  return (
    <div className="gradient-navy flex h-full flex-col items-center justify-center px-8 text-center">
      {stage === "processing" ? (
        <>
          <LoaderCircle className="size-12 animate-spin text-gold-300" />
          <p className="mt-6 text-[13px] font-semibold tracking-wide text-ivory-50/70 uppercase">
            {METHOD_LABEL[selectedPayment]} Payment
          </p>
          <p className="font-display mt-2 text-[28px] font-bold text-gold-300">
            {formatCurrency(totals.total)}
          </p>
          <p className="mt-4 text-[14px] text-ivory-50/80">Processing your payment…</p>
        </>
      ) : (
        <>
          <span className="flex size-16 items-center justify-center rounded-full bg-success/20">
            <CircleCheckBig className="size-9 text-success" />
          </span>
          <p className="mt-6 text-[18px] font-bold text-ivory-50">Payment Successful</p>
          <p className="mt-2 text-[13px] text-ivory-50/70">Generating your token…</p>
        </>
      )}
    </div>
  );
}
