import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";
import { Button } from "../components/button/Button";

const meta = {
  title: "Composite/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Dependency-free modal (Escape to close, backdrop click to close, no strict focus trap). Swap for Radix Dialog if strict focus trapping/portal behavior is required — keep the same props contract."
      }
    },
    controls: { disable: true }
  },
  // This story drives `open` from local state in a custom `render` below, so
  // these args are unused placeholders — only present to satisfy Modal's
  // required-props type.
  args: { open: false, onClose: () => {}, title: "Delete this record?", children: null }
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Delete record</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Delete this record?"
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              {/* Figma's Buttons page has no distinct destructive/error type — tint Secondary
                  with the status-error token as a manual override until design adds one. */}
              <Button
                variant="secondary"
                className="border-[var(--color-status-error)] text-[var(--color-status-error)] hover:bg-[var(--color-status-error-subtle)]"
                onClick={() => setOpen(false)}
              >
                Delete
              </Button>
            </>
          }
        >
          This action can&apos;t be undone. The record and its history will be permanently removed.
        </Modal>
      </>
    );
  }
};
