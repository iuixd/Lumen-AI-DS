import type { Meta, StoryObj } from "@storybook/react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle
} from "./Item";
import { Button } from "../button/Button";
import { SettingsIcon } from "../../icons/generated/SettingsIcon";

const meta = {
  title: "Composite/Item",
  component: Item,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Generic structured list-row layout (media + title/description + actions), sourced from shadcn/ui and adapted to Lumen's token system — see docs/shadcn-integration.md. Dark mode follows the global `data-theme` toolbar toggle, not a separate story."
      }
    }
  }
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Item className="w-[360px]" variant="outline">
      <ItemMedia variant="icon">
        <SettingsIcon className="h-4 w-4" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Notification settings</ItemTitle>
        <ItemDescription>Manage how you receive notifications.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" size="sm">
          Edit
        </Button>
      </ItemActions>
    </Item>
  )
};

export const Muted: Story = {
  render: () => (
    <Item className="w-[360px]" variant="muted">
      <ItemContent>
        <ItemTitle>Read-only item</ItemTitle>
        <ItemDescription>This row uses the muted background variant.</ItemDescription>
      </ItemContent>
    </Item>
  )
};

export const Group: Story = {
  render: () => (
    <ItemGroup className="w-[360px] rounded-md border">
      <Item>
        <ItemContent>
          <ItemTitle>First item</ItemTitle>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item>
        <ItemContent>
          <ItemTitle>Second item</ItemTitle>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item>
        <ItemContent>
          <ItemTitle>Third item</ItemTitle>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
};

export const LongContent: Story = {
  render: () => (
    <Item className="w-[320px]" variant="outline">
      <ItemContent>
        <ItemTitle>A fairly long title that may wrap onto a second line</ItemTitle>
        <ItemDescription>
          A longer description that demonstrates the two-line clamp behavior — this text keeps
          going well past what fits on two lines, and should be truncated with an ellipsis.
        </ItemDescription>
      </ItemContent>
    </Item>
  )
};
