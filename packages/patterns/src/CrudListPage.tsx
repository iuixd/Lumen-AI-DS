import { useState } from "react";
import {
  Container,
  Stack,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  DataTable,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  EmptyState,
  Badge,
  type Column
} from "@lumen/ui";

/**
 * Enterprise pattern: CRUD list page.
 * Search + filter header, data table, pagination, empty state, primary action.
 * This is the reference shape for every "list of records" screen (users,
 * invoices, projects, tickets, ...) — compose it from @lumen/ui, don't
 * reinvent table/pagination/empty-state markup per feature.
 */
export interface CrudListPageProps<T> {
  title: string;
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onCreate?: () => void;
  createLabel?: string;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onSearch?: (query: string) => void;
}

export function CrudListPage<T>({
  title,
  columns,
  data,
  rowKey,
  onCreate,
  createLabel = "New",
  page,
  pageCount,
  onPageChange,
  onSearch
}: CrudListPageProps<T>) {
  const [query, setQuery] = useState("");

  return (
    <Container size="xl">
      <Stack gap={24}>
        <Stack direction="row" justify="between" align="center">
          <Stack direction="row" gap={8} align="center">
            <h1 className="text-headline-sm text-[var(--color-text-title)]">{title}</h1>
            <Badge tone="neutral">{data.length}</Badge>
          </Stack>
          {onCreate && <Button onClick={onCreate}>{createLabel}</Button>}
        </Stack>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
            />
          </CardContent>
        </Card>

        <DataTable
          columns={columns}
          data={data}
          rowKey={rowKey}
          emptyState={
            <EmptyState
              title="No records yet"
              description="Records will show up here once they're created."
              action={onCreate && <Button onClick={onCreate}>{createLabel}</Button>}
            />
          }
        />

        {data.length > 0 && (
          <Pagination>
            <PaginationContent className="w-full justify-between">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={page <= 1}
                  tabIndex={page <= 1 ? -1 : undefined}
                  className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) onPageChange(page - 1);
                  }}
                />
              </PaginationItem>
              <li className="text-label-lg text-[var(--color-text-muted)]">
                Page {page} of {pageCount}
              </li>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={page >= pageCount}
                  tabIndex={page >= pageCount ? -1 : undefined}
                  className={page >= pageCount ? "pointer-events-none opacity-50" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < pageCount) onPageChange(page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </Stack>
    </Container>
  );
}
