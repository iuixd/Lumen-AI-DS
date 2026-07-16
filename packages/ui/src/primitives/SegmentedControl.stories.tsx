import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SegmentedControl, SegmentedControlOption } from "./SegmentedControl";

const meta = {
  title: "Primitives/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Sourced from the Figma 'Buttons' page's 'AI ButtonGroup Component Library' section (Lumen-AI-Design-System, node 958:5058, 'Segmented Control Group', and node 958:5090, 'Size Rows'): a single-choice, tab-like control distinct from `ButtonGroup` (which joins full `Button`s with shared borders) — this is a padded track where the selected segment lifts onto its own elevated pill. Uses `role=\"radiogroup\"`/`role=\"radio\"`, not `Tabs`' tab-panel pattern, since it's a value picker rather than a content switcher. Container padding, track radius, and segment radius are uniform across sizes; per-size segment padding and type (`button-sm`/`button-md`/`button-lg`) were independently verified against Figma's own `sm`/`md`/`lg` size-row instances."
      }
    }
  },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" }
  },
  args: {
    "aria-label": "Tone",
    size: "md",
    disabled: false,
    children: null
  }
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <SegmentedControl {...args} aria-label="Tone" defaultValue="neutral">
      <SegmentedControlOption value="formal">Formal</SegmentedControlOption>
      <SegmentedControlOption value="neutral">Neutral</SegmentedControlOption>
      <SegmentedControlOption value="friendly">Friendly</SegmentedControlOption>
      <SegmentedControlOption value="concise">Concise</SegmentedControlOption>
    </SegmentedControl>
  )
};

export const ToneSelector: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <SegmentedControl aria-label="Tone" defaultValue="neutral">
      <SegmentedControlOption value="formal">Formal</SegmentedControlOption>
      <SegmentedControlOption value="neutral">Neutral</SegmentedControlOption>
      <SegmentedControlOption value="friendly">Friendly</SegmentedControlOption>
      <SegmentedControlOption value="concise">Concise</SegmentedControlOption>
    </SegmentedControl>
  )
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col items-start gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <SegmentedControl key={size} aria-label={`Model, ${size}`} defaultValue="balanced" size={size}>
          <SegmentedControlOption value="fast">Fast</SegmentedControlOption>
          <SegmentedControlOption value="balanced">Balanced</SegmentedControlOption>
          <SegmentedControlOption value="thorough">Thorough</SegmentedControlOption>
        </SegmentedControl>
      ))}
    </div>
  )
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <SegmentedControl aria-label="Tone" defaultValue="neutral" disabled>
      <SegmentedControlOption value="formal">Formal</SegmentedControlOption>
      <SegmentedControlOption value="neutral">Neutral</SegmentedControlOption>
      <SegmentedControlOption value="friendly">Friendly</SegmentedControlOption>
    </SegmentedControl>
  )
};

export const ControlledExample: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    function Demo() {
      const [tone, setTone] = useState("neutral");
      return (
        <div className="flex flex-col items-start gap-3">
          <SegmentedControl aria-label="Tone" value={tone} onValueChange={setTone}>
            <SegmentedControlOption value="formal">Formal</SegmentedControlOption>
            <SegmentedControlOption value="neutral">Neutral</SegmentedControlOption>
            <SegmentedControlOption value="friendly">Friendly</SegmentedControlOption>
            <SegmentedControlOption value="concise">Concise</SegmentedControlOption>
          </SegmentedControl>
          <p className="text-body-sm text-[var(--color-text-muted)]">Selected: {tone}</p>
        </div>
      );
    }
    return <Demo />;
  }
};
