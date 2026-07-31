import { forwardRef, type ComponentProps, type ElementRef } from "react";

import { Checkbox as InternalCheckbox } from "../internal/checkbox";

/**
 * Checkbox, sourced from shadcn/ui (Radix Checkbox) and adapted to Lumen's
 * token system — see packages/ui/src/components/internal/checkbox.tsx for
 * the adaptation notes. Promoted to this plain name after Lumen's own
 * hand-built `Checkbox` primitive was retired in favor of this shadcn-sourced
 * implementation (see docs/shadcn-integration.md §7.8) — no longer
 * `Shadcn`-prefixed since there's nothing left to collide with.
 *
 * Rewritten 2026-07-31 (direct user request to match the canonical Figma
 * Checkbox collection, node `1278:2207`) — now has a `size` prop (`sm`/`md`/
 * `lg`, default `md`); see `internal/checkbox.tsx` for the full state/token
 * mapping. Forwards its ref to `InternalCheckbox` (previously a plain
 * function component that silently dropped any ref passed to it — the same
 * latent bug already found and fixed on `Button`'s and `Input`'s public
 * wrappers). This public module is the only supported import path; the
 * internal implementation may change without notice.
 */
export type CheckboxProps = ComponentProps<typeof InternalCheckbox>;
export const Checkbox = forwardRef<ElementRef<typeof InternalCheckbox>, CheckboxProps>(
  (props, ref) => <InternalCheckbox ref={ref} {...props} />
);
Checkbox.displayName = "Checkbox";
