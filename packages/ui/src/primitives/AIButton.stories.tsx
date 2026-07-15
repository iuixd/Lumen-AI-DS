import type { Meta, StoryObj } from "@storybook/react";
import { AIButton } from "./AIButton";
import { WandSparklesIcon, LanguagesIcon } from "../icons/generated";

const meta = {
  title: "Primitives/AIButton",
  component: AIButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Sourced from the Figma 'Buttons' page's AI Communication Component Library (Lumen-DS-2027, node 760:1965): Primary, Secondary, Tertiary, and Outline AI, each in xs/sm/md/lg, always with a leading `lm-aisymbol` icon. `destructive` documents intent only — Figma specs no distinct color for it, so callers must add their own confirmation step before invoking a destructive AI action."
      }
    }
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "outline"]
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
    destructive: { control: "boolean" }
  },
  args: {
    children: "Summarize",
    variant: "primary",
    size: "md",
    isLoading: false,
    disabled: false,
    destructive: false
  }
} satisfies Meta<typeof AIButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <AIButton variant="primary">Primary AI</AIButton>
      <AIButton variant="secondary">Secondary AI</AIButton>
      <AIButton variant="tertiary">Tertiary AI</AIButton>
      <AIButton variant="outline">Outline AI</AIButton>
    </div>
  )
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <AIButton size="xs">Extra small</AIButton>
      <AIButton size="sm">Small</AIButton>
      <AIButton size="md">Medium</AIButton>
      <AIButton size="lg">Large</AIButton>
    </div>
  )
};

export const IconOnly: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <AIButton iconOnly size="sm" aria-label="AI actions" />
      <AIButton iconOnly size="md" aria-label="AI actions" />
      <AIButton iconOnly size="lg" aria-label="AI actions" />
    </div>
  )
};

export const CustomIcon: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <AIButton icon={<WandSparklesIcon className="size-[18px]" aria-hidden />}>Rewrite</AIButton>
      <AIButton icon={<LanguagesIcon className="size-[18px]" aria-hidden />}>Translate</AIButton>
    </div>
  )
};

export const Loading: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <AIButton isLoading>Generating...</AIButton>
      <AIButton isLoading variant="secondary">
        Generating...
      </AIButton>
    </div>
  )
};

export const Destructive: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <AIButton variant="secondary" destructive>
      Clean Up Records
    </AIButton>
  )
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <AIButton disabled>Summarize</AIButton>
      <AIButton disabled variant="secondary">
        Summarize
      </AIButton>
      <AIButton disabled variant="outline">
        Summarize
      </AIButton>
    </div>
  )
};

/**
 * Capability Catalog — the pattern documented on the same Figma section
 * (node 860:9109), mapping AI Buttons to example actions grouped by
 * category. Shown here as a Storybook composition, not a new exported
 * component — see `docs/changelog.md` `[Unreleased]` for why this stayed a
 * story rather than a shipped `packages/patterns` pattern.
 */
export const CapabilityCatalog: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const categories = [
      {
        title: "Content & Drafting",
        actions: ["Summarize long content into key points", "Generate new content", "Rewrite existing content"]
      },
      {
        title: "Data Analysis & Insights",
        actions: ["Explain charts and metrics", "Create reports and dashboards", "Detect trends and anomalies"]
      },
      {
        title: "Workflow & Automation",
        actions: ["Categorize incoming work", "Recommend the next action", "Draft contextual replies"]
      },
      {
        title: "Search & Knowledge",
        actions: ["Enterprise conversational search", "Explain selected content", "Search enterprise knowledge"]
      }
    ];
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {categories.map((category) => (
          <div key={category.title} className="flex flex-col gap-3">
            <p className="text-label-md font-semibold uppercase text-[var(--color-text-muted)]">{category.title}</p>
            <div className="flex flex-col gap-2">
              {category.actions.map((action) => (
                <AIButton key={action} variant="secondary" size="sm" className="justify-start">
                  {action}
                </AIButton>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
};
