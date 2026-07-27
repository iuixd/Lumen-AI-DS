---
"@lumen/ui": patch
---

Rewrote `ThemeToggle` with a transitioning knob — the white knob now smoothly slides between the two cells with the sun/moon icon crossfading on it, instead of instantly jumping. Same public API and DOM query surface; only the transition behavior changed. Respects `prefers-reduced-motion`.
