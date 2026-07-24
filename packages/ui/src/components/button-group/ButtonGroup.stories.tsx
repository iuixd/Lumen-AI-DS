import type { Meta, StoryObj } from "@storybook/react";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "./ButtonGroup";
import { Button } from "../button/Button";

const meta = {
  title: "Primitives/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "shadcn/ui's own ButtonGroup, sourced and adapted to Lumen's token system — see docs/shadcn-integration.md §7.8. Promoted to this plain name after Lumen's own hand-built `ButtonGroup` primitive was retired in its favor. Dark mode follows the global `data-theme` toolbar toggle, not a separate story."
      }
    }
  }
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Left</Button>
      <Button variant="outline">Middle</Button>
      <Button variant="outline">Right</Button>
    </ButtonGroup>
  )
};

export const WithSeparatorAndText: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Copy</Button>
      <ButtonGroupSeparator />
      <ButtonGroupText>Read-only</ButtonGroupText>
    </ButtonGroup>
  )
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">Top</Button>
      <Button variant="outline">Bottom</Button>
    </ButtonGroup>
  )
};
