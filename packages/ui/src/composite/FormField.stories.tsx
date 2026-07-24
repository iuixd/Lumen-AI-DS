import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "./FormField";
import { Input } from "../components/input/Input";

const meta = {
  title: "Composite/FormField",
  component: FormField,
  tags: ["autodocs"],
  argTypes: {
    required: { control: "boolean" }
  },
  args: {
    label: "Work email",
    htmlFor: "email",
    hint: "We'll only use this for account notifications.",
    required: true,
    children: <Input id="email" name="email" type="email" placeholder="you@company.com" />
  },
  render: (args: ComponentProps<typeof FormField>) => (
    <div className="max-w-sm">
      <FormField {...args} />
    </div>
  )
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithError: Story = {
  args: { hint: undefined, error: "Enter a valid work email." }
};
