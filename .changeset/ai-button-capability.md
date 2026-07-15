---
"@lumen/ui": minor
---

Add a `capability` prop to `AIButton`, backed by a new exported `ai-capabilities` catalog (`aiCapabilities`, `AICapability`, `AICapabilityId`, `getAICapability`) — 24 actions across Figma's 4 Capability Catalog categories, each resolving a default label and icon (`<AIButton capability="summarize" />`) so callers don't have to hand-assemble both. Explicit `icon`/`children` still take precedence. Stamps `data-capability`/`data-ai-analytics-event` on the rendered button for a consuming app's own action/analytics hook-in — no analytics SDK is included. Fully additive; existing `AIButton` usage is unaffected.

Also adds a new `AI Components/AI Button Component Library` Storybook documentation page built entirely from live `AIButton` stories, and renames the `AIButton` Storybook category from `Primitives/AIButton` to `AI Components/AI Button`.
