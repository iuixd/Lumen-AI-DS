import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle } from "./Card";
import { Button } from "../primitives/Button";

const meta = {
  title: "Composite/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { controls: { disable: true } }
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <Button variant="clear" size="sm">
          Reset
        </Button>
      </CardHeader>
      <p className="text-body-md text-[var(--color-text-body)]">
        Card content goes here — form fields, a table, anything.
      </p>
    </Card>
  )
};

export const Plain: Story = {
  render: () => (
    <Card className="max-w-sm">
      <p className="text-body-md text-[var(--color-text-body)]">A card with no header, just content.</p>
    </Card>
  )
};
