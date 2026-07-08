import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Container } from "./Container";

const meta = {
  title: "Layout/Container",
  component: Container,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Maps to Figma "Container" (the page-level content wrapper — max-width + horizontal padding). Note: Figma also has a same-named "Container" component for table columns/cells, an unrelated concept — see docs/figma-sync.md.'
      }
    }
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg", "xl", "full"] }
  },
  args: { size: "lg", children: null },
  render: (args: ComponentProps<typeof Container>) => (
    <Container {...args}>
      <div className="rounded-md bg-[var(--color-background-subtle)] p-6 text-center text-body-md text-[var(--color-text-body)]">
        Content constrained to the "{args.size}" max-width
      </div>
    </Container>
  )
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
