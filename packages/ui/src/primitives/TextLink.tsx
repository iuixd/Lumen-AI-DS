import { forwardRef, type AnchorHTMLAttributes } from "react";
import { cn } from "../lib/cn";

/** Maps to Figma "Text Link" component set. */
export const TextLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
  ({ className, children, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        "text-[var(--color-text-link)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] rounded-sm",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
);
TextLink.displayName = "TextLink";
