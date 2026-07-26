---
"@lumen/ui": patch
---

Fixed `AIPanel`'s icon-only send button, which was hardcoded to a solid black background — Figma's canonical instance (node 1119:3351) shows it as a `secondary`-variant icon button. Switched to `variant="secondary"` with local size/radius/border overrides. Also corrected the in-bubble `outline` follow-up pill's height (34px, was incorrectly shared with the `link` pill's 30px). Both fixes apply automatically wherever `AIPanel` is used, including the `AppShell` Storybook story.
