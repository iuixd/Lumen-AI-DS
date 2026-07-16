import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ChoiceChip } from "./ChoiceChip";
import { getAICapability } from "./ai-capabilities";

const meta = {
  title: "Primitives/ChoiceChip",
  component: ChoiceChip,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Sourced from the Figma 'Buttons' page (Lumen-AI-Design-System, node 581:485): a toggleable pill for a single-value choice. Unselected shows plain text; selected fills solid brand and gains a leading check icon. Only the `lg` size (36px) is specced."
      }
    }
  },
  argTypes: {
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
    tone: { control: "select", options: ["solid", "subtle"] }
  },
  args: {
    children: "Small",
    selected: false,
    disabled: false,
    tone: "solid"
  }
} satisfies Meta<typeof ChoiceChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <ChoiceChip>Default</ChoiceChip>
      <ChoiceChip selected>Selected</ChoiceChip>
      <ChoiceChip disabled>Disabled</ChoiceChip>
    </div>
  )
};

export const ToggleGroup: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "`tone=\"subtle\"` reproduces the Figma 'AI ButtonGroup Component Library' Toggle Group (node 969:5151, multi-select capability pills) — reusing `ChoiceChip` rather than a new component, since its toggle+leading-icon+trailing-check interaction already matched. Labels/icons are drawn from the existing `ai-capabilities` catalog; each pill toggles independently (multi-select), unlike `SingleChoiceGroup` below. The workspace-summary caption (node 969:5317, \"status-text\") is example content, not a `ChoiceChip` prop — its color (`#424849`) is `lumen-gray.800`, a primitive this component doesn't otherwise alias, used here via the raw CSS variable since it's illustrative story text, not a shipped API surface."
      }
    }
  },
  render: () => {
    function Demo() {
      const ids = ["summarize", "explain-data", "translate", "detect-trends", "draft-reply", "show-references"] as const;
      const [selected, setSelected] = useState<Set<string>>(new Set(["summarize", "explain-data", "show-references"]));
      const toggle = (id: string) =>
        setSelected((prev) => {
          const next = new Set(prev);
          next.has(id) ? next.delete(id) : next.add(id);
          return next;
        });
      return (
        <div className="flex flex-col items-start gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {ids.map((id) => {
              const capability = getAICapability(id)!;
              const Icon = capability.icon;
              return (
                <ChoiceChip
                  key={id}
                  tone="subtle"
                  icon={<Icon />}
                  selected={selected.has(id)}
                  onClick={() => toggle(id)}
                >
                  {capability.label}
                </ChoiceChip>
              );
            })}
          </div>
          <p className="text-body-xs text-[var(--color-lumen-gray-800)]">
            {selected.size} of {ids.length} capabilities enabled for this workspace
          </p>
        </div>
      );
    }
    return <Demo />;
  }
};

export const SingleChoiceGroup: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    function Demo() {
      const sizes = ["Small", "Medium", "Large"];
      const [selected, setSelected] = useState("Medium");
      return (
        <div className="flex flex-wrap items-center gap-3">
          {sizes.map((size) => (
            <ChoiceChip key={size} selected={selected === size} onClick={() => setSelected(size)}>
              {size}
            </ChoiceChip>
          ))}
        </div>
      );
    }
    return <Demo />;
  }
};
