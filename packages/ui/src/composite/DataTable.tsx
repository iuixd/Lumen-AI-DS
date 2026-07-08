import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
}

/** Maps to Figma "Table Row" component set. The row-hover/click affordance,
 * header styling, and zebra-free dense layout here are the enterprise default —
 * do not hand-roll a new <table> per screen. */
export function DataTable<T>({ columns, data, rowKey, onRowClick, emptyState }: DataTableProps<T>) {
  if (data.length === 0 && emptyState) return <>{emptyState}</>;

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--color-border-default)]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-background-subtle)]">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className="px-4 py-3 text-title-sm font-medium text-[var(--color-text-muted)]"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={cn(
                "border-b border-[var(--color-border-default)] last:border-0",
                onRowClick && "cursor-pointer hover:bg-[var(--color-background-subtle)]"
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-body-md text-[var(--color-text-body)]">
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
