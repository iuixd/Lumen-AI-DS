---
"@lumen/tokens": minor
"@lumen/ui": minor
---

Redesign `Toast` to align with Figma node `1475:5100` — status icon, close button, colored
left accent, and an animated 6-second countdown progress bar, replacing the previous flat
title/description card.

`tone` gains `info` (new); `warning`/`error` reuse existing exact tokens; `success`/`neutral`
keep their pre-existing, Figma-unevidenced treatment unchanged. New `icon` prop overrides the
default status icon on any tone.

Tokens: new `color.toast.{title-text,info-accent}`, `shadow.toast.default`,
`motion.duration.toast`, and a new `toast.json` component-geometry group (width, icon size,
close size, progress-bar height, accent-width). The token build now also emits the
`lumen-toast-progress` keyframes and its `prefers-reduced-motion` fallback, mirroring
`ContentState`'s `lumen-skeleton-pulse` pattern.

Auto-dismiss changed from 5000ms to 6000ms; hovering or focusing a toast pauses both the
timer and the progress bar, resuming from the remaining time rather than resetting. No
breaking changes — existing `tone` values and their visual treatment are unchanged.
