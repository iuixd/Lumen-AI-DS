import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

const toggleAssets = {
  sunLight: new URL("../assets/theme-toggle-sun-light.svg", import.meta.url).href,
  moonLight: new URL("../assets/theme-toggle-moon-light.svg", import.meta.url).href,
  sunDark: new URL("../assets/theme-toggle-sun-dark.svg", import.meta.url).href,
  moonDark: new URL("../assets/theme-toggle-moon-dark.svg", import.meta.url).href
};

export interface ThemeToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {}

/**
 * ThemeToggle
 * Sourced from the canonical AppShell desktop/tablet light and dark variants
 * (node 1007:3700). The exact 54px track and two fixed 20px icon cells use
 * the published `btn/toggle/*` roles in both modes. The native checkbox and
 * `role="switch"` preserve the established accessible-toggle behavior.
 *
 * 2026-07-27: rewritten with a transitioning knob (direct user request — "add
 * a smooth sliding effect... white knob slide between the two cells with the
 * sun/moon crossfading on it"). Not Figma-sourced (the static frames show no
 * motion/prototype spec) — pure interaction polish on top of the exact
 * anatomy synced above. Still the same 4 pre-existing icon assets as flat
 * siblings of the input (`peer-checked:` requires that flatness — it only
 * matches direct general siblings of `.peer`, not nested descendants, so a
 * single wrapping "knob" element containing both icons wasn't an option
 * without converting this from an uncontrolled native-checkbox pattern to
 * JS-driven state). `sunLight`/`moonDark` (each already bundles its own
 * white 20px circle baked into the asset) are the two that move: both
 * anchored at the left cell and translated together by `--spacing-30` (the
 * exact 2px-to-32px travel distance) on check, each crossfading opacity in
 * the opposite phase — since they move in lockstep, they read as one knob
 * whose icon crossfades mid-slide, not two independent layers. `sunDark`/
 * `moonLight` (the no-knob, muted-color variants) stay fixed in place and
 * only crossfade opacity, appearing on whichever cell the knob just
 * vacated — same end states as before, just transitioned instead of an
 * instant swap. No token exists for this duration/easing:
 * `docs/accessibility.md` §3.6 documents a required motion-token system
 * (Instant/Fast/Moderate/Slow durations, Standard/Enter/Exit easings) that
 * has never actually been built anywhere in `@lumen/tokens` — a pre-existing
 * gap, out of scope for one component's animation. Using stock Tailwind
 * `duration-200`/`ease-out` isn't a Hard Rule #1 violation either way, since
 * that rule's no-hardcoding list is color/font-size/spacing/shadow only, not
 * motion. `motion-reduce:transition-none` respects `prefers-reduced-motion`
 * per §16.
 */
export const ThemeToggle = forwardRef<HTMLInputElement, ThemeToggleProps>(
  ({ className, id, "aria-label": ariaLabel, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <label
        htmlFor={inputId}
        className={cn(
          "relative inline-flex h-[var(--spacing-24)] w-[var(--spacing-54)] shrink-0 cursor-pointer items-center overflow-hidden rounded-full bg-[var(--color-app-shell-toggle-track)]",
          "has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-4 has-[:focus-visible]:ring-[var(--color-border-focus)]",
          "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
          className
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          id={inputId}
          className="peer sr-only"
          aria-label={ariaLabel ?? "Toggle dark theme"}
          {...props}
        />
        {/* Muted, no-knob icons — fixed in place, crossfade in to reveal whichever cell the knob has just vacated. */}
        <span
          aria-hidden
          data-theme-toggle-asset="sunDark"
          className="pointer-events-none absolute left-[var(--spacing-2)] top-[var(--spacing-2)] size-[var(--spacing-20)] opacity-0 transition-opacity duration-200 ease-out motion-reduce:transition-none peer-checked:opacity-100"
        >
          <img src={toggleAssets.sunDark} alt="" className="size-full" />
        </span>
        <span
          aria-hidden
          data-theme-toggle-asset="moonLight"
          className="pointer-events-none absolute left-[var(--spacing-32)] top-[var(--spacing-2)] size-[var(--spacing-20)] opacity-100 transition-opacity duration-200 ease-out motion-reduce:transition-none peer-checked:opacity-0"
        >
          <img src={toggleAssets.moonLight} alt="" className="size-full" />
        </span>
        {/* The sliding knob: sunLight and moonDark each already bundle their own white
            20px circle, so translating and crossfading this pair together reads as one
            knob whose icon crossfades mid-slide. */}
        <span
          aria-hidden
          data-theme-toggle-asset="sunLight"
          className="pointer-events-none absolute left-[var(--spacing-2)] top-[var(--spacing-2)] size-[var(--spacing-20)] opacity-100 transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none peer-checked:translate-x-[var(--spacing-30)] peer-checked:opacity-0"
        >
          <img src={toggleAssets.sunLight} alt="" className="size-full" />
        </span>
        <span
          aria-hidden
          data-theme-toggle-asset="moonDark"
          className="pointer-events-none absolute left-[var(--spacing-2)] top-[var(--spacing-2)] size-[var(--spacing-20)] opacity-0 transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none peer-checked:translate-x-[var(--spacing-30)] peer-checked:opacity-100"
        >
          <img src={toggleAssets.moonDark} alt="" className="size-full" />
        </span>
      </label>
    );
  }
);
ThemeToggle.displayName = "ThemeToggle";
