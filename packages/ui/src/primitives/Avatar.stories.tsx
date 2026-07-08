import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta = {
  title: "Primitives/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Falls back to initials-on-brand when no image is provided or the image fails to load."
      }
    }
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] }
  },
  args: { name: "Jane Cooper", size: "md" }
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithImage: Story = {
  args: { src: "https://i.pravatar.cc/64", name: "Jane Cooper" }
};

export const InitialsFallback: Story = {
  args: { name: "Amara Okafor" }
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar name="Jane Cooper" size="sm" />
      <Avatar name="Jane Cooper" size="md" />
      <Avatar name="Jane Cooper" size="lg" />
    </div>
  )
};
