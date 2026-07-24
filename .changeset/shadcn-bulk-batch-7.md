---
"@lumen/ui": minor
---

Add shadcn-sourced `Menubar`, `ResizablePanelGroup`/`ResizablePanel`/`ResizableHandle`, and `InputGroup` — batch 7 of the bulk shadcn adoption effort (see `docs/shadcn-integration.md` §7.9). Adds `@radix-ui/react-menubar` and `react-resizable-panels` as new runtime dependencies. Caught and fixed two real upstream bugs in `react-resizable-panels@4.12.2` (renamed `PanelGroup`/`Panel`/`PanelResizeHandle` exports and pixel-vs-percent size semantics, both translated at the wrapper boundary so the public API still matches what shadcn documents) and one real `cn()`-merge-order bug in `InputGroupButton`'s type scale. `Empty` and `Field` were requested but skipped as full functional duplicates of Lumen's existing `EmptyState`/`FormField` composites.
