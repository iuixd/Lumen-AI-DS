---
"@lumen/tokens": minor
"@lumen/ui": minor
---

Add `CodeBlock` (a real Prism-powered syntax-highlighted code display) and `AIResponseCard`
(a structured AI-response composite: title, summary, table, code, expandable additional
sections, and follow-up actions), sourced from Figma node `1484:2905`.

`AIResponseCard` is the first real implementation of what `docs/component-architecture.md` §8
had only described aspirationally as `AIResponse`. `CodeBlock` is a new reusable primitive
built on `prism-react-renderer` (new dependency), usable anywhere in the design system, not
just inside `AIResponseCard`.

New tokens: `code.{bg,syntax-keyword,syntax-string}` primitives and generic
`color.text.{primary,heading}` semantic roles. No breaking changes — both components are
additive.
