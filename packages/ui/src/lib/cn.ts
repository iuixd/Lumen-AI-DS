import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { typography } from "@lumen/tokens";

// tailwind-merge's default `font-size` class group only recognizes Tailwind's own
// keyword/arbitrary-length values — a named custom scale key like `text-button-lg`
// doesn't match it, so it falls through to the (very permissive) `text-color` group
// instead. Since our custom color utilities (`text-neutral-white`, etc.) *also* land
// in `text-color`, an element with both a size class (`text-button-lg`) and a color
// class (`text-neutral-white`) would have one silently dropped as a "conflict" —
// which is exactly what caused Button's white label text to disappear. Registering
// our type scale's keys under `font-size` (generated from the token source, so it
// can't drift out of sync) fixes the misclassification instead of just working
// around one instance of it.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: Object.keys(typography.scale) }]
    }
  }
});

/** Merge conditional class names AND resolve conflicting Tailwind utilities
 * (e.g. a later `p-0` correctly wins over an earlier `px-[12px] py-[6px]`).
 * Plain clsx only concatenates — with cva's compoundVariants and any
 * consumer-provided `className` override, two classes touching the same CSS
 * property routinely end up in the same class list, and which one "wins" is
 * then down to Tailwind's arbitrary generated stylesheet order, not the
 * order they appear here. Kept as a single utility so every component
 * composes classes the same way — do not reach for a different helper. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
