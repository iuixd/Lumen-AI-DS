import { useEffect, useState } from "react";

// Mirrors packages/tokens/src/breakpoint.json's "desktop" threshold (1024px)
// and Tailwind's `desktop:` screen variant (packages/tokens/scripts/build.mjs).
export const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

/**
 * Tracks whether the viewport is at or above the desktop breakpoint.
 * Extracted from AppShell.tsx (originally added for the resizable assistant
 * panel) so other components — SideNav — needing the same real desktop/
 * tablet distinction don't duplicate the matchMedia wiring.
 */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(DESKTOP_MEDIA_QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const handleChange = () => setIsDesktop(mql.matches);
    handleChange();
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return isDesktop;
}
