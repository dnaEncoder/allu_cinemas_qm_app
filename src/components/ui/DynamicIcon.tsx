import { FALLBACK_ICON, ICONS } from "../../lib/iconRegistry";

export function DynamicIcon({
  name,
  className,
  strokeWidth,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = ICONS[name] ?? FALLBACK_ICON;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}
