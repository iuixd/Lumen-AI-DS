import type { Meta, StoryObj } from "@storybook/react";
import { ToastProvider, useToast } from "./Toast";
import { Button } from "../components/button/Button";

const meta = {
  title: "Composite/Toast",
  component: ToastProvider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Wrap the app root in `<ToastProvider>` once, then call `useToast().push({ title, description, tone })` from anywhere. Toasts auto-dismiss after 6s, shown by an animated progress bar along the bottom edge; hovering or focusing a toast pauses both the timer and the bar. Sourced from Lumen-AI-Design-System node `1475:5100` — `info`/`warning`/`error` tones have exact Figma-evidenced icons and accent colors; `success`/`neutral` keep their pre-existing generic treatment (no Figma instance for either)."
      }
    },
    controls: { disable: true }
  },
  args: { children: null }
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const { push } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="ghost"
        onClick={() =>
          push({
            title: "Memorial Day - Office Closed",
            description:
              "Today is a federal holiday. Your payroll deadline has been extended to Tuesday, May 26 - 1:00 PM (EST).",
            tone: "info"
          })
        }
      >
        Trigger info
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          push({
            title: "Memorial Day - Office Closed",
            description:
              "Today is a federal holiday. Your payroll deadline has been extended to Tuesday, May 26 - 1:00 PM (EST).",
            tone: "warning"
          })
        }
      >
        Trigger warning
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          push({
            title: "Memorial Day - Office Closed",
            description:
              "Today is a federal holiday. Your payroll deadline has been extended to Tuesday, May 26 - 1:00 PM (EST).",
            tone: "error"
          })
        }
      >
        Trigger error
      </Button>
      <Button variant="ghost" onClick={() => push({ title: "Saved", tone: "success" })}>
        Trigger success
      </Button>
      <Button variant="ghost" onClick={() => push({ title: "3 records updated", tone: "neutral" })}>
        Trigger neutral
      </Button>
    </div>
  );
}

export const Playground: Story = {
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  )
};

/**
 * All five tones stacked at once, so the info/warning/error accent, icon,
 * and progress-bar colors can be compared side by side against the three
 * Figma-sourced instances.
 */
export const AllTones: Story = {
  render: () => {
    function AllTonesDemo() {
      const { push } = useToast();
      return (
        <Button
          variant="default"
          onClick={() => {
            push({
              title: "Memorial Day - Office Closed",
              description:
                "Today is a federal holiday. Your payroll deadline has been extended to Tuesday, May 26 - 1:00 PM (EST).",
              tone: "info"
            });
            push({
              title: "Submission Due Tomorrow - 1:00 PM (EST)",
              description:
                "4 open exceptions remain for the week of May 18 - 22. Review and resolve before the extended deadline.",
              tone: "warning"
            });
            push({
              title: "Critical: Min Wage Violation",
              description:
                "Maya Thompson (E-1042) - effective rate $6.50/hr is below minimum wage. Shortfall of $340.00 must be corrected.",
              tone: "error"
            });
          }}
        >
          Show info, warning, and error
        </Button>
      );
    }
    return (
      <ToastProvider>
        <AllTonesDemo />
      </ToastProvider>
    );
  }
};

/**
 * Hover or focus the toast to pause its 6-second countdown — both the
 * dismiss timer and the progress bar's animation pause together, then
 * resume from where they left off.
 */
export const PauseOnHover: Story = {
  render: () => {
    function PauseDemo() {
      const { push } = useToast();
      return (
        <Button
          variant="default"
          onClick={() =>
            push({
              title: "Hover or focus me",
              description: "The 6s countdown and progress bar pause while you're on this toast.",
              tone: "info"
            })
          }
        >
          Trigger a pausable toast
        </Button>
      );
    }
    return (
      <ToastProvider>
        <PauseDemo />
      </ToastProvider>
    );
  }
};

/**
 * The `solid` variant fills the card with the tone's accent color instead
 * of a light card with a left-border accent — sourced from the "Upload
 * Component" section's Toast instance (node `1519:6185`, `type=
 * "SystemInfo"`), used by `DataExtractionOnboardingPage`'s "Files
 * uploaded!" confirmation.
 */
export const Solid: Story = {
  render: () => {
    function SolidDemo() {
      const { push } = useToast();
      return (
        <Button
          variant="default"
          onClick={() => push({ title: "Files uploaded!", tone: "celebration", variant: "solid" })}
        >
          Trigger a solid celebration toast
        </Button>
      );
    }
    return (
      <ToastProvider>
        <SolidDemo />
      </ToastProvider>
    );
  }
};

/** Every toast includes a keyboard-reachable close button, independent of the auto-dismiss timer. */
export const ManualDismiss: Story = {
  render: () => {
    function ManualDismissDemo() {
      const { push } = useToast();
      return (
        <Button
          variant="default"
          onClick={() =>
            push({
              title: "Dismiss me early",
              description: "Use the close button in the top-right corner, or press Tab to reach it.",
              tone: "warning"
            })
          }
        >
          Trigger a dismissible toast
        </Button>
      );
    }
    return (
      <ToastProvider>
        <ManualDismissDemo />
      </ToastProvider>
    );
  }
};
