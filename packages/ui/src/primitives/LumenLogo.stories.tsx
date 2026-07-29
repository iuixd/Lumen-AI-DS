import type { Meta, StoryObj } from "@storybook/react";
import { LumenLogo } from "./LumenLogo";

const meta = {
  title: "Primitives/LumenLogo",
  component: LumenLogo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The Lumen brand mark, sourced from the canonical Header component (Figma node 1174:1354, \"Header\" > Breakpoint=Desktop > \"Brand\" > \"Lumen DS Logo\"). A committed static SVG asset (bakes in its own gradients), rendered via `<img>` rather than a `currentColor` icon component."
      }
    }
  }
} satisfies Meta<typeof LumenLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "h-[21.8788px] w-[21.2423px]"
  }
};

export const Large: Story = {
  args: {
    className: "h-[65.4px] w-[63.7px]"
  }
};

/** Decorative use — pass an empty `title` when adjacent text already says "Lumen". */
export const Decorative: Story = {
  args: {
    className: "h-[21.8788px] w-[21.2423px]",
    title: ""
  }
};
