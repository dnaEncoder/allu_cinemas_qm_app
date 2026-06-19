import { useState } from "react";
import { Armchair, MapPin, RotateCcw, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/shell/Header";
import { Button } from "../components/ui/Button";
import { THEATRE_CONTEXT, useAppStore } from "../store/useAppStore";

export function ProfileScreen() {
  const navigate = useNavigate();
  const resetPrototype = useAppStore((s) => s.resetPrototype);
  const pushToast = useAppStore((s) => s.pushToast);
  const [confirming, setConfirming] = useState(false);

  function handleResetClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    resetPrototype();
    pushToast("Prototype reset");
    setConfirming(false);
    navigate("/home");
  }

  return (
    <div className="px-5 pb-8">
      <Header title="Profile" showBack={false} />

      <div className="mt-2 flex flex-col items-center gap-2 py-4">
        <span className="gradient-navy flex size-20 items-center justify-center rounded-full text-gold-300">
          <User className="size-9" />
        </span>
        <p className="text-[15px] font-bold text-ink">Allu Cinemas Guest</p>
        <p className="text-[12px] text-text-secondary">Prototype session · no account required</p>
      </div>

      <div className="rounded-card bg-surface p-4 shadow-[var(--shadow-sm)]">
        <h2 className="mb-3 text-[14px] font-bold text-ink">Theatre Context</h2>
        <div className="flex flex-col gap-3 text-[13px]">
          <div className="flex items-center gap-3">
            <MapPin className="size-4 text-navy-900" />
            <span className="text-ink">
              {THEATRE_CONTEXT.name} · {THEATRE_CONTEXT.location}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Armchair className="size-4 text-navy-900" />
            <span className="text-ink">
              {THEATRE_CONTEXT.screen} · Seat {THEATRE_CONTEXT.seat} · Pickup Counter {THEATRE_CONTEXT.pickupCounter}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-card bg-surface-muted p-4">
        <p className="text-[12px] text-text-secondary">
          CineFlow is a front-end prototype. No real payments, accounts, or kitchen systems are connected. All
          data lives only in this browser and can be cleared at any time.
        </p>
      </div>

      <div className="mt-6">
        <Button
          variant={confirming ? "danger" : "secondary"}
          icon={<RotateCcw className="size-4" />}
          onClick={handleResetClick}
        >
          {confirming ? "Tap again to confirm reset" : "Reset Prototype"}
        </Button>
        {confirming && (
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="mt-2 w-full text-center text-[12px] font-semibold text-text-secondary"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
