import type { Meta, StoryObj } from "@storybook/react";
import { DashboardPage, type MetricCard } from "./DashboardPage";
import { Card, CardContent, Button, Badge, DataTable, PlusIcon, type Column } from "@lumen/ui";

const metrics: MetricCard[] = [
  { label: "Monthly recurring revenue", value: "$48,200", delta: "+4.2%", deltaTone: "success" },
  { label: "Active users", value: "2,318", delta: "+1.1%", deltaTone: "success" },
  { label: "Churn rate", value: "1.8%", delta: "+0.3%", deltaTone: "error" }
];

const meta = {
  title: "Patterns/DashboardPage",
  component: DashboardPage,
  parameters: { layout: "fullscreen", controls: { disable: true } },
  args: {
    title: "Overview",
    metrics,
    children: (
      <Card>
        <CardContent>
          <p className="text-body-md text-[var(--color-text-body)]">Charts / recent activity content goes here.</p>
        </CardContent>
      </Card>
    )
  }
} satisfies Meta<typeof DashboardPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

interface Account {
  name: string;
  value: string;
  daysLeft: string;
  status: "Draft ready" | "Pending" | "On track";
}

const accounts: Account[] = [
  { name: "Meridian Health", value: "$380K", daysLeft: "15 days", status: "Draft ready" },
  { name: "Kestrel Logistics", value: "$215K", daysLeft: "28 days", status: "Pending" },
  { name: "Aurora Fintech", value: "$490K", daysLeft: "44 days", status: "On track" }
];

const statusTone: Record<Account["status"], "success" | "warning"> = {
  "Draft ready": "success",
  Pending: "warning",
  "On track": "success"
};

const columns: Column<Account>[] = [
  { key: "name", header: "Account", render: (r) => r.name },
  { key: "value", header: "Value", render: (r) => r.value },
  { key: "daysLeft", header: "Time left", render: (r) => r.daysLeft },
  { key: "status", header: "Status", render: (r) => <Badge tone={statusTone[r.status]}>{r.status}</Badge> }
];

/** Reproduces the Figma "appshell-desktop-closed-light" reference screen's dashboard body (Lumen-AI-Design-System, node 1197:1652) end to end: breadcrumbs, title + actions, description, KPI row, and the accounts table — composed entirely from existing `@lumen/ui` components (`PageHeader`, `KPICard`, `DataTable`, `Badge`), no new component needed for the table itself. */
export const RenewalPipeline: Story = {
  args: {
    title: "Renewal pipeline",
    breadcrumbs: [{ label: "Workspace", href: "#" }, { label: "Projects", href: "#" }, { label: "Renewal pipeline" }],
    description: "Track all risk accounts and let the assistant draft outreach before contracts lapse.",
    actions: (
      <>
        <Button variant="secondary">Share</Button>
        <Button variant="secondary">Export</Button>
        <Button>
          <PlusIcon className="size-4" aria-hidden />
          New project
        </Button>
      </>
    ),
    metrics: [
      { label: "Open renewals", value: "47", delta: "▲ 12% this quarter", deltaTone: "success" },
      { label: "At risk", value: "9", delta: "▲ 3 flagged", deltaTone: "warning" },
      { label: "Forecast ARR", value: "$4.2M", delta: "83% confidence", deltaTone: "success" }
    ],
    children: (
      <div>
        <h2 className="mb-3 text-title-sm text-[var(--color-text-body)]">Accounts closing this quarter</h2>
        <DataTable columns={columns} data={accounts} rowKey={(r) => r.name} />
      </div>
    )
  }
};
