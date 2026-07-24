import type { ComponentProps } from "react";

import {
  Pagination as InternalPagination,
  PaginationContent as InternalPaginationContent,
  PaginationEllipsis as InternalPaginationEllipsis,
  PaginationItem as InternalPaginationItem,
  PaginationLink as InternalPaginationLink,
  PaginationNext as InternalPaginationNext,
  PaginationPrevious as InternalPaginationPrevious
} from "../internal/pagination";

/**
 * Pagination, sourced from shadcn/ui and adapted to Lumen's token system
 * — see packages/ui/src/components/internal/pagination.tsx for the
 * adaptation notes. Promoted to this plain name after Lumen's original
 * hand-built `Pagination` (a single declarative
 * `page`/`pageCount`/`onPageChange` component) was retired in its favor
 * (see docs/shadcn-integration.md §7.8) — no longer `Shadcn`-prefixed
 * since there's nothing left to collide with. This is a different shape
 * entirely: a set of composable parts (`PaginationContent`/
 * `PaginationItem`/`PaginationPrevious`/`PaginationNext`/
 * `PaginationLink`/`PaginationEllipsis`), not a single wrapper —
 * consumers compose their own Previous/Next or page-number markup (see
 * `packages/patterns/src/CrudListPage.tsx` for a Previous/Next-only
 * example, including the `aria-disabled` + click-guard pattern needed at
 * the boundary since `PaginationPrevious`/`PaginationNext` render `<a>`
 * anchors, which have no native `disabled` attribute). This public
 * module is the only supported import path; the internal implementation
 * may change without notice.
 */
export type PaginationProps = ComponentProps<typeof InternalPagination>;
export function Pagination(props: PaginationProps) {
  return <InternalPagination {...props} />;
}

export const PaginationContent = InternalPaginationContent;
export const PaginationItem = InternalPaginationItem;
export const PaginationLink = InternalPaginationLink;
export const PaginationPrevious = InternalPaginationPrevious;
export const PaginationNext = InternalPaginationNext;
export const PaginationEllipsis = InternalPaginationEllipsis;
