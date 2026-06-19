import logoSrc from "../../assets/allu-movies-logo.svg";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  align?: "left" | "center" | "right";
}

const SIZE_CLASSES = {
  sm: "w-16",
  md: "w-24",
  lg: "w-40",
};

export function Logo({ size = "sm", align = "right" }: LogoProps) {
  return (
    <div
      className={`flex ${align === "center" ? "justify-center" : align === "left" ? "justify-start" : "justify-end"}`}
    >
      <img src={logoSrc} alt="Allu Cinemas" className={SIZE_CLASSES[size]} />
    </div>
  );
}
