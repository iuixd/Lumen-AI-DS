---
"@lumen/tokens": patch
"@lumen/ui": patch
---

Corrected `Toast`'s dark-mode colors and a 2px width transcription error, plus removed a distinct accent color from the `error` tone that Figma never bound to it (relies on the warning-triangle icon shape alone). Five new toast-scoped tokens added (`container-bg`, `body-text`, `icon-default`, `warning-accent`, `success-accent`) since the previously-reused generic tokens didn't match Toast's real dark values — some were wrong in both themes. `title-text` dark corrected to the right primitive family. Info accent and the SystemInfo/`celebration` background were re-verified byte-exact, unchanged. See `packages/tokens/src/semantic/color.json`'s `_toastComment` for the full record.
