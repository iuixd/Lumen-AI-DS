import type { Meta, StoryObj } from "@storybook/react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from "./InputGroup";
import { SearchIcon } from "../../icons/generated/SearchIcon";
import { Kbd } from "../kbd/Kbd";

const meta = {
  title: "Composite/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Wraps `Input`/`Textarea` with leading/trailing addons (icons, buttons, text, `Kbd`), sourced from shadcn/ui and adapted to Lumen's token system — see docs/shadcn-integration.md. Dark mode follows the global `data-theme` toolbar toggle, not a separate story."
      }
    }
  }
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <InputGroup className="max-w-sm">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  )
};

export const WithButton: Story = {
  render: () => (
    <InputGroup className="max-w-sm">
      <InputGroupInput placeholder="Email address" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>Send</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
};

export const WithText: Story = {
  render: () => (
    <InputGroup className="max-w-sm">
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="example.com" />
    </InputGroup>
  )
};

export const Textarea: Story = {
  render: () => (
    <InputGroup className="max-w-sm">
      <InputGroupTextarea placeholder="Type a message..." />
      <InputGroupAddon align="block-end">
        <InputGroupButton size="sm">Send</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
};

export const Disabled: Story = {
  render: () => (
    <InputGroup data-disabled className="max-w-sm">
      <InputGroupInput placeholder="Disabled" disabled />
      <InputGroupAddon align="inline-end">
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  )
};

export const Invalid: Story = {
  render: () => (
    <InputGroup className="max-w-sm">
      <InputGroupInput placeholder="you@example.com" aria-invalid="true" defaultValue="not-an-email" />
    </InputGroup>
  )
};
