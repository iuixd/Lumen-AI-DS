import { type ImgHTMLAttributes } from "react";
import { cn } from "../lib/cn";

const lumenLogoSrc = new URL("../assets/lumen-logo.svg", import.meta.url).href;

export interface LumenLogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  /** Accessible label. Pass "" to mark the mark purely decorative (e.g. when adjacent text already says "Lumen"). */
  title?: string;
}

/**
 * The Lumen brand mark — sourced from the canonical Header component (Figma
 * node 1174:1354, "Header" > `Breakpoint=Desktop` 1079:1890, "Brand" >
 * "Lumen DS Logo" instance). Committed as a static asset
 * (`packages/ui/src/assets/lumen-logo.svg`) and rendered via `<img>`, not a
 * `currentColor` icon component — the mark bakes in its own gradients and
 * fixed colors, the same treatment already used for `ThemeToggle`'s sun/
 * moon assets and Checkbox's checked/indeterminate icons, since none of
 * these are meant to recolor with surrounding text/icon color.
 *
 * Replaces a placeholder — a plain crimson square with a literal "L"
 * character — that both the Storybook header mockup (`AppShell.stories.tsx`'s
 * `Brand`) and `SideNav`'s default workspace mark had been using in place
 * of this real asset, at direct user request ("replace this Lumen brand
 * logo with actual logo... reuse it in AppShell as well").
 *
 * Figma's exported asset is 21.2423×21.8788 (not square) sitting inside a
 * 28×28 box in the Header — this component renders at that natural aspect
 * ratio via `size-full` on a `size-[var(--spacing-28)]` wrapper, matching
 * the source exactly rather than stretching/cropping to a perfect square.
 */
export function LumenLogo({ className, title = "Lumen", ...props }: LumenLogoProps) {
  return (
    <img
      src={lumenLogoSrc}
      alt={title}
      className={cn("h-auto w-full", className)}
      {...props}
    />
  );
}
