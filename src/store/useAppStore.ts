import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Order, OrderStatus, PaymentMethod } from "../types";
import {
  PROMO_CODE,
  calculateCartTotals,
  calculateLoyaltyPointsEarned,
  generateOrderId,
  generateToken,
} from "../lib/pricing";
import { DEFAULT_LOYALTY_POINTS } from "../data/rewards";

export const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  "confirmed",
  "payment_verified",
  "preparing",
  "ready",
  "collected",
];

export const THEATRE_CONTEXT = {
  name: "Allu Cinemas",
  location: "Kokapet, Hyderabad",
  screen: "Screen 1",
  seat: "G12",
  pickupCounter: 3,
};

export interface ToastMessage {
  id: string;
  text: string;
  tone: "default" | "success" | "error";
}

interface NewCartItemInput {
  productId: string;
  name: string;
  icon: string;
  image?: string;
  unitPrice: number;
  quantity: number;
  size?: string;
  flavour?: string;
  addOns?: string[];
  estimatedPreparationMinutes: number;
}

interface AppState {
  cart: CartItem[];
  selectedPayment: PaymentMethod;
  rewardApplied: boolean;
  promoApplied: boolean;
  promoError: string | null;
  activeOrder: Order | null;
  loyaltyPoints: number;
  favouriteProductIds: string[];
  toasts: ToastMessage[];

  addToCart: (item: NewCartItemInput) => void;
  increaseQuantity: (cartItemId: string) => void;
  decreaseQuantity: (cartItemId: string) => void;
  removeFromCart: (cartItemId: string) => void;
  toggleFavourite: (productId: string) => void;
  toggleReward: () => void;
  applyPromoCode: (code: string) => void;
  removePromo: () => void;
  setSelectedPayment: (method: PaymentMethod) => void;
  confirmOrder: (paymentMethod: PaymentMethod) => Order;
  advanceOrderStatus: () => void;
  redeemReward: (rewardName: string, points: number) => void;
  resetPrototype: () => void;
  pushToast: (text: string, tone?: ToastMessage["tone"]) => void;
  dismissToast: (id: string) => void;
}

function sameConfiguration(a: NewCartItemInput, b: CartItem): boolean {
  return (
    a.productId === b.productId &&
    a.size === b.size &&
    a.flavour === b.flavour &&
    JSON.stringify(a.addOns ?? []) === JSON.stringify(b.addOns ?? [])
  );
}

const DEFAULTS = {
  cart: [] as CartItem[],
  selectedPayment: "upi" as PaymentMethod,
  rewardApplied: false,
  promoApplied: false,
  promoError: null as string | null,
  activeOrder: null as Order | null,
  loyaltyPoints: DEFAULT_LOYALTY_POINTS,
  favouriteProductIds: [] as string[],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...DEFAULTS,
      toasts: [],

      addToCart: (item) =>
        set((state) => {
          const existing = state.cart.find((row) => sameConfiguration(item, row));
          if (existing) {
            return {
              cart: state.cart.map((row) =>
                row.id === existing.id
                  ? { ...row, quantity: row.quantity + item.quantity }
                  : row,
              ),
            };
          }
          const newItem: CartItem = {
            id: `${item.productId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            productId: item.productId,
            name: item.name,
            icon: item.icon,
            image: item.image,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            size: item.size,
            flavour: item.flavour,
            addOns: item.addOns,
            estimatedPreparationMinutes: item.estimatedPreparationMinutes,
          };
          return { cart: [...state.cart, newItem] };
        }),

      increaseQuantity: (cartItemId) =>
        set((state) => ({
          cart: state.cart.map((row) =>
            row.id === cartItemId ? { ...row, quantity: row.quantity + 1 } : row,
          ),
        })),

      decreaseQuantity: (cartItemId) =>
        set((state) => {
          const row = state.cart.find((r) => r.id === cartItemId);
          if (!row) return {};
          if (row.quantity <= 1) {
            return { cart: state.cart.filter((r) => r.id !== cartItemId) };
          }
          return {
            cart: state.cart.map((r) =>
              r.id === cartItemId ? { ...r, quantity: r.quantity - 1 } : r,
            ),
          };
        }),

      removeFromCart: (cartItemId) =>
        set((state) => ({ cart: state.cart.filter((r) => r.id !== cartItemId) })),

      toggleFavourite: (productId) =>
        set((state) => ({
          favouriteProductIds: state.favouriteProductIds.includes(productId)
            ? state.favouriteProductIds.filter((id) => id !== productId)
            : [...state.favouriteProductIds, productId],
        })),

      toggleReward: () =>
        set((state) => ({
          rewardApplied: !state.rewardApplied,
        })),

      applyPromoCode: (code) => {
        const normalised = code.trim().toUpperCase();
        if (normalised === PROMO_CODE) {
          set({ promoApplied: true, promoError: null });
          get().pushToast("Promo code applied", "success");
        } else {
          set({ promoApplied: false, promoError: "Invalid promo code. Try ALLU10." });
          get().pushToast("Invalid promo code", "error");
        }
      },

      removePromo: () => set({ promoApplied: false, promoError: null }),

      setSelectedPayment: (method) => set({ selectedPayment: method }),

      confirmOrder: (paymentMethod) => {
        const state = get();
        const totals = calculateCartTotals(state.cart, state.rewardApplied, state.promoApplied);
        const now = Date.now();
        const order: Order = {
          id: generateOrderId(),
          token: generateToken(),
          items: state.cart.map((item) => ({
            name: item.name,
            icon: item.icon,
            image: item.image,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            size: item.size,
            estimatedPreparationMinutes: item.estimatedPreparationMinutes,
          })),
          subtotal: totals.subtotal,
          tax: totals.tax,
          discount: totals.discount,
          total: totals.total,
          paymentMethod,
          pickupCounter: THEATRE_CONTEXT.pickupCounter,
          status: "payment_verified",
          createdAt: now,
          statusTimestamps: { confirmed: now, payment_verified: now },
        };
        set({
          activeOrder: order,
          cart: [],
          rewardApplied: false,
          promoApplied: false,
          promoError: null,
        });
        return order;
      },

      advanceOrderStatus: () =>
        set((state) => {
          if (!state.activeOrder) return {};
          const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(state.activeOrder.status);
          if (currentIndex === -1 || currentIndex >= ORDER_STATUS_SEQUENCE.length - 1) {
            return {};
          }
          const nextStatus = ORDER_STATUS_SEQUENCE[currentIndex + 1];
          const updatedOrder: Order = {
            ...state.activeOrder,
            status: nextStatus,
            statusTimestamps: { ...state.activeOrder.statusTimestamps, [nextStatus]: Date.now() },
          };
          let loyaltyPoints = state.loyaltyPoints;
          if (nextStatus === "collected") {
            loyaltyPoints += calculateLoyaltyPointsEarned(updatedOrder.total);
            get().pushToast("Order collected · loyalty points added", "success");
          }
          return { activeOrder: updatedOrder, loyaltyPoints };
        }),

      redeemReward: (rewardName, points) => {
        const state = get();
        if (state.loyaltyPoints < points) {
          state.pushToast("Not enough points", "error");
          return;
        }
        set({ loyaltyPoints: state.loyaltyPoints - points });
        state.pushToast(`Redeemed: ${rewardName}`, "success");
      },

      resetPrototype: () =>
        set({
          ...DEFAULTS,
          toasts: [],
        }),

      pushToast: (text, tone = "default") =>
        set({
          toasts: [{ id: `${Date.now()}-${Math.random()}`, text, tone }],
        }),

      dismissToast: (id) =>
        set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
    }),
    {
      name: "allu-cineflow-prototype",
      partialize: (state) => ({
        cart: state.cart,
        activeOrder: state.activeOrder,
        loyaltyPoints: state.loyaltyPoints,
        rewardApplied: state.rewardApplied,
        promoApplied: state.promoApplied,
        favouriteProductIds: state.favouriteProductIds,
      }),
    },
  ),
);
