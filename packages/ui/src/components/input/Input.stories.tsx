import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "shadcn/ui's own Input, sourced and adapted to Lumen's token system — see docs/shadcn-integration.md §7.8. Promoted to this plain name after Lumen's original hand-built `Input` primitive was retired in its favor; there is no `size`/`variant`/leading-icon/shortcut-badge equivalent. Dark mode follows the global `data-theme` toolbar toggle, not a separate story."
      }
    }
  },
  args: { placeholder: "Email" }
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Input {...args} className="w-[280px]" />
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <Input {...args} className="w-[280px]" />
};

export const FileType: Story = {
  args: { type: "file" },
  render: (args) => <Input {...args} className="w-[280px]" />
};
