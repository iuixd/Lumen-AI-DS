import { useState, type ReactNode } from "react";
import { cn } from "../lib/cn";

/** Minimal, dependency-free tooltip. Swap the implementation for Radix/Floating UI
 * if the app needs collision-aware positioning — keep the same public API. */
export function Tooltip({ label, children, side = "top" }: { label: string; children: ReactNode; side?: "top" | "bottom" }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className={cn(
            "absolute z-10 whitespace-nowrap rounded-md bg-neutral-black-700 px-2 py-1 text-label-md text-white shadow-2",
            side === "top" ? "bottom-full left-1/2 mb-1 -translate-x-1/2" : "top-full left-1/2 mt-1 -translate-x-1/2"
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}
