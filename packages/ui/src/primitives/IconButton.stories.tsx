import type { Meta, StoryObj } from "@storybook/react";
import { IconButton, type IconButtonVariant, type IconButtonSize } from "./IconButton";
import { PlusIcon } from "../icons/generated/PlusIcon";
import { TrashIcon } from "../icons/generated/TrashIcon";
import { XIcon } from "../icons/generated/XIcon";

const variants: IconButtonVariant[] = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
  "neutral-outline",
  "neutral-solid"
];
const sizes: IconButtonSize[] = ["sm", "md", "lg", "xl"];

const meta = {
  title: "Primitives/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A compact, square, icon-only control. Sourced from Lumen-AI-Design-System node `1034:4459`'s \"Icon Only - light\" instance and node `1565:3815`'s dedicated icon-only reference frame — only `variant=\"secondary\"` at `size=\"md\"` (34px) matches a literal Figma instance exactly (that same instance is also Figma's icon-only \"Primary\" type); `neutral-outline`/`neutral-solid` (added 2026-08-04) match that frame's \"Outline\"/\"Solid\" types exactly. The remaining variants reuse Button's already-synced color tokens applied to this new icon-only geometry."
      }
    }
  },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: sizes }
  },
  args: {
    icon: <PlusIcon />,
    variant: "secondary",
    size: "md",
    "aria-label": "Add item"
  }
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const VariantCollection: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map((variant) => (
        <IconButton key={variant} variant={variant} icon={<PlusIcon />} aria-label={`${variant} add`} />
      ))}
    </div>
  )
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {sizes.map((size) => (
        <IconButton key={size} size={size} icon={<PlusIcon />} aria-label={`Add, ${size}`} />
      ))}
    </div>
  )
};

export const Examples: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <IconButton variant="secondary" icon={<PlusIcon />} aria-label="Add item" />
      <IconButton variant="destructive" icon={<TrashIcon />} aria-label="Delete item" />
      <IconButton variant="ghost" icon={<XIcon />} aria-label="Dismiss" />
    </div>
  )
};

export const Disabled: Story = {
  args: { disabled: true }
};
