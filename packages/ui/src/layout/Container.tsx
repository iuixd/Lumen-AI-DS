import type { ReactNode } from "react";
import { cn } from "../lib/cn";

/** Maps to Figma "Container" component set — the page-level content wrapper
 * (max-width + horizontal padding) used across every product surface. */
export function Container({
  children,
  className,
  size = "lg"
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}) {
  const maxWidth = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    full: "max-w-none"
  }[size];
  return <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", maxWidth, className)}>{children}</div>;
}
