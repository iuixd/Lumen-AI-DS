---
"@lumen/tokens": patch
"@lumen/ui": patch
---

Reverted `Toast`'s `error` tone back to its distinct red accent (`status.error`) after direct user review — a colorless error toast (matching a literal Figma finding of "no bound accent") reads as informational, not a failure, so this deliberately overrides that finding for usability. Added a new `toast.neutral-accent` token (`neutral.300`, exact) for a genuine `Type=Neutral` Figma instance that didn't exist during the earlier dark-mode audit, replacing the generic `border.default` placeholder `neutral` had been using. Also fixed real bugs in the Storybook demo content: `warning`/`error` triggers were both firing `info`'s copy, `success`/`neutral` used generic placeholder text instead of Figma's own example content, and `AllTones` only pushed 3 of its own claimed "all five" tones.
