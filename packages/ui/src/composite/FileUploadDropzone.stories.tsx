import type { Meta, StoryObj } from "@storybook/react";
import { FileUploadDropzone } from "./FileUploadDropzone";
import { FileUploadFlow } from "./FileUploadFlow";

const meta = {
  title: "Composite/FileUploadDropzone",
  component: FileUploadDropzone,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The idle-state file-upload card: gradient header with an overlapping file-icon cluster, a heading/subheading, and a dashed dropzone supporting click-to-browse and drag-and-drop. Hovering the File Upload Zone crossfades the header to the supplied animated SVG and restores the default SVG on exit. Sourced from Lumen-AI-Design-System node `1874:392`. Dragging files anywhere over the window shows the full-viewport violet `FileDropOverlay` (the same one `DataExtractionOnboardingPage` uses) and accepts a drop anywhere; `dropOverlay=\"none\"` limits drag feedback to the card itself."
      }
    }
  },
  args: {
    onFilesSelected: (files) => console.log("files selected", files)
  }
} satisfies Meta<typeof FileUploadDropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-[500px]">
      <FileUploadDropzone {...args} />
    </div>
  )
};

export const CustomCopy: Story = {
  args: {
    heading: "Add your contracts",
    subheading: "to start extracting key terms automatically",
    helperText: "PDF only (max. 25MB)",
    accept: "application/pdf"
  },
  render: (args) => (
    <div className="w-[500px]">
      <FileUploadDropzone {...args} />
    </div>
  )
};

/**
 * The dropzone inside `FileUploadFlow` — the full working journey: drop or
 * browse → Uploading → Uploaded → Create Project. The dropzone on its own
 * only reports selected files through `onFilesSelected`.
 */
export const WithUploadFlow: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex min-h-screen items-center justify-center p-[var(--spacing-32)]">
      <div className="w-full">
        <FileUploadFlow onProjectCreated={(files) => console.log("Project created with", files.length, "files")} />
      </div>
    </div>
  )
};

/** Drag feedback limited to the card — for pages that render their own `FileDropOverlay` or host several dropzones. */
export const CardOnlyDrop: Story = {
  args: { dropOverlay: "none" },
  render: (args) => (
    <div className="w-[500px]">
      <FileUploadDropzone {...args} />
    </div>
  )
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="w-[500px]">
      <FileUploadDropzone {...args} />
    </div>
  )
};
