import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";
import { Button } from "../components/button/Button";
import { CheckFilledIcon, DatabaseIcon, LmBotStaticIcon } from "../icons/generated";

/**
 * The "AI Empty Communication States" treatment (Figma node 1416:3638) — a
 * branded card for AI/chat surfaces with no conversation yet. This is
 * `EmptyState` with `variant="ai"`, not a separate component (see
 * `Composite/EmptyState` for the generic dashed-border pattern this variant
 * extends). Kept in its own story file, grouped under "AI Components" in
 * Storybook's sidebar alongside `AIPanel` and the AI Button library, since
 * it's an AI-specific look rather than the generic empty-state default.
 */
const meta = {
  title: "AI Components/AI Empty Communication State",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Sourced from Lumen-AI-Design-System node `1416:3638`. Same `icon`/`title`/`description`/`action` props as `Composite/EmptyState` — only `variant=\"ai\"` differs. See that component's own docs for the full prop reference."
      }
    }
  },
  args: {
    variant: "ai",
    icon: <LmBotStaticIcon className="size-[var(--spacing-28)]" aria-hidden />,
    title: "Ask AI to get started",
    description: "Connect a data source or upload a file, then ask anything about your accounts.",
    action: (
      <>
        <Button className="h-[var(--spacing-40)] gap-[var(--spacing-8)] rounded-[var(--radius-lg)] px-[var(--spacing-14)] py-[var(--spacing-7)] text-standard-button-lg">
          <DatabaseIcon className="size-[var(--spacing-14)]" aria-hidden />
          Connect data source
        </Button>
        <Button
          variant="secondary"
          className="h-[var(--spacing-40)] gap-[var(--spacing-8)] rounded-[var(--radius-lg)] px-[var(--spacing-14)] py-[var(--spacing-7)] text-standard-button-lg"
        >
          <CheckFilledIcon className="size-[var(--spacing-14)]" aria-hidden />
          Upload a file
        </Button>
      </>
    )
  }
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
