import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";
import { Button } from "../components/button/Button";
import { Icon } from "../primitives/Icon";

const meta = {
  title: "Composite/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  args: {
    title: "No records yet",
    description: "Records will show up here once they're created."
  },
  render: (args: ComponentProps<typeof EmptyState>) => <EmptyState {...args} />
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithIconAndAction: Story = {
  args: {
    icon: <Icon name="filter" className="size-8 text-[var(--color-text-muted)]" />,
    action: <Button>Create record</Button>
  }
};
