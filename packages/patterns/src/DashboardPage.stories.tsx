import type { Meta, StoryObj } from "@storybook/react";
import { DashboardPage, type MetricCard } from "./DashboardPage";
import { Card } from "@lumen/ui";

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
        <p className="text-body-md text-[var(--color-text-body)]">Charts / recent activity content goes here.</p>
      </Card>
    )
  }
} satisfies Meta<typeof DashboardPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
