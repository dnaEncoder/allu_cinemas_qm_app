import { Crown, House, User, UtensilsCrossed } from "lucide-react";
import { NavLink } from "react-router-dom";

const ITEMS = [
  { to: "/home", label: "Home", icon: House },
  { to: "/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/loyalty", label: "Loyalty", icon: Crown },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  return (
    <nav className="gradient-navy rounded-t-[24px] px-2 pt-2 pb-[max(env(safe-area-inset-bottom),12px)] shadow-[var(--shadow-lg)]">
      <ul className="flex items-center justify-between">
        {ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-semibold transition ${
                  isActive ? "text-gold-300" : "text-ivory-50/70"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="size-5" strokeWidth={isActive ? 2.4 : 2} />
                  <span>{label}</span>
                  <span
                    className={`h-[3px] w-5 rounded-chip transition ${isActive ? "bg-gold-300" : "bg-transparent"}`}
                  />
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
