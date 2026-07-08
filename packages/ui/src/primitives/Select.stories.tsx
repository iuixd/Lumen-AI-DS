import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const meta = {
  title: "Primitives/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    invalid: { control: "boolean" },
    disabled: { control: "boolean" }
  },
  args: { invalid: false, disabled: false },
  render: (args: ComponentProps<typeof Select>) => (
    <Select {...args}>
      <option value="">Select a role</option>
      <option value="admin">Admin</option>
      <option value="editor">Editor</option>
      <option value="viewer">Viewer</option>
    </Select>
  )
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Invalid: Story = {
  args: { invalid: true }
};
