import type { Meta, StoryObj } from "@storybook/react";
import { Radio } from "./Radio";

const meta = {
  title: "Primitives/Radio",
  component: Radio,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" }
  },
  args: { name: "plan", value: "pro", label: "Pro", size: "md", invalid: false }
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
              <Radio
                name={`${theme}-${size}-default`}
                value="default"
                size={size}
                label={`${size} default`}
              />
              <Radio
                name={`${theme}-${size}-selected`}
                value="selected"
                size={size}
                label="Selected"
                defaultChecked
              />
              <Radio
                name={`${theme}-${size}-error`}
                value="error"
                size={size}
                label="Error"
                invalid
              />
              <Radio
                name={`${theme}-${size}-disabled`}
                value="disabled"
                size={size}
                label="Disabled"
                disabled
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
};
