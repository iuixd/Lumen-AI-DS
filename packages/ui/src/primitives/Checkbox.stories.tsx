import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Primitives/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    invalid: { control: "boolean" },
    size: { control: "select", options: ["sm", "md", "lg"] }
  },
  args: {
    name: "terms",
    label: "Accept terms and conditions",
    size: "md",
    invalid: false,
    indeterminate: false
  }
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true }
};

export const Disabled: Story = {
  args: { disabled: true }
};

export const Indeterminate: Story = {
  args: { indeterminate: true }
};

export const VariantCollection: Story = {
  render: () => (
    <div className="grid gap-8 lg:grid-cols-2">
      {(["light", "dark"] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          className="space-y-5 rounded-lg bg-[var(--color-background-default)] p-6"
        >
          <h3 className="text-title-md capitalize text-[var(--color-text-title)]">{theme}</h3>
          {(["lg", "md", "sm"] as const).map((size) => (
            <div key={size} className="flex flex-wrap items-center gap-5">
              <Checkbox name={`${theme}-${size}-default`} size={size} label={`${size} default`} />
              <Checkbox
                name={`${theme}-${size}-checked`}
                size={size}
                label="Checked"
                defaultChecked
              />
              <Checkbox
                name={`${theme}-${size}-mixed`}
                size={size}
                label="Indeterminate"
                indeterminate
              />
              <Checkbox name={`${theme}-${size}-error`} size={size} label="Error" invalid />
              <Checkbox name={`${theme}-${size}-disabled`} size={size} label="Disabled" disabled />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
};
