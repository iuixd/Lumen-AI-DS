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
          "Wrap the app root in `<ToastProvider>` once, then call `useToast().push({ title, description, tone })` from anywhere. Toasts auto-dismiss after 5s."
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
      <Button variant="ghost" onClick={() => push({ title: "Saved", tone: "success" })}>
        Trigger success
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          push({
            title: "Something went wrong",
            description: "Try again in a moment.",
            tone: "error"
          })
        }
      >
        Trigger error
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
