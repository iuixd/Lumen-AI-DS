import type { Meta, StoryObj } from "@storybook/react";
import { FileUploadDropzone } from "./FileUploadDropzone";

const meta = {
  title: "Composite/FileUploadDropzone",
  component: FileUploadDropzone,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The idle-state file-upload card: gradient header with an overlapping file-icon cluster, a heading/subheading, and a dashed dropzone supporting click-to-browse and drag-and-drop. Hovering the File Upload Zone crossfades the header to the supplied animated SVG and restores the default SVG on exit. Sourced from Lumen-AI-Design-System node `1874:392`. Only tracks drag state over its own area — see `DataExtractionOnboardingPage` for the full-viewport \"drop anywhere\" overlay layered on top."
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

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="w-[500px]">
      <FileUploadDropzone {...args} />
    </div>
  )
};
