---
"@lumen/ui": minor
---

Dropped the `Shadcn` prefix from six of the seven `ShadcnForm` family symbols: `Form`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, and `useFormField` are now plain names. `ShadcnFormField` keeps its prefix, since it's the one symbol that genuinely collides with Lumen's existing hand-built `FormField` composite (still used by `AuthForm.tsx` and not being retired — the two serve different needs). See `docs/shadcn-integration.md` §7.8 for the full rationale.
