import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "shadcn/ui's own Button, sourced and adapted to Lumen's token system — see docs/shadcn-integration.md §7.8. Promoted to this plain name after Lumen's original hand-built `Button` primitive was retired in its favor; the variant vocabulary is now `default`/`destructive`/`outline`/`secondary`/`ghost`/`link` (there is no `accent`/`ai` equivalent, and no `iconStart`/`iconEnd` props — pass an icon as a plain child). Every variant/state's colors are synced to the canonical Figma Button component-set (node `1174:1349`) as of 2026-07-24. Dark mode follows the global `data-theme` toolbar toggle, not a separate story."
      }
    }
  },
  args: { children: "Button" }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  )
};

export const Disabled: Story = {
  args: { disabled: true }
};
