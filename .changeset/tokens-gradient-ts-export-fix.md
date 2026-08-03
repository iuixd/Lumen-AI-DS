---
"@lumen/tokens": patch
---

Fix `gradient.json` tokens (e.g. `gradient.upload-header`) missing from `dist/index.ts`'s
typed JS/TS export block — they were already emitted correctly to CSS (`--gradient-*`
variables), but `packages/tokens/scripts/build.mjs` never added the corresponding
`export const gradient = ...` alongside every other token category. Found during a
documentation-accuracy audit while verifying `packages/tokens/README.md`'s claim of
"typed JS/TS exports of every token" against the real generated output.
