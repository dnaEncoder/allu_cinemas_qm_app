import type { OrderStatus } from "../types";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  confirmed: "Confirmed",
  payment_verified: "Payment Verified",
  preparing: "Preparing",
  ready: "Ready for Pickup",
  collected: "Collected",
};

export const ORDER_STATUS_DESCRIPTION: Record<OrderStatus, string> = {
  confirmed: "Your order has been received",
  payment_verified: "Your payment has been successfully verified",
  preparing: "We're preparing your order",
  ready: "Your order is ready for pickup",
  collected: "Enjoy your snacks!",
};
