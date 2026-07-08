import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-label-md font-medium",
  {
    variants: {
      tone: {
        neutral: "bg-neutral-black-50 text-[var(--color-text-title)]",
        brand: "bg-[var(--color-brand-subtle)] text-[var(--color-brand-default)]",
        success: "bg-[var(--color-status-success-subtle)] text-green-700",
        warning: "bg-[var(--color-status-warning-subtle)] text-orange-700",
        error: "bg-[var(--color-status-error-subtle)] text-red-700",
        info: "bg-[var(--color-status-info-subtle)] text-blue-700"
      }
    },
    defaultVariants: { tone: "neutral" }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
