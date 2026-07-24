import type { Meta, StoryObj } from "@storybook/react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./Collapsible";
import { Button } from "../button/Button";

const meta = {
  title: "Primitives/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Single boolean expand/collapse primitive, sourced from shadcn/ui (Radix Collapsible) — see docs/shadcn-integration.md. Distinct from Accordion, which coordinates multiple items. Dark mode follows the global `data-theme` toolbar toggle, not a separate story."
      }
    }
  }
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-[320px]">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm">
          Toggle details
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 text-body-sm text-[var(--color-text-body)]">
        Additional details shown only when expanded.
      </CollapsibleContent>
    </Collapsible>
  )
};

export const OpenByDefault: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-[320px]">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm">
          Toggle details
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 text-body-sm text-[var(--color-text-body)]">
        Shown open by default for visual review.
      </CollapsibleContent>
    </Collapsible>
  )
};
