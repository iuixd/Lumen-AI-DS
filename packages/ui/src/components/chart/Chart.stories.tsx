import type { Meta, StoryObj } from "@storybook/react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, XAxis, YAxis } from "recharts";
import { Chart, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, chartCategoricalColors } from "./Chart";
import type { ChartConfig } from "./Chart";

// No `component:` binding: Chart's props require a concrete `config` and
// Recharts `children` that no placeholder `args` object can satisfy (same
// reasoning as Form's Meta — see ../form/Form.stories.tsx). Every story
// below drives its own render fully instead.
const meta = {
  title: "Composite/Chart",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "shadcn/ui's Chart (built on `recharts@2.15.4`), sourced and adapted to Lumen's token system, composed here with the dataviz skill's validated categorical palette (`chartCategoricalColors`) — see docs/shadcn-integration.md §7.7 for the six-check validation run. Filed under Composite: it combines a Recharts plot with a floating tooltip panel and legend into one interaction unit, the closest named analog being `docs/component-architecture.md` §2.4's unbuilt \"Data Visualization Container\" (no Enterprise Storybook category exists yet, so this follows §2.2/§2.3's Composite fallback definition instead). Dark mode follows the global `data-theme` toolbar toggle, not a separate story — the palette's `theme.light`/`theme.dark` values swap automatically through the same attribute."
      }
    }
  }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const monthlyData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 273, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 }
];

const twoSeriesConfig: ChartConfig = {
  desktop: { label: "Desktop", theme: chartCategoricalColors[0] },
  mobile: { label: "Mobile", theme: chartCategoricalColors[1] }
};

export const Default: Story = {
  render: () => (
    <Chart config={twoSeriesConfig} className="h-[300px] w-full">
      <LineChart data={monthlyData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line dataKey="desktop" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
        <Line dataKey="mobile" stroke="var(--color-mobile)" strokeWidth={2} dot={false} />
      </LineChart>
    </Chart>
  )
};

const revenueByChannel = [
  { channel: "Direct", revenue: 4200 },
  { channel: "Organic", revenue: 3100 },
  { channel: "Paid", revenue: 2400 },
  { channel: "Referral", revenue: 1800 },
  { channel: "Social", revenue: 1200 },
  { channel: "Email", revenue: 900 }
];

const sixSeriesConfig: ChartConfig = {
  Direct: { label: "Direct", theme: chartCategoricalColors[0] },
  Organic: { label: "Organic", theme: chartCategoricalColors[1] },
  Paid: { label: "Paid", theme: chartCategoricalColors[2] },
  Referral: { label: "Referral", theme: chartCategoricalColors[3] },
  Social: { label: "Social", theme: chartCategoricalColors[4] },
  Email: { label: "Email", theme: chartCategoricalColors[5] }
};

/**
 * Demonstrates all 6 validated categorical steps at once. The 6th (Email,
 * `chartCategoricalColors[5]`) carries a contrast WARN against the dark
 * chart surface per the dataviz skill's own validator — WARN obligates a
 * visible label rather than color-alone identification, so its bar always
 * carries a direct value label via Recharts' `LabelList`, not just the
 * legend swatch.
 */
export const CategoricalPalette: Story = {
  render: () => (
    <Chart config={sixSeriesConfig} className="h-[300px] w-full">
      <BarChart data={revenueByChannel} layout="vertical" margin={{ left: 16 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" hide />
        <YAxis dataKey="channel" type="category" tickLine={false} axisLine={false} width={70} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="revenue" radius={4}>
          {revenueByChannel.map((entry) => (
            <Cell key={entry.channel} fill={`var(--color-${entry.channel})`} />
          ))}
          <LabelList dataKey="revenue" position="right" className="fill-foreground" fontSize={12} />
        </Bar>
      </BarChart>
    </Chart>
  )
};

export const TableView: Story = {
  name: "Table view (accessible alternative)",
  parameters: {
    docs: {
      description: {
        story:
          "The dataviz skill requires a table-view alternative to exist alongside any chart. This is the same `monthlyData` series rendered as a real `<table>` — the pattern a production usage of `Chart` should offer via a toggle, not a component `Chart` builds in for you."
      }
    }
  },
  render: () => (
    <table>
      <caption>Monthly desktop vs. mobile sessions</caption>
      <thead>
        <tr>
          <th>Month</th>
          <th>Desktop</th>
          <th>Mobile</th>
        </tr>
      </thead>
      <tbody>
        {monthlyData.map((row) => (
          <tr key={row.month}>
            <td>{row.month}</td>
            <td>{row.desktop}</td>
            <td>{row.mobile}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
};
