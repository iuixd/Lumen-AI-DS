import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    type: { control: "select", options: ["text", "email", "password", "number", "search"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    variant: { control: "select", options: ["default", "search"] },
    showShortcut: { control: "boolean" }
  },
  args: {
    placeholder: "Type your question...",
    type: "text",
    size: "md",
    variant: "default",
    invalid: false,
    disabled: false,
    showShortcut: true
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

export const Search: Story = {
  args: { variant: "search" }
};

export const VariantCollection: Story = {
  render: () => (
    <div className="grid gap-8 lg:grid-cols-2">
      {(["light", "dark"] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          className="space-y-4 rounded-lg bg-[var(--color-background-default)] p-6"
        >
          <h3 className="text-title-md capitalize text-[var(--color-text-title)]">{theme}</h3>
          {(["lg", "md", "sm"] as const).map((size) => (
            <div key={size} className="space-y-3">
              <Input
                size={size}
                aria-label={`${theme} ${size} default`}
                placeholder={`${size} default`}
              />
              <Input size={size} aria-label={`${theme} ${size} search`} variant="search" />
              <Input
                size={size}
                aria-label={`${theme} ${size} error`}
                invalid
                defaultValue="Invalid value"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
};
