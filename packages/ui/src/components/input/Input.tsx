import { forwardRef, type ComponentProps } from "react";

import { Input as InternalInput } from "../internal/input";

/**
 * Input, sourced from shadcn/ui and adapted to Lumen's token system —
 * see packages/ui/src/components/internal/input.tsx for the adaptation
 * notes. Promoted to this plain name after Lumen's original hand-built
 * `Input` primitive was retired in its favor (see
 * docs/shadcn-integration.md §7.8) — no longer `Shadcn`-prefixed since
 * there's nothing left to collide with.
 *
 * Rewritten 2026-07-31 (direct user request to match the canonical Figma
 * Input collection, node 1262:1181) — now has `size` (`sm`/`md`/`lg`,
 * default `md`) and `variant` (`primary`/`search`, default `primary`)
 * props; `size` deliberately shadows the native HTML `size` attribute
 * (number of visible characters), which is no longer reachable through
 * this component — see `internal/input.tsx` for the full token-by-token
 * mapping and why. Still no leading-icon/shortcut-badge slot — compose
 * those with `InputGroup` instead of expecting `Input` itself to render
 * them (this repo already has a dedicated composite for exactly that).
 * Use `aria-invalid` directly for the error state.
 *
 * Forwards its ref to `InternalInput` (previously a plain function
 * component that silently dropped any ref passed to it — the same latent
 * bug already found and fixed on `Button`'s public wrapper during the
 * SideNav sync; fixed here too while this file was already being
 * rewritten, since a consumer calling `inputRef.current.focus()` would
 * otherwise fail silently). This public module is the only supported
 * import path; the internal implementation may change without notice.
 */
export type InputProps = ComponentProps<typeof InternalInput>;
export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <InternalInput ref={ref} {...props} />
));
Input.displayName = "Input";
