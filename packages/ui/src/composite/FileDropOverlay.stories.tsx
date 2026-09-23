import type { Meta, StoryObj } from "@storybook/react";
import { FileDropOverlay, useWindowFileDrag } from "./FileDropOverlay";

const meta = {
  title: "Composite/FileDropOverlay",
  component: FileDropOverlay,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The full-viewport violet \"drop your files anywhere\" surface (Figma node `1565:3375`), portaled to `document.body`. `FileUploadDropzone` renders it by default; pair it with `useWindowFileDrag` when a page needs its own. Decorative — it is `aria-hidden` and never takes pointer events."
      }
    }
  },
  args: { visible: true, pulsing: false }
} satisfies Meta<typeof FileDropOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Static visible state — toggle `visible` to see the scale-in/out transition. */
export const Playground: Story = {
  render: (args) => (
    <div className="h-screen">
      <FileDropOverlay {...args} />
    </div>
  )
};

/** Wired to `useWindowFileDrag` — drag a file from your desktop over the canvas. */
export const WithWindowDrag: Story = {
  args: { visible: false },
  render: function Render() {
    const drag = useWindowFileDrag({ enabled: true, onDrop: (files) => console.log("files dropped", files) });
    return (
      <div className="flex h-screen items-center justify-center text-body-md text-[var(--color-text-secondary)]">
        Drag a file over this window
        <FileDropOverlay visible={drag.isDragging} pulsing={drag.isDropping} />
      </div>
    );
  }
};
