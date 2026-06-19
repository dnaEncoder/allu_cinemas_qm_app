export type PaymentMethod = "upi" | "card" | "wallet" | "counter";

export type ProductCategory =
  | "Combos"
  | "Popcorn"
  | "Beverages"
  | "Snacks"
  | "Desserts"
  | "Premium Picks"
  | "Quick Pickup";

export interface ProductSizeOption {
  name: string;
  price: number;
}

export interface ProductAddOn {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  preparationMinutes: number;
  available: boolean;
  icon: string;
  image?: string;
  sizes?: ProductSizeOption[];
  flavours?: string[];
  addOns?: ProductAddOn[];
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  icon: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  size?: string;
  flavour?: string;
  addOns?: string[];
  estimatedPreparationMinutes: number;
}

export type OrderStatus =
  | "confirmed"
  | "payment_verified"
  | "preparing"
  | "ready"
  | "collected";

export interface OrderItemSnapshot {
  name: string;
  icon: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  size?: string;
  estimatedPreparationMinutes: number;
}

export interface Order {
  id: string;
  token: string;
  items: OrderItemSnapshot[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  pickupCounter: number;
  status: OrderStatus;
  createdAt: number;
  statusTimestamps: Partial<Record<OrderStatus, number>>;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  points: number;
  icon: string;
}

export interface LoyaltyActivity {
  id: string;
  label: string;
  points: number;
  date: string;
}

export interface Movie {
  title: string;
  language: string;
  runtime: string;
  nextShow: string;
}
