import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { ArrowLeftIcon, ArrowRightIcon, SearchIcon } from "../icons/generated";

/**
 * The Buttons page's `Left`/`Right` icon-position instances (node 475:7210)
 * share one Button size with the icon glyph — 14/16/18/18px for xs/sm/md/lg,
 * the `--spacing-14`/`--spacing-16`/`--spacing-18` tokens.
 */
const iconSizeBySize: Record<"xs" | "sm" | "md" | "lg", string> = {
  xs: "size-[var(--spacing-14)]",
  sm: "size-[var(--spacing-16)]",
  md: "size-[var(--spacing-18)]",
  lg: "size-[var(--spacing-18)]"
};

const meta = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Sourced from the Figma 'Buttons' page (Lumen-AI-Design-System, node 475:7210): Primary, Secondary, Tertiary, Link, Raised (Primary with elevation), Outline (transparent-until-hover, same border/text colors as Secondary), each in xs/sm/md/lg, plus the Pill Button shape modifier. The page's Left/Right icon-position instances map to the `iconStart`/`iconEnd` props rather than their own variant — see the WithIcons story. `status` (success/warning/error) is a tinted status override sourced from the same component-set's State property — see the StatusStates story (verified for Primary/Secondary only, not yet re-verified for Outline)."
      }
    }
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "link", "raised", "outline", "accent"]
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    status: { control: "select", options: [undefined, "success", "warning", "error"] },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
    pill: { control: "boolean" }
  },
  args: {
    children: "Save changes",
    variant: "primary",
    size: "md",
    isLoading: false,
    disabled: false,
    pill: false
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="raised">Raised</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="link">Link</Button>
      <Button variant="accent">Accent</Button>
    </div>
  )
};

export const Pill: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button pill variant="primary">
        Primary
      </Button>
      <Button pill variant="raised">
        Raised
      </Button>
      <Button pill variant="secondary">
        Secondary
      </Button>
      <Button pill variant="tertiary">
        Tertiary
      </Button>
      <Button pill variant="outline">
        Outline
      </Button>
    </div>
  )
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  )
};

export const IconOnly: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button iconOnly size="xs" aria-label="Search">
        <SearchIcon className="size-3" />
      </Button>
      <Button iconOnly size="sm" aria-label="Search">
        <SearchIcon className="size-4" />
      </Button>
      <Button iconOnly size="md" aria-label="Search">
        <SearchIcon className="size-5" />
      </Button>
      <Button iconOnly size="lg" aria-label="Search">
        <SearchIcon className="size-5" />
      </Button>
    </div>
  )
};

export const WithIcons: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" iconStart={<ArrowLeftIcon className={iconSizeBySize.md} />}>
          Primary
        </Button>
        <Button variant="raised" iconStart={<ArrowLeftIcon className={iconSizeBySize.md} />}>
          Raised
        </Button>
        <Button variant="secondary" iconStart={<ArrowLeftIcon className={iconSizeBySize.md} />}>
          Secondary
        </Button>
        <Button variant="tertiary" iconStart={<ArrowLeftIcon className={iconSizeBySize.md} />}>
          Tertiary
        </Button>
        <Button variant="outline" iconStart={<ArrowLeftIcon className={iconSizeBySize.md} />}>
          Outline
        </Button>
        <Button variant="link" iconStart={<ArrowLeftIcon className={iconSizeBySize.md} />}>
          Link
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" iconEnd={<ArrowRightIcon className={iconSizeBySize.md} />}>
          Primary
        </Button>
        <Button variant="raised" iconEnd={<ArrowRightIcon className={iconSizeBySize.md} />}>
          Raised
        </Button>
        <Button variant="secondary" iconEnd={<ArrowRightIcon className={iconSizeBySize.md} />}>
          Secondary
        </Button>
        <Button variant="tertiary" iconEnd={<ArrowRightIcon className={iconSizeBySize.md} />}>
          Tertiary
        </Button>
        <Button variant="outline" iconEnd={<ArrowRightIcon className={iconSizeBySize.md} />}>
          Outline
        </Button>
        <Button variant="link" iconEnd={<ArrowRightIcon className={iconSizeBySize.md} />}>
          Link
        </Button>
      </div>
    </div>
  )
};

export const WithIconsBySize: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs" iconStart={<ArrowLeftIcon className={iconSizeBySize.xs} />}>
        Extra small
      </Button>
      <Button size="sm" iconStart={<ArrowLeftIcon className={iconSizeBySize.sm} />}>
        Small
      </Button>
      <Button size="md" iconStart={<ArrowLeftIcon className={iconSizeBySize.md} />}>
        Medium
      </Button>
      <Button size="lg" iconStart={<ArrowLeftIcon className={iconSizeBySize.lg} />}>
        Large
      </Button>
    </div>
  )
};

export const Loading: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button isLoading variant="primary">
        Saving
      </Button>
      <Button isLoading variant="secondary">
        Saving
      </Button>
      <Button isLoading variant="tertiary">
        Saving
      </Button>
      <Button isLoading pill variant="primary">
        Saving
      </Button>
      <Button isLoading iconOnly aria-label="Search">
        <SearchIcon className="size-5" />
      </Button>
    </div>
  )
};

export const StatusStates: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" status="success">
          Success
        </Button>
        <Button variant="primary" status="warning">
          Warning
        </Button>
        <Button variant="primary" status="error">
          Error
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" status="success">
          Success
        </Button>
        <Button variant="secondary" status="warning">
          Warning
        </Button>
        <Button variant="secondary" status="error">
          Error
        </Button>
      </div>
    </div>
  )
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled variant="primary">
        Save changes
      </Button>
      <Button disabled variant="secondary">
        Save changes
      </Button>
      <Button disabled variant="tertiary">
        Save changes
      </Button>
      <Button disabled variant="outline">
        Save changes
      </Button>
      <Button disabled pill variant="primary">
        Save changes
      </Button>
      <Button disabled iconOnly aria-label="Search">
        <SearchIcon className="size-5" />
      </Button>
    </div>
  )
};
