---
"@lumen/ui": minor
---

Add `tone` and `icon` props to `ChoiceChip`, reproducing the Figma "AI ButtonGroup Component Library" Toggle Group pattern (node 969:5151) by reusing the existing component rather than adding a new one. Add a `SplitButton` "AI" Storybook composition resolving the previously-deferred "Split Button AI" gap — no new component or variant, reuses existing `variant="primary"` tokens and the `ai-capabilities` catalog.
