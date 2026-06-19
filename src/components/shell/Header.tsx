import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "../ui/IconButton";
import { Logo } from "./Logo";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  showLogo?: boolean;
}

export function Header({ title, showBack = true, onBack, right, showLogo = true }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-5 pt-[max(env(safe-area-inset-top),20px)] pb-3">
      <div className="flex w-10 shrink-0">
        {showBack && (
          <IconButton aria-label="Go back" onClick={() => (onBack ? onBack() : navigate(-1))}>
            <ChevronLeft className="size-5" />
          </IconButton>
        )}
      </div>
      {title && (
        <h1 className="flex-1 truncate text-center text-[17px] font-bold text-ink">{title}</h1>
      )}
      <div className={`flex shrink-0 items-center justify-end gap-2 ${right ? "" : "w-10"}`}>
        {right ?? (showLogo && <Logo size="sm" />)}
      </div>
    </div>
  );
}
