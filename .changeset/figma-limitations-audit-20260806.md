---
"@lumen/tokens": minor
"@lumen/ui": patch
"@lumen/patterns": patch
---

Added a full generic Elevation scale (`elevation.1`-`elevation.5`) sourced from a live Figma "Scale / Elevation (Live)" frame — this repo's first real evidence beyond the existing component-scoped shadows. Fixed a real heading font-family bug: `PageHeader`, `CrudListPage`, and `SettingsPage` were rendering heading-scale text in Instrument Sans instead of the Figma-specified Source Serif Pro (`font-editorial`), unlike 4 other heading consumers that already had it right.
