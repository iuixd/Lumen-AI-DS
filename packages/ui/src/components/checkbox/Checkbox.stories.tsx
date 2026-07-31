import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Primitives/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "shadcn/ui's own Checkbox (Radix Checkbox), sourced and adapted to Lumen's token system — see docs/shadcn-integration.md §7.8. Promoted to this plain name after Lumen's own hand-built `Checkbox` primitive was retired in its favor. Rewritten 2026-07-31 to match the canonical Figma Checkbox collection (node 1278:2207): `size` (`sm`/`md`/`lg`, default `md`), plus Hover/Focused/Error/Indeterminate states. Use `aria-invalid` for the error state and `checked=\"indeterminate\"` for the indeterminate state. Dark mode follows the global `data-theme` toolbar toggle, not a separate story."
      }
    }
  }
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Checkbox aria-label="Accept terms" />
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Checkbox aria-label="Small" size="sm" defaultChecked />
      <Checkbox aria-label="Medium (default)" size="md" defaultChecked />
      <Checkbox aria-label="Large" size="lg" defaultChecked />
    </div>
  )
};

export const CheckedByDefault: Story = {
  render: () => <Checkbox aria-label="Accept terms" defaultChecked />
};

export const Indeterminate: Story = {
  render: () => <Checkbox aria-label="Select all" checked="indeterminate" />
};

export const ErrorState: Story = {
  render: () => <Checkbox aria-label="Accept terms" aria-invalid />
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Checkbox aria-label="Accept terms" disabled />
      <Checkbox aria-label="Accept terms (checked)" disabled defaultChecked />
    </div>
  )
};
