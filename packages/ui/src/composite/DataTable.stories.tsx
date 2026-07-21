import type { Meta, StoryObj } from "@storybook/react";
import { DataTable, type Column } from "./DataTable";
import { EmptyState } from "./EmptyState";
import { Badge } from "../primitives/Badge";

interface Invoice {
  id: string;
  customer: string;
  amount: string;
  status: "paid" | "overdue" | "draft";
}

const rows: Invoice[] = [
  { id: "INV-1001", customer: "Acme Corp", amount: "$4,200.00", status: "paid" },
  { id: "INV-1002", customer: "Globex Inc", amount: "$1,050.00", status: "overdue" },
  { id: "INV-1003", customer: "Initech", amount: "$820.00", status: "draft" }
];

const badgeStatusByInvoice = { paid: "success", overdue: "error", draft: "gray" } as const;

const columns: Column<Invoice>[] = [
  { key: "id", header: "Invoice", render: (row) => row.id },
  { key: "customer", header: "Customer", render: (row) => row.customer },
  { key: "amount", header: "Amount", render: (row) => row.amount },
  {
    key: "status",
    header: "Status",
    render: (row) => <Badge status={badgeStatusByInvoice[row.status]}>{row.status}</Badge>
  }
];

const meta = {
  title: "Composite/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Maps to Figma "Table Row". The row-hover/click affordance, header styling, and dense layout here are the enterprise default — don\'t hand-roll a new <table> per screen.'
      }
    },
    controls: { disable: true }
  },
  args: { columns, data: rows, rowKey: (row) => row.id }
} satisfies Meta<typeof DataTable<Invoice>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const RowClickable: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={rows}
      rowKey={(row) => row.id}
      onRowClick={(row) => alert(`Open ${row.id}`)}
    />
  )
};

export const Empty: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={[]}
      rowKey={(row) => row.id}
      emptyState={
        <EmptyState
          title="No invoices yet"
          description="Invoices will show up here once they're created."
        />
      }
    />
  )
};
