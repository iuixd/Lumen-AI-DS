import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    type: { control: "select", options: ["text", "email", "password", "number"] }
  },
  args: {
    placeholder: "you@company.com",
    type: "text",
    invalid: false,
    disabled: false
  }
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Invalid: Story = {
  args: { invalid: true, defaultValue: "not-an-email" }
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Can't edit this" }
};
