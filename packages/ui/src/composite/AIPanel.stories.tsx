import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AIPanel, type AIPanelMessage } from "./AIPanel";
import { Button } from "../primitives/Button";

const messages: AIPanelMessage[] = [
  { role: "user", content: "Which renewals should I focus on this week?" },
  {
    role: "assistant",
    content:
      "Start with Meridian Health — $380k closing in 15 days with no exec touchpoint since May. I've drafted an outreach email referencing support tickets.",
    actions: (
      <>
        <Button variant="secondary" size="sm">
          Review draft
        </Button>
        <Button variant="secondary" size="sm">
          View accounts
        </Button>
      </>
    )
  }
];

const meta = {
  title: "Composite/AIPanel",
  component: AIPanel,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Sourced from the canonical Figma 'AppShell' page (Lumen-AI-Design-System, node 1007:3700, `AIPanel` component `1079:3141`): a 304px right-side assistant chat panel."
      }
    }
  },
  args: {
    title: "Assistant",
    messages,
    inputPlaceholder: "Summarize pipeline...",
    onNewThread: () => {}
  }
} satisfies Meta<typeof AIPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: { controls: { disable: true } },
  render: (args) => (
    <div className="h-[812px]">
      <AIPanel {...args} />
    </div>
  )
};

export const Interactive: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    function Demo() {
      const [msgs, setMsgs] = useState<AIPanelMessage[]>(messages);
      return (
        <div className="h-[812px]">
          <AIPanel
            title="Assistant"
            messages={msgs}
            inputPlaceholder="Summarize pipeline..."
            onSend={(value) => setMsgs((prev) => [...prev, { role: "user", content: value }])}
          />
        </div>
      );
    }
    return <Demo />;
  }
};

export const Empty: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="h-[812px]">
      <AIPanel title="Assistant" messages={[]} inputPlaceholder="Summarize pipeline..." />
    </div>
  )
};
