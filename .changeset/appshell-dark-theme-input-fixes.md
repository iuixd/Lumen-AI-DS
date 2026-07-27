---
"@lumen/tokens": patch
"@lumen/ui": patch
---

Fixed the AppShell Header's search input and AIPanel's prompt input to actually use their already-correct color tokens (both previously rendered with the shared `Input` component's generic transparent/gray defaults instead), added the missing search icon and "⌘K" shortcut badge to the search input, and removed `AppShell`'s local re-scoping of `--color-input-*` tokens to app-shell shadow-copies (the same anti-pattern already removed for `--color-button-*`, which was silently neutralizing any Input color fix). Also corrected 6 dark-theme color drifts found via a fresh Figma audit: input border/icon colors, the "Assistant" heading icon's background and color, the assistant chat bubble's background (now a translucent overlay, not a solid fill, matching Figma's actual technique), and the app-shell link color.
