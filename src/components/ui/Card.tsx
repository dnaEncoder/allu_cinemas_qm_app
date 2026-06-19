import type { HTMLAttributes } from "react";

export function Card({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-card bg-surface p-4 shadow-[var(--shadow-sm)] ${className}`}
      {...rest}
    />
  );
}
