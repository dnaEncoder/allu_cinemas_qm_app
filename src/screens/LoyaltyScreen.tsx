import { Fragment } from "react";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/shell/Header";
import { ProgressBar } from "../components/ui/ProgressBar";
import { DynamicIcon } from "../components/ui/DynamicIcon";
import {
  DEFAULT_LOYALTY_TIER,
  LOYALTY_TIERS,
  NEXT_TIER_NAME,
  NEXT_TIER_THRESHOLD,
  loyaltyActivity,
  loyaltyRewards,
} from "../data/rewards";
import { useAppStore } from "../store/useAppStore";

const MEMBER_ID = "AC-28491";
const MONTH_STATS = { earned: 320, redeemed: 600, expiring: 100 };

export function LoyaltyScreen() {
  const navigate = useNavigate();
  const loyaltyPoints = useAppStore((s) => s.loyaltyPoints);
  const redeemReward = useAppStore((s) => s.redeemReward);

  const pointsToNextTier = Math.max(0, NEXT_TIER_THRESHOLD - loyaltyPoints);
  const progressPercent = Math.min(100, (loyaltyPoints / NEXT_TIER_THRESHOLD) * 100);
  const currentTierIndex = LOYALTY_TIERS.indexOf(DEFAULT_LOYALTY_TIER);

  return (
    <div className="pb-8">
      <Header title="Loyalty Points" />
      <div className="px-5">
        <div className="gradient-navy relative overflow-hidden rounded-hero p-5">
          <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-gold-500/10" />
          <div className="flex items-center justify-between">
            <span className="flex size-10 items-center justify-center rounded-full bg-gold-500/15 text-gold-300">
              <Crown className="size-5" />
            </span>
            <span className="text-[11px] text-ivory-50/60">Member ID {MEMBER_ID}</span>
          </div>
          <p className="mt-3 text-[12px] font-semibold tracking-wide text-gold-300/80 uppercase">
            {DEFAULT_LOYALTY_TIER} Member
          </p>
          <p className="font-display text-3xl font-bold text-gold-300">
            {loyaltyPoints.toLocaleString("en-IN")} points
          </p>
          <p className="mt-1 text-[12px] text-ivory-50/75">
            {pointsToNextTier} points to {NEXT_TIER_NAME}
          </p>
          <div className="mt-3">
            <ProgressBar value={progressPercent} />
          </div>
        </div>

        <div className="mt-5 flex items-center px-2">
          {LOYALTY_TIERS.map((tier, index) => (
            <Fragment key={tier}>
              <div className="flex shrink-0 flex-col items-center gap-1">
                <span
                  className={`flex size-9 items-center justify-center rounded-full text-[11px] font-bold ${
                    index <= currentTierIndex ? "gradient-gold text-navy-950" : "border-2 border-border text-text-tertiary"
                  }`}
                >
                  {tier.slice(0, 2)}
                </span>
                <span className={`text-[11px] font-semibold ${index === currentTierIndex ? "text-gold-600" : "text-text-tertiary"}`}>
                  {tier}
                </span>
              </div>
              {index < LOYALTY_TIERS.length - 1 && (
                <span className={`mx-1 h-[2px] flex-1 ${index < currentTierIndex ? "bg-gold-500" : "bg-border"}`} />
              )}
            </Fragment>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <StatCard label="Available Points" value={loyaltyPoints.toLocaleString("en-IN")} />
          <StatCard label="Earned this month" value={`+${MONTH_STATS.earned}`} />
          <StatCard label="Redeemed" value={MONTH_STATS.redeemed.toString()} />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-ink">Available Rewards</h2>
          <span className="text-[12px] font-semibold text-text-tertiary">View All</span>
        </div>
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
          {loyaltyRewards.map((reward) => {
            const affordable = loyaltyPoints >= reward.points;
            return (
              <div key={reward.id} className="w-40 shrink-0 rounded-card bg-surface p-3 shadow-[var(--shadow-sm)]">
                <div className="gradient-navy mb-2 flex h-16 items-center justify-center rounded-xl">
                  <DynamicIcon name={reward.icon} className="size-6 text-gold-300" />
                </div>
                <p className="text-[13px] font-semibold text-ink">{reward.name}</p>
                <button
                  type="button"
                  onClick={() => redeemReward(reward.name, reward.points)}
                  className={`mt-2 w-full rounded-chip py-2 text-[12px] font-semibold ${
                    affordable ? "gradient-gold text-navy-950" : "bg-disabled/30 text-text-tertiary"
                  }`}
                >
                  Redeem for {reward.points} points
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => navigate("/menu")}
          className="mt-5 flex w-full items-center gap-3 rounded-card bg-surface-muted p-4 text-left"
        >
          <span className="gradient-navy flex size-12 shrink-0 items-center justify-center rounded-xl">
            <DynamicIcon name="Popcorn" className="size-6 text-gold-300" />
          </span>
          <span className="flex-1">
            <span className="block text-[13px] font-semibold text-ink">Your usual combo</span>
            <span className="block text-[12px] text-text-secondary">Get 15% off on Popcorn + Coke today</span>
          </span>
          <span className="shrink-0 text-[12px] font-semibold text-info">View Offer</span>
        </button>

        <h2 className="mt-6 mb-2 text-[15px] font-bold text-ink">Loyalty Activity</h2>
        <div className="flex flex-col gap-2">
          {loyaltyActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between rounded-card bg-surface p-3 shadow-[var(--shadow-sm)]">
              <div>
                <p className="text-[13px] font-semibold text-ink">{activity.label}</p>
                <p className="text-[11px] text-text-secondary">{activity.date}</p>
              </div>
              <span className={`text-[13px] font-bold ${activity.points >= 0 ? "text-success" : "text-text-secondary"}`}>
                {activity.points >= 0 ? "+" : ""}
                {activity.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card bg-surface p-3 text-center shadow-[var(--shadow-sm)]">
      <p className="text-[15px] font-bold text-ink">{value}</p>
      <p className="text-[10px] text-text-secondary">{label}</p>
    </div>
  );
}
