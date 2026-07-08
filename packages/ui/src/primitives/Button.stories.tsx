import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Maps 1:1 to the Figma component set family: Primary, Secondary, Neutral, Error, Clear. Extend with a new variant/prop instead of creating a new button component — see CONTRIBUTING.md."
      }
    }
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "neutral", "error", "clear"]
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" }
  },
  args: {
    children: "Save changes",
    variant: "primary",
    size: "md",
    isLoading: false,
    disabled: false
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="neutral">Neutral</Button>
      <Button variant="error">Error</Button>
      <Button variant="clear">Clear</Button>
    </div>
  )
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  )
};

export const Loading: Story = {
  args: { isLoading: true, children: "Saving" }
};

export const Disabled: Story = {
  args: { disabled: true }
};
