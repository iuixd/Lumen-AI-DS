---
"@lumen/tokens": minor
---

Add `cobalt` and `deep-purple` primitive color ramps (50-800), still consumed by Badge/toaster semantic tokens. Originally added alongside `japonica` and `forest` under a claim of being sourced from a Figma Variables export; a 2026-08-02 live review of Figma's actual Variables panel found none of the four are real Figma collections. `japonica` and `forest` had zero consumers and were removed outright (see the `figma-token-refresh-20260802` changeset). `cobalt`/`deep-purple` are kept because Badge/toaster tokens still alias them, but are marked "PENDING REPLACEMENT" pending real Figma-backed values — treat their current hex values as unverified legacy, not Figma-sourced.
