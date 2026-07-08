import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Grid } from "./Grid";

const cell = (label: string) => (
  <div key={label} className="rounded-md bg-[var(--color-brand-subtle)] px-4 py-6 text-center text-label-md text-[var(--color-brand-default)]">
    {label}
  </div>
);

const meta = {
  title: "Layout/Grid",
  component: Grid,
  tags: ["autodocs"],
  argTypes: {
    columns: { control: { type: "number", min: 1, max: 12 } },
    gap: { control: "select", options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20] }
  },
  args: { columns: 3, gap: 4, children: null },
  render: (args: ComponentProps<typeof Grid>) => (
    <Grid {...args}>
      {[1, 2, 3, 4, 5, 6].map((n) => cell(`Cell ${n}`))}
    </Grid>
  )
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
