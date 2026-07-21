import type { Meta, StoryObj } from "@storybook/react";
import { Badge, badgeStatuses } from "./Badge";

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: badgeStatuses
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    showDot: { control: "boolean" }
  },
  args: { children: "Label", status: "default", size: "sm", showDot: true }
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const VariantCollection: Story = {
  parameters: { controls: { disable: true } },
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
            <div key={size} className="flex flex-wrap items-center gap-3">
              {badgeStatuses.map((status) => (
                <Badge key={status} status={status} size={size}>
                  {status}
                </Badge>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
};

export const WithoutDot: Story = {
  args: { status: "success", showDot: false }
};
