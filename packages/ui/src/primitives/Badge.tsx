import { cva } from "class-variance-authority";
import { cn } from "../lib/cn";

export const badgeStatuses = [
  "default",
  "gray",
  "success",
  "warning",
  "error",
  "deep-purple",
  "purple",
  "light-blue",
  "yellow",
  "pink"
] as const;

export type BadgeStatus = (typeof badgeStatuses)[number];
export type BadgeSize = "sm" | "md" | "lg";
export type BadgeTone = "neutral" | "brand" | "success" | "warning" | "error" | "info";
type BadgeStyleStatus = BadgeStatus | "brand" | "info";

const legacyToneStatus: Record<BadgeTone, BadgeStyleStatus> = {
  neutral: "gray",
  brand: "brand",
  success: "success",
  warning: "warning",
  error: "error",
  info: "info"
};

const badgeStyles = cva(
  "inline-flex items-center gap-[var(--spacing-6)] overflow-hidden whitespace-nowrap rounded-[var(--radius-pill)] font-interface",
  {
    variants: {
      status: {
        default: "bg-[var(--color-badge-default-bg)] text-[var(--color-badge-default-text)]",
        gray: "bg-[var(--color-badge-gray-bg)] text-[var(--color-badge-gray-text)]",
        success: "bg-[var(--color-badge-success-bg)] text-[var(--color-badge-success-text)]",
        warning: "bg-[var(--color-badge-warning-bg)] text-[var(--color-badge-warning-text)]",
        error: "bg-[var(--color-badge-error-bg)] text-[var(--color-badge-error-text)]",
        "deep-purple":
          "bg-[var(--color-badge-deep-purple-bg)] text-[var(--color-badge-deep-purple-text)]",
        purple: "bg-[var(--color-badge-purple-bg)] text-[var(--color-badge-purple-text)]",
        "light-blue":
          "bg-[var(--color-badge-light-blue-bg)] text-[var(--color-badge-light-blue-text)]",
        yellow: "bg-[var(--color-badge-yellow-bg)] text-[var(--color-badge-yellow-text)]",
        pink: "bg-[var(--color-badge-pink-bg)] text-[var(--color-badge-pink-text)]",
        brand: "bg-[var(--color-brand-subtle)] text-[var(--color-brand-default)]",
        info: "bg-[var(--color-status-info-subtle)] text-blue-700"
      },
      size: {
        sm: "px-[var(--spacing-8)] py-[var(--spacing-2)] text-badge-sm",
        md: "px-[var(--spacing-10)] py-[var(--spacing-4)] text-badge-md",
        lg: "px-[var(--spacing-12)] py-[var(--spacing-6)] text-badge-lg"
      }
    },
    defaultVariants: { status: "default", size: "sm" }
  }
);

export interface BadgeVariantOptions {
  status?: BadgeStatus | null;
  /** @deprecated Use `status`. Retained as a compatibility alias. */
  tone?: BadgeTone | null;
  size?: BadgeSize | null;
}

export function badgeVariants({ status, tone, size = "sm" }: BadgeVariantOptions = {}): string {
  const resolvedStatus: BadgeStyleStatus = status ?? (tone ? legacyToneStatus[tone] : "default");
  return badgeStyles({ status: resolvedStatus, size });
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, BadgeVariantOptions {
  showDot?: boolean;
}

export function Badge({
  className,
  status,
  tone,
  size = "sm",
  showDot = true,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ status, tone, size }), className)} {...props}>
      {showDot && (
        <span
          aria-hidden="true"
          data-badge-dot=""
          className={cn(
            "shrink-0 rounded-full bg-current",
            size === "sm" && "size-[var(--spacing-6)]",
            size === "md" && "size-[var(--spacing-7)]",
            size === "lg" && "size-[var(--spacing-8)]"
          )}
        />
      )}
      {children}
    </span>
  );
}
