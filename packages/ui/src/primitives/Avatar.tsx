import { cn } from "../lib/cn";

export interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = { sm: "size-6 text-label-sm", md: "size-8 text-label-md", lg: "size-12 text-title-sm" };

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Falls back to initials-on-brand when no image is provided or the image fails to load. */
export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-brand-subtle)] font-medium text-[var(--color-brand-default)]",
        sizeMap[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={name} className="size-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}
