import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { ToastHost } from "../ui/ToastHost";

interface AppFrameProps {
  children: ReactNode;
  showBottomNav: boolean;
}

export function AppFrame({ children, showBottomNav }: AppFrameProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-navy-950 sm:py-8">
      <div className="relative flex h-screen w-full max-w-[430px] flex-col overflow-hidden gradient-ivory sm:h-[844px] sm:rounded-[40px] sm:shadow-[var(--shadow-lg)] sm:ring-8 sm:ring-navy-950">
        <div className="no-scrollbar flex-1 overflow-y-auto">{children}</div>
        {showBottomNav && <BottomNav />}
        <ToastHost />
      </div>
    </div>
  );
}
