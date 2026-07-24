import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "./Card";
import { Button } from "../button/Button";

const meta = {
  title: "Composite/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "shadcn/ui's own Card, sourced and adapted to Lumen's token system — see docs/shadcn-integration.md §7.8. Promoted to this plain name after Lumen's original hand-built `Card` primitive was retired in its favor. Dark mode follows the global `data-theme` toolbar toggle, not a separate story."
      }
    }
  }
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one click.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-body-sm">Card body content goes here.</p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  )
};

export const LongContent: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Terms and conditions</CardTitle>
      </CardHeader>
      <CardContent>
        {Array.from({ length: 5 }, (_, i) => (
          <p key={i} className="mb-2 text-body-sm last:mb-0">
            Paragraph {i + 1}: demonstrating a card with enough content to scroll the
            surrounding page, rather than the card itself.
          </p>
        ))}
      </CardContent>
    </Card>
  )
};
