import { Button } from "../primitives/Button";

/** Maps to Figma "Next Prev Buttons" component set. */
export function Pagination({
  page,
  pageCount,
  onPageChange
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <nav className="flex items-center justify-between gap-4" aria-label="Pagination">
      <Button variant="clear" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      <span className="text-label-lg text-[var(--color-text-muted)]">
        Page {page} of {pageCount}
      </span>
      <Button variant="clear" size="sm" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </nav>
  );
}
