import type { Meta, StoryObj } from "@storybook/react";
import { TextLink } from "./TextLink";

const meta = {
  title: "Primitives/TextLink",
  component: TextLink,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Maps to the Figma \"Text Link\" component set." } }
  },
  args: { children: "View documentation", href: "#" }
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const InSentence: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <p className="text-body-md text-[var(--color-text-body)]">
      Don&apos;t have an account? <TextLink href="#">Sign up</TextLink>
    </p>
  )
};
