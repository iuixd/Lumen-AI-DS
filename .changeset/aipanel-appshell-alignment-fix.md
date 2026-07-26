---
"@lumen/tokens": patch
"@lumen/ui": patch
---

Fixed six further `AIPanel` alignment issues reported by the user against Figma nodes 1412:3030 and 1174:1357 (the AppShell-embedded canonical instance, 1119:3351): rescaled the thumbs-up/down/copy filled icons to fill their box instead of rendering at ~60% size; gave the bot avatar its evidenced `text-body` color instead of an inherited default; corrected the response-actions row padding (px-40) and the suggested-follow-ups section padding (pl-32/pt-16); centered the response-action icon buttons vertically; replaced both bubbles' flat 240px max-width with the canonical instance's real technique (uncapped assistant bubble, 24px-gutter-based user bubble); and gave in-bubble outline/link follow-up buttons their correct, distinct text sizes and border width. Also fixed `AppShell.stories.tsx`'s `AIPanel` usage, which was passing generic placeholder buttons instead of the real `followUps` content. Additionally corrects the shared `button.secondary-on-action` token from `primary.600` to `primary.500` (user-approved, third independent Figma confirmation of this value).
