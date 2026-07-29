import type { Meta, StoryObj } from "@storybook/react";
import { AIResponseCard } from "./AIResponseCard";

const meta = {
  title: "AI Components/AIResponseCard",
  component: AIResponseCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A structured AI-generated response: title, summary bullets, an optional data table, an optional code block, additional collapsed sections, and follow-up actions. Sourced from Lumen-AI-Design-System node `1484:2905` (\"AI Response Components\") — the first real evidence for what `docs/component-architecture.md` §8 previously described only aspirationally."
      }
    }
  },
  args: {
    title: "AI Response Card",
    model: "claude-fable-5",
    sourcesCount: 2,
    suggestedAction: { label: "Draft outreach emails for all three" },
    // Wired on every story (not just Interactive) so Regenerate's 4s
    // skeleton-loading demo and Copy's real clipboard write both work
    // regardless of which story is open.
    onCopy: (text: string) => console.log("Copied:", text),
    onRegenerate: () => new Promise<void>((resolve) => setTimeout(resolve, 4000)),
    sections: [
      {
        title: "Executive Summary",
        bullets: [
          "Renewal risk is concentrated in three enterprise accounts",
          "Support volume fell 8% after the onboarding revamp",
          "Recommended action: early renewal outreach this week"
        ],
        table: {
          columns: [
            { key: "account", header: "Account" },
            { key: "arr", header: "ARR" },
            { key: "risk", header: "Risk" }
          ],
          rows: [
            { account: "Northwind Corp", arr: "$420K", risk: "High" },
            { account: "Fabrikam Ltd", arr: "$319K", risk: "Medium" }
          ]
        },
        code: {
          code: "SELECT account, arr, risk_score FROM renewals WHERE quarter = 'Q3';",
          language: "sql"
        }
      },
      {
        title: "Supporting Detail",
        bullets: ["Ticket volume trend by week", "Onboarding completion rate by cohort"]
      }
    ]
  }
} satisfies Meta<typeof AIResponseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SingleSection: Story = {
  args: {
    sections: [
      {
        title: "Executive Summary",
        bullets: ["No additional sections — the expand control is hidden when there's nothing to expand."]
      }
    ]
  }
};

export const NoTableOrCode: Story = {
  args: {
    sections: [
      {
        title: "Summary",
        bullets: ["A response can be bullets only — table and code are both optional per section."]
      }
    ]
  }
};

/**
 * Same behavior as every other story (it's on the shared default args) —
 * kept as its own story for discoverability, with the suggested-action
 * pill also wired. Copy writes real content to the clipboard (try it, then
 * paste elsewhere) and shows a temporary "Copied" confirmation. Regenerate
 * simulates a 4s async operation — the section body swaps to a loading
 * skeleton and the button becomes a disabled spinner for the duration,
 * matching a real AI-generation delay. Both footer icon actions have
 * tooltips.
 */
export const Interactive: Story = {
  args: {
    suggestedAction: {
      label: "Draft outreach emails for all three",
      onClick: () => alert("Drafting…")
    }
  }
};
