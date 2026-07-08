import { clsx, type ClassValue } from "clsx";

/** Merge conditional class names. Kept as a single utility so every component
 * composes classes the same way — do not reach for a different helper. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
