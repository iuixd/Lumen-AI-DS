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
          "shadcn/ui's own Input, sourced and adapted to Lumen's token system — see docs/shadcn-integration.md §7.8. Promoted to this plain name after Lumen's original hand-built `Input` primitive was retired in its favor. Rewritten 2026-07-31 to match the canonical Figma Input collection (node 1262:1181): `size` (`sm`/`md`/`lg`, default `md`) and `variant` (`primary`/`search`, default `primary`) — `size` shadows and replaces the native HTML `size` attribute. Use `aria-invalid` for the error state. No leading-icon/shortcut-badge slot — compose those with `InputGroup` instead. Dark mode follows the global `data-theme` toolbar toggle, not a separate story."
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

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <Input size="sm" placeholder="Small" className="w-[280px]" />
      <Input size="md" placeholder="Medium (default)" className="w-[280px]" />
      <Input size="lg" placeholder="Large" className="w-[280px]" />
    </div>
  )
};

export const SearchVariant: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <Input variant="search" size="sm" placeholder="Search…" className="w-[280px]" />
      <Input variant="search" size="md" placeholder="Search…" className="w-[280px]" />
      <Input variant="search" size="lg" placeholder="Search…" className="w-[280px]" />
    </div>
  )
};

export const ErrorState: Story = {
  args: { "aria-invalid": true, defaultValue: "invalid@" },
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
