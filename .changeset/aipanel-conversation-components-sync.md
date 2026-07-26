---
"@lumen/tokens": minor
"@lumen/ui": minor
---

Reconciled `AIPanel`'s conversation-bubble anatomy against the "AI Conversation Components" Figma frame (node 1412:3030): corrected the user bubble's sharp-corner position and background, gave the assistant bubble its own background/text-color role and removed its border, and unified bubble padding/typography. Extended `AIPanelMessage` with three new optional, additive fields modeled on that same frame: `timestamp` (a conversation date/time divider), `responseActions` (thumbs up/down, copy, a branch label, an edited flag), and `followUps` (a "Suggested follow-ups" row of pill-shaped secondary buttons). Adds a new `chat.input-bg` primitive, a new `app-shell.chat-response-bg` semantic role, and three new typography tiers (`chat-message`, `chat-caption`, `chat-label`). No breaking changes — existing `AIPanel` consumers pick up the corrected visuals automatically.
