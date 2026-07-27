---
"@lumen/ui": minor
---

Made `AppShell`'s desktop `assistant` (AIPanel) panel drag-resizable, using the existing `ResizablePanelGroup`/`ResizablePanel`/`ResizableHandle` components — a plain divider (no grip icon), both columns filling the full viewport height, and the drag-to-narrow floor pinned to `AIPanel`'s real minimum usable width (260px, measured, not guessed). `AIPanel`'s root width changed from a hardcoded 304px to fluid (`w-full`) so it can track its container. Below the desktop breakpoint (1024px), rendering falls back to the previous fixed-width, non-resizable layout — fully backward compatible, no public API change.
