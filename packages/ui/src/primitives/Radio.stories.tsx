import type { Meta, StoryObj } from "@storybook/react";
import { Radio } from "./Radio";

const meta = {
  title: "Primitives/Radio",
  component: Radio,
  tags: ["autodocs"],
  args: { name: "plan", value: "pro", label: "Pro" }
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Group: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-2">
      <Radio name="plan-group" value="free" label="Free" defaultChecked />
      <Radio name="plan-group" value="pro" label="Pro" />
      <Radio name="plan-group" value="enterprise" label="Enterprise" />
    </div>
  )
};
