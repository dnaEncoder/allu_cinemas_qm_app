import type { Product } from "../types";
import popcorComboImg from "../assets/popcorn-combo.png";
import popcornCheeseImg from "../assets/popcorn-2-cheese.png";
import nachoComboImg from "../assets/nacho-combo.png";
import popcornCaramelImg from "../assets/popcorn-caramel.png";
import browniesImg from "../assets/brownies.png";

// NOTE: The source spec listed the Classic Popcorn Combo at a flat price (240)
// in the product catalogue, but separately defined Regular/Large size pricing
// (270/390) for its configurator. The flat price field below is set to match
// the Regular size so the menu-grid price and the configurator never disagree.
export const products: Product[] = [
  {
    id: "classic-popcorn-combo",
    name: "Classic Popcorn Combo",
    category: "Combos",
    description: "Large salted popcorn with Coke",
    price: 270,
    preparationMinutes: 6,
    available: true,
    icon: "Popcorn",
    image: popcorComboImg,
    sizes: [
      { name: "Regular", price: 270 },
      { name: "Large", price: 390 },
    ],
    flavours: ["Salted", "Caramel", "Cheese", "Butter"],
    addOns: [
      { name: "Extra Cheese", price: 60 },
      { name: "Upgrade to Large", price: 80 },
      { name: "Coke Large", price: 70 },
      { name: "Coke Zero", price: 70 },
      { name: "Bottled Water", price: 40 },
    ],
  },
  {
    id: "cheese-popcorn-combo",
    name: "Cheese Popcorn Combo",
    category: "Combos",
    description: "Cheese popcorn with regular drink",
    price: 260,
    preparationMinutes: 6,
    available: true,
    icon: "Popcorn",
    image: popcornCheeseImg,
  },
  {
    id: "nachos-combo",
    name: "Nachos Combo",
    category: "Snacks",
    description: "Nachos with cheese and regular drink",
    price: 220,
    preparationMinutes: 7,
    available: true,
    icon: "UtensilsCrossed",
    image: nachoComboImg,
  },
  {
    id: "cold-coffee",
    name: "Cold Coffee",
    category: "Beverages",
    description: "Smooth and creamy cold coffee",
    price: 160,
    preparationMinutes: 4,
    available: true,
    icon: "Coffee",
  },
  {
    id: "caramel-popcorn",
    name: "Caramel Popcorn",
    category: "Popcorn",
    description: "Sweet caramel popcorn",
    price: 190,
    preparationMinutes: 5,
    available: true,
    icon: "Popcorn",
    image: popcornCaramelImg,
  },
  {
    id: "bottled-water",
    name: "Bottled Water",
    category: "Beverages",
    description: "500 ml chilled water",
    price: 40,
    preparationMinutes: 1,
    available: true,
    icon: "Droplets",
  },
  {
    id: "chocolate-brownie",
    name: "Chocolate Brownie",
    category: "Desserts",
    description: "Warm fudge brownie with chocolate drizzle",
    price: 150,
    preparationMinutes: 3,
    available: true,
    icon: "Cookie",
    image: browniesImg,
  },
];

export const categories = [
  "Combos",
  "Popcorn",
  "Beverages",
  "Snacks",
  "Desserts",
  "Premium Picks",
  "Quick Pickup",
] as const;
