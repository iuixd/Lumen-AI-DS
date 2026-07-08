import type { Meta, StoryObj } from "@storybook/react";
import { Stack, type StackProps } from "./Stack";

const swatch = (label: string) => (
  <div key={label} className="rounded-md bg-[var(--color-brand-subtle)] px-4 py-3 text-center text-label-md text-[var(--color-brand-default)]">
    {label}
  </div>
);

const meta = {
  title: "Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Flex-based layout primitive — the default way to arrange components. Prefer this over ad-hoc `flex gap-x` class strings in product code."
      }
    }
  },
  argTypes: {
    direction: { control: "select", options: ["row", "column"] },
    gap: { control: "select", options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20] },
    align: { control: "select", options: ["start", "center", "end", "stretch"] },
    justify: { control: "select", options: ["start", "center", "end", "between"] },
    wrap: { control: "boolean" }
  },
  args: { direction: "row", gap: 4, align: "stretch", justify: "start", wrap: false, children: null },
  render: (args: StackProps) => (
    <Stack {...args}>
      {swatch("One")}
      {swatch("Two")}
      {swatch("Three")}
    </Stack>
  )
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Column: Story = {
  args: { direction: "column" }
};
