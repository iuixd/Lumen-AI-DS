import type { Meta, StoryObj } from "@storybook/react";
import { FileUploadFlow } from "./FileUploadFlow";

const meta = {
  title: "Composite/FileUploadFlow",
  component: FileUploadFlow,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The working upload journey: `FileUploadDropzone` → full-window violet `FileDropOverlay` while dragging → drop or browse → `FileUploadProgressList` \"Uploading files\" with per-file progress → \"Files uploaded successfully\" → Create Project (disabled until every file finishes). Remove asks for confirmation; Cancel returns to the dropzone. Progress is simulated on a timer — `onProjectCreated` is the integration point. `DataExtractionOnboardingPage` renders this after its login step."
      }
    }
  },
  args: {
    onProjectCreated: (files: File[]) => console.log("Project created with", files.length, "files")
  },
  render: (args) => (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background-app)] p-[var(--spacing-32)]">
      <div className="w-full">
        <FileUploadFlow {...args} />
      </div>
    </div>
  )
} satisfies Meta<typeof FileUploadFlow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Drag a file from your desktop anywhere over the canvas, or click the dropzone to browse. */
export const Playground: Story = {};

/** `onProjectCreated` rejects — shows the inline error and "Try again" after Create Project. */
export const ProjectCreationFails: Story = {
  args: {
    onProjectCreated: () => Promise.reject(new Error("We couldn't create your project. Please try again."))
  }
};
