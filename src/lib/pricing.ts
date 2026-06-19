import type { CartItem } from "../types";

export const TAX_RATE = 0.05;
export const REWARD_DISCOUNT = 100;
export const PROMO_CODE = "ALLU10";
export const PROMO_DISCOUNT_RATE = 0.1;

export function cartItemLineTotal(item: CartItem): number {
  return item.unitPrice * item.quantity;
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + cartItemLineTotal(item), 0);
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartMaxPrepTime(items: CartItem[]): number {
  return items.reduce((max, item) => Math.max(max, item.estimatedPreparationMinutes), 0);
}

export interface CartTotals {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}

export function calculateCartTotals(
  items: CartItem[],
  rewardApplied: boolean,
  promoApplied: boolean,
): CartTotals {
  const subtotal = cartSubtotal(items);
  const tax = Math.round(subtotal * TAX_RATE);
  const rewardDiscount = rewardApplied ? REWARD_DISCOUNT : 0;
  const promoDiscount = promoApplied ? Math.round(subtotal * PROMO_DISCOUNT_RATE) : 0;
  const discount = rewardDiscount + promoDiscount;
  const total = Math.max(0, subtotal + tax - discount);
  return { subtotal, tax, discount, total };
}

export function formatCurrency(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

export function generateOrderId(): string {
  const digits = Math.floor(10000 + Math.random() * 90000);
  return `CF${digits}`;
}

export function generateToken(): string {
  const digits = Math.floor(100 + Math.random() * 900);
  return `A${digits}`;
}

export function calculateLoyaltyPointsEarned(total: number): number {
  return Math.round(Math.max(20, total / 15));
}
