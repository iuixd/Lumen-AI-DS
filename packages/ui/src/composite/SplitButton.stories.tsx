import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SplitButton } from "./SplitButton";
import { PlusIcon, LmAisymbolIcon } from "../icons/generated";
import { getAICapability } from "../primitives/ai-capabilities";

const meta = {
  title: "Composite/SplitButton",
  component: SplitButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Sourced from the Figma 'Buttons' page (Lumen-AI-Design-System, node 555:300): a primary action joined to a dropdown-toggle by a divider. Primary, Raised, Secondary, and Outline are specced (no Tertiary/Link), in sm/md/lg sizes, with an optional leading icon."
      }
    }
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "raised", "secondary", "outline"]
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    pill: { control: "boolean" },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" }
  },
  args: {
    children: "Save changes",
    variant: "primary",
    size: "lg",
    pill: false,
    isLoading: false,
    disabled: false,
    dropdownLabel: "More save options"
  }
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <SplitButton variant="primary" dropdownLabel="More save options">
        Primary
      </SplitButton>
      <SplitButton variant="raised" dropdownLabel="More save options">
        Raised
      </SplitButton>
      <SplitButton variant="secondary" dropdownLabel="More save options">
        Secondary
      </SplitButton>
      <SplitButton variant="outline" dropdownLabel="More save options">
        Outline
      </SplitButton>
    </div>
  )
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <SplitButton size="sm" dropdownLabel="More save options">
        Small
      </SplitButton>
      <SplitButton size="md" dropdownLabel="More save options">
        Medium
      </SplitButton>
      <SplitButton size="lg" dropdownLabel="More save options">
        Large
      </SplitButton>
    </div>
  )
};

export const Pill: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <SplitButton pill variant="primary" dropdownLabel="More save options">
        Primary
      </SplitButton>
      <SplitButton pill variant="raised" dropdownLabel="More save options">
        Raised
      </SplitButton>
      <SplitButton pill variant="secondary" dropdownLabel="More save options">
        Secondary
      </SplitButton>
      <SplitButton pill variant="outline" dropdownLabel="More save options">
        Outline
      </SplitButton>
    </div>
  )
};

export const WithIcon: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <SplitButton iconStart={<PlusIcon className="size-4" />} dropdownLabel="More create options">
        Create
      </SplitButton>
      <SplitButton
        variant="secondary"
        iconStart={<PlusIcon className="size-4" />}
        dropdownLabel="More create options"
      >
        Create
      </SplitButton>
    </div>
  )
};

export const Loading: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <SplitButton isLoading variant="primary" dropdownLabel="More save options">
        Saving
      </SplitButton>
      <SplitButton isLoading variant="raised" dropdownLabel="More save options">
        Saving
      </SplitButton>
      <SplitButton isLoading variant="secondary" dropdownLabel="More save options">
        Saving
      </SplitButton>
      <SplitButton isLoading variant="outline" dropdownLabel="More save options">
        Saving
      </SplitButton>
    </div>
  )
};

export const AI: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Sourced from the Figma 'AI ButtonGroup Component Library' section (Lumen-AI-Design-System, node 969:5841, 'AI Draft'): a Split Button Group AI example — this resolves a previously-deferred gap ('Split Button AI... not built'). No new component or variant was needed: the instance reuses `SplitButton`'s existing `variant=\"primary\"` tokens exactly (`--button/surface`/`--button/onsurface`/`--button/separator` are unchanged from Primary), with `iconStart` set to the existing AI mark and the dropdown menu built from the existing `ai-capabilities` catalog (Summarize/Rewrite/Fix Grammar/Translate, matching Figma's own dropdown items). `SplitButton` deliberately renders no menu of its own — `onDropdownClick` is wired up by the consumer, demonstrated here with a minimal inline menu."
      }
    }
  },
  render: () => {
    function Demo() {
      const [open, setOpen] = useState(false);
      const items = ["summarize", "rewrite", "fix-grammar", "translate"] as const;
      return (
        <div className="relative inline-block">
          <SplitButton
            iconStart={<LmAisymbolIcon className="size-[18px]" />}
            onDropdownClick={() => setOpen((o) => !o)}
            dropdownLabel="More AI actions"
          >
            AI Draft
          </SplitButton>
          {open && (
            <div role="menu" className="absolute left-0 top-full z-10 mt-[var(--spacing-6)] min-w-[var(--spacing-120)] rounded-md border border-[var(--color-border-default)] bg-neutral-white py-[var(--spacing-6)] shadow-lg">
              {items.map((id) => {
                const capability = getAICapability(id)!;
                const Icon = capability.icon;
                return (
                  <button
                    key={id}
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-[var(--spacing-8)] px-[var(--spacing-16)] py-[var(--spacing-8)] text-left text-button-md text-[var(--color-text-body)] hover:bg-[var(--color-background-subtle)]"
                    onClick={() => setOpen(false)}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {capability.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );
    }
    return <Demo />;
  }
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <SplitButton disabled variant="primary" dropdownLabel="More save options">
        Save changes
      </SplitButton>
      <SplitButton disabled variant="raised" dropdownLabel="More save options">
        Save changes
      </SplitButton>
      <SplitButton disabled variant="secondary" dropdownLabel="More save options">
        Save changes
      </SplitButton>
      <SplitButton disabled variant="outline" dropdownLabel="More save options">
        Save changes
      </SplitButton>
    </div>
  )
};
