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
          "Figma's canonical \"Modal\" component (Lumen-AI-Design-System nodes 1737:4152/1737:4154 \"Modal\"/\"Modal Mask\"). A thin composite over `Dialog` — title, optional description, and an optional right-aligned actions row below a separator. Controlled: this component owns no open state of its own."
      }
    },
    controls: { disable: true }
  },
  // This story drives `open` from local state in each custom `render` below,
  // so these args are unused placeholders — only present to satisfy Modal's
  // required-props type.
  args: { open: false, onOpenChange: () => {}, title: "Remove file?" }
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma's own example content for this component, verbatim. */
export const Playground: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Remove file</Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          title="Remove file?"
          description={
            <>
              Remove <strong>photo.jpg</strong> from this upload? This can&apos;t be undone.
            </>
          }
          actions={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Keep file
              </Button>
              <Button variant="destructive" onClick={() => setOpen(false)}>
                Remove file
              </Button>
            </>
          }
        />
      </>
    );
  }
};

/** No `actions` — the footer separator omits itself along with it. */
export const TitleAndDescriptionOnly: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Show info</Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          title="Upload complete"
          description="All 20 files were uploaded successfully."
        />
      </>
    );
  }
};

/** No `description` either — a title-only modal. */
export const TitleOnly: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Confirm</Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          title="Are you sure?"
          actions={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </>
          }
        />
      </>
    );
  }
};
