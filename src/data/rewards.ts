import type { LoyaltyActivity, LoyaltyReward } from "../types";

export const loyaltyRewards: LoyaltyReward[] = [
  { id: "free-popcorn-upgrade", name: "Free Popcorn Upgrade", points: 300, icon: "Popcorn" },
  { id: "combo-discount", name: "₹100 off on Combos", points: 500, icon: "Tag" },
  { id: "premium-seat-upgrade", name: "Premium Seat Upgrade", points: 1200, icon: "Armchair" },
];

export const loyaltyActivity: LoyaltyActivity[] = [
  { id: "act-1", label: "Popcorn Combo Order", points: 80, date: "12 May 2026" },
  { id: "act-2", label: "Reward Redeemed", points: -300, date: "10 May 2026" },
];

// The reference screenshot labels the third tier "Legacy" in its compact
// stepper but "Grandeur" in the hero headline. The written spec (Screen
// Specifications + Prototype Behaviour docs) only ever names "Grandeur", so
// that's the canonical name used throughout this tier ladder.
export const LOYALTY_TIERS = ["Blue", "Gold", "Grandeur"] as const;
export const DEFAULT_LOYALTY_POINTS = 1240;
export const DEFAULT_LOYALTY_TIER = "Gold";
export const NEXT_TIER_NAME = "Grandeur";
export const NEXT_TIER_THRESHOLD = 1500;
