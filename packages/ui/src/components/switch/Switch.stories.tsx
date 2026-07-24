import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";

const meta = {
  title: "Primitives/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "shadcn/ui's own Switch (Radix Switch), sourced and adapted to Lumen's token system — see docs/shadcn-integration.md §7.8. Promoted to this plain name after Lumen's own hand-built `Switch` primitive was retired in its favor. Dark mode follows the global `data-theme` toolbar toggle, not a separate story."
      }
    }
  }
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Switch aria-label="Toggle setting" />
};

export const CheckedByDefault: Story = {
  render: () => <Switch aria-label="Toggle setting" defaultChecked />
};

export const Disabled: Story = {
  render: () => <Switch aria-label="Toggle setting" disabled />
};
