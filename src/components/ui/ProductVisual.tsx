import { DynamicIcon } from "./DynamicIcon";

interface ProductVisualProps {
  image?: string;
  icon: string;
  className?: string;
  iconClassName?: string;
}

export function ProductVisual({ image, icon, className = "", iconClassName = "size-8 text-gold-300" }: ProductVisualProps) {
  if (image) {
    return <img src={image} alt="" className={`object-cover ${className}`} />;
  }
  return (
    <div className={`gradient-navy flex items-center justify-center ${className}`}>
      <DynamicIcon name={icon} className={iconClassName} />
    </div>
  );
}
