import type { ReactNode } from "react";
import { Container, Grid, Card, Stack } from "@lumen/ui";

export interface MetricCard {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "success" | "error";
}

/** Enterprise pattern: metrics dashboard — a grid of KPI cards plus a
 * primary content area (charts, recent activity, etc). */
export function DashboardPage({ title, metrics, children }: { title: string; metrics: MetricCard[]; children?: ReactNode }) {
  return (
    <Container size="xl">
      <Stack gap={6}>
        <h1 className="text-headline-sm text-[var(--color-text-title)]">{title}</h1>
        <Grid columns={metrics.length || 1} gap={4}>
          {metrics.map((m) => (
            <Card key={m.label}>
              <p className="text-label-lg text-[var(--color-text-muted)]">{m.label}</p>
              <p className="mt-2 text-headline-md text-[var(--color-text-title)]">{m.value}</p>
              {m.delta && (
                <p
                  className={
                    "mt-1 text-label-md " +
                    (m.deltaTone === "error" ? "text-[var(--color-status-error)]" : "text-[var(--color-status-success)]")
                  }
                >
                  {m.delta}
                </p>
              )}
            </Card>
          ))}
        </Grid>
        {children}
      </Stack>
    </Container>
  );
}
