import * as React from "react"
import { ChevronLeftIcon } from "../../icons/generated/ChevronLeftIcon"
import { ChevronRightIcon } from "../../icons/generated/ChevronRightIcon"
import { EllipsisIcon } from "../../icons/generated/EllipsisIcon"

import { cn } from "../../lib/cn"
import { type ButtonProps, buttonVariants } from "./button"

/**
 * Adapted from shadcn/ui's Pagination (new-york style) — internal to
 * @lumen/ui, source for the public `Pagination` export (promoted from
 * `ShadcnPagination` after Lumen's original `Pagination` primitive was
 * retired in its favor — see docs/shadcn-integration.md §7.8). Changes:
 * - imports resolve via this repo's existing relative-import convention
 * - lucide-react's `ChevronLeft`/`ChevronRight`/`MoreHorizontal` replaced
 *   with Lumen's own `ChevronLeftIcon`/`ChevronRightIcon`/`EllipsisIcon`
 * - reuses the already-adapted internal `buttonVariants` from `./button`
 */

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav role="navigation" aria-label="pagination" className={cn("mx-auto flex w-full justify-center", className)} {...props} />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({ className, isActive, size = "icon", children, ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(buttonVariants({ variant: isActive ? "outline" : "ghost", size }), className)}
    {...props}
  >
    {children}
  </a>
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to previous page" size="default" className={cn("gap-1 pl-2.5", className)} {...props}>
    <ChevronLeftIcon className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to next page" size="default" className={cn("gap-1 pr-2.5", className)} {...props}>
    <span>Next</span>
    <ChevronRightIcon className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span aria-hidden className={cn("flex h-9 w-9 items-center justify-center", className)} {...props}>
    <EllipsisIcon className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export { Pagination, PaginationContent, PaginationLink, PaginationItem, PaginationPrevious, PaginationNext, PaginationEllipsis }
