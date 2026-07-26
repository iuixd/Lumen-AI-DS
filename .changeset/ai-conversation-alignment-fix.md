---
"@lumen/tokens": patch
"@lumen/ui": patch
---

Fixed 3 real Figma alignment issues in `AIPanel`'s optional response-actions anatomy (node 1412:3030), reported directly by the user: the bot avatar now uses `LmBotStaticIcon` (confirmed identical to Figma's own asset) instead of a generic icon; the thumbs up/down/copy icons are new dedicated filled icons (`thumbs-up-filled`, `thumbs-down-filled`, `copy-filled`) matching Figma's actual filled style instead of generic stroke-outline icons; and a new `AIPanelMessage.suggestedFollowUps` field reintroduces the labeled "Suggested follow-ups" section (uniform secondary-variant buttons, correct 40px section spacing) that a previous resync had dropped, distinct from the in-bubble `followUps` anatomy. Also flags (not fixed) a recurring discrepancy in the shared `button.secondary-on-action` token worth a deliberate follow-up decision.
