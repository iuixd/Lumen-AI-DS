---
"@lumen/tokens": minor
---

Add the `deep-purple` primitive color ramp (50-950), consumed by Badge/toaster semantic tokens. Originally added alongside `cobalt`, `japonica`, and `forest` under a claim of being sourced from a Figma Variables export; a 2026-08-02 live review of Figma's actual Variables panel found none of the four were confirmed. `japonica`/`forest` had zero consumers and were removed outright (see the `figma-token-refresh-20260802` changeset), and `deep-purple`/`cobalt` were flagged "PENDING REPLACEMENT" pending real values. A subsequent raw `Default.tokens.json` Primitives export resolved both: `deep-purple` is confirmed real (its flag removed, plus two new `900`/`950` steps this export evidenced), while `cobalt` is confirmed absent and was deleted outright at the user's instruction, with its (component-unconsumed) semantic consumers repointed to `blue`.
