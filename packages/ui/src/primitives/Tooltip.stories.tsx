import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";
import { Button } from "./Button";

const meta = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Dependency-free tooltip, shown on hover/focus. Swap for Radix/Floating UI if collision-aware positioning is needed — keep the same public API."
      }
    }
  },
  argTypes: {
    side: { control: "select", options: ["top", "bottom"] }
  },
  args: { label: "Duplicate this record", side: "top", children: null }
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: ComponentProps<typeof Tooltip>) => (
    <div className="p-8">
      <Tooltip {...args}>
        <Button variant="neutral">Hover me</Button>
      </Tooltip>
    </div>
  )
};
