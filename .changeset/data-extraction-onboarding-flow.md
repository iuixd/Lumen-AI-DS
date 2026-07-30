---
"@lumen/tokens": minor
"@lumen/ui": minor
"@lumen/patterns": minor
---

Add the full data-extraction onboarding flow: login → file upload (click-to-browse, drag-and-drop
onto the card, or drop anywhere on the page) → grouped per-file upload progress → Create Project,
each step animating into the next.

New `@lumen/ui` composites: `FileUploadDropzone` (idle-state upload card) and
`FileUploadProgressList` (accordion-grouped, per-file progress, reusing the existing `Accordion`).
`Toast` gained a `variant: "solid"` option (Figma-evidenced — a filled, tone-colored card instead
of the default light card with a left-border accent) and a `celebration` tone, used by this flow's
"Files uploaded!" confirmation.

New `@lumen/patterns` pattern: `DataExtractionOnboardingPage`, composing `EnterpriseLoginPage`
with the two new composites into one functional, click-through journey. `EnterpriseLoginPage`
itself was reconciled against a newly-found real Figma source for its login screen (previously
provisional, sourced only from a Claude Design prototype): headline/heading fonts corrected to
Source Serif Pro throughout, the email-submit button's colors corrected from a crimson outline to
neutral input-border colors, the passkey button's icon corrected from a fingerprint to a key, and
the Google/Okta SSO buttons now use their real brand-mark glyphs — plus a new `onComplete`
callback fired when its internal state machine reaches "Signed in".

New tokens: `radius.xxxl` (18px, the upload card's corner) and a new `gradient.json` file
(`gradient.upload-header`, the crimson-to-coral header banner), both Figma-sourced. See
`docs/changelog.md` for the full node references, the token/asset provenance, and what was
deliberately simplified (no page-level drag mask inside the reusable dropzone card itself;
`Accordion`'s pre-existing instant expand/collapse left as-is).
