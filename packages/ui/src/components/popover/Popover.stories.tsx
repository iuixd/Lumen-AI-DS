import type { Meta, StoryObj } from "@storybook/react";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Button } from "../button/Button";

const meta = {
  title: "Composite/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Floating panel anchored to a trigger, sourced from shadcn/ui (Radix Popover) and adapted to Lumen's token system — see docs/shadcn-integration.md. Dark mode follows the global `data-theme` toolbar toggle, not a separate story."
      }
    }
  }
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-body-sm">This is the popover content.</p>
      </PopoverContent>
    </Popover>
  )
};

export const OpenByDefault: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="secondary">Dimensions</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="text-title-sm text-foreground">Dimensions</h4>
          <p className="text-body-sm text-muted-foreground">Set the exact dimensions for the layer.</p>
        </div>
      </PopoverContent>
    </Popover>
  )
};

export const LongContent: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="secondary">Terms</Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        {Array.from({ length: 5 }, (_, i) => (
          <p key={i} className="mb-2 text-body-sm last:mb-0">
            Paragraph {i + 1}: enough content to demonstrate the popover growing beyond its
            default 18rem width when overridden via className.
          </p>
        ))}
      </PopoverContent>
    </Popover>
  )
};

export const SmallViewport: Story = {
  render: () => (
    <div style={{ width: 200 }}>
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button variant="secondary" className="w-full">
            Open
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <p className="text-body-sm">Popover content at a narrow viewport width.</p>
        </PopoverContent>
      </Popover>
    </div>
  )
};
