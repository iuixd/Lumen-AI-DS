---
"@lumen/ui": minor
---

Add shadcn-sourced `Calendar` and `Chart` — batch 6, the final batch of the bulk shadcn adoption effort (see `docs/shadcn-integration.md` §7.7). Adds `react-day-picker`, `date-fns`, and `recharts@2.15.4` as new runtime dependencies — this repo's first date-handling and charting libraries. `Chart` ships with `chartCategoricalColors`, a 6-step categorical palette validated against the `dataviz` skill's colorblind-safety and contrast checks for both light and dark chart surfaces, meant to be assigned to `ChartConfig` entries via the `theme` field in fixed index order. Both components follow the established internal/public split and resolve through the existing token bridge; neither collides with an existing Lumen export, so both keep their own plain shadcn names.
