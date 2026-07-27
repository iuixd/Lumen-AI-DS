import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AIPanel, type AIPanelMessage } from "./AIPanel";

const messages: AIPanelMessage[] = [
  { role: "user", content: "Which renewals should I focus on this week?" },
  {
    role: "assistant",
    content:
      "Start with Meridian Health — $380k closing in 15 days with no exec touchpoint since May. I've drafted an outreach email referencing support tickets.",
    followUps: [
      { label: "Review draft" },
      { label: "Show sources", variant: "link" }
    ]
  }
];

const conversationMessages: AIPanelMessage[] = [
  {
    role: "user",
    content: "Which enterprise accounts are at renewal risk this quarter?",
    timestamp: "Today - 2:40 PM"
  },
  {
    role: "assistant",
    content:
      "Three accounts show elevated risk. Northwind Corp, Fabrikam Ltd, and Contoso GmbH. All three have renewals inside 45 days and declining usage.",
    responseActions: {
      onThumbsUp: () => {},
      onThumbsDown: () => {},
      onCopy: () => {},
      branch: "2/2",
      edited: true
    },
    suggestedFollowUps: [
      { label: "Draft outreach emails for all three" },
      { label: "What changed since last quarter?" },
      { label: "Show usage trend" }
    ]
  }
];

const meta = {
  title: "AI Components/AIPanel",
  component: AIPanel,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Sourced from the canonical AIPanel component, Lumen-AI-Design-System node `1079:3141` (re-synced 2026-07-26) — a 304px right-side assistant chat panel. Follow-up prompts render full-width and stacked inside the assistant bubble, in one of two treatments (`outline`/`link`, see `AIPanelFollowUp`). A response-actions feedback row (thumbs up/down, copy, branch, edited) is documented, optional anatomy sourced from a separate frame (node 1412:3030) not used by this component's own default instance — see the `WithResponseActions` story."
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
    <div className="h-[812px] w-[var(--spacing-304)]">
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
        <div className="h-[812px] w-[var(--spacing-304)]">
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
    <div className="h-[812px] w-[var(--spacing-304)]">
      <AIPanel title="Assistant" messages={[]} inputPlaceholder="Summarize pipeline..." />
    </div>
  )
};

export const WithResponseActions: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "The optional response-actions row (thumbs up/down, copy, a branch label, an 'edited' flag), a timestamp divider, and a labeled 'Suggested follow-ups' section — real Figma anatomy (node 1412:3030) that isn't part of the canonical AIPanel component's own default instance, but remains available on `AIPanelMessage` for products that need it."
      }
    }
  },
  render: () => (
    <div className="h-[812px] w-[var(--spacing-304)]">
      <AIPanel title="Assistant" messages={conversationMessages} inputPlaceholder="Ask a follow-up..." />
    </div>
  )
};
