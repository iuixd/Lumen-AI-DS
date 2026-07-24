---
"@lumen/ui": patch
---

Fixed real drift in `Command` found during a shadcn parity audit: it was the very first component adopted in this integration and never picked up the "no lucide-react imports survive adaptation" / typography-token conventions later batches established. `Search` is now Lumen's own generated `SearchIcon`, and `CommandInput`/`CommandEmpty`/`CommandItem`/`CommandGroup`/`CommandShortcut` now use Lumen's `input-md`/`body-sm`/`label-sm` type scale instead of bare `text-sm`/`text-xs`. No props changed; `cmdk`'s underlying keyboard/filtering/selection behavior was already correct.
