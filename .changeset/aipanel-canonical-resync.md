---
"@lumen/tokens": minor
"@lumen/ui": minor
---

Resynced `AIPanel` to the canonical Figma AIPanel component (node 1079:3141) after a live Figma update, superseding part of the previous sync against a separate documentation frame. Bubble corners now use a new `radius.chat-bubble` (18px) token with a fully-square "sharp" corner; the assistant bubble gained a bot-avatar icon; `AIPanelFollowUp` gained a `variant?: "outline" | "link"` field and now renders full-width/stacked inside the bubble (no more separate labeled section); the send button is now a one-off black/34px/`radius.lg` treatment matching Figma, using the exact `ArrowUpwardFilledIcon`. Also synced Button's shared `link` variant to real evidenced color (`primary.500`) for the first time, fixing it everywhere `Button variant="link"` is used. No breaking changes — all new fields are optional and additive.
