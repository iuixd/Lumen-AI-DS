import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileUploadProgressList, type FileUploadFile } from "./FileUploadProgressList";

const meta = {
  title: "Composite/FileUploadProgressList",
  component: FileUploadProgressList,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The flat, per-file upload progress view that follows `FileUploadDropzone`. Sourced from Lumen-AI-Design-System nodes `1565:3140`/`1565:3298`/`1565:3337` (\"Upload Component\" section) — the three frames covering uploading, uploaded, and \"Creating your project\". Redesigned 2026-08-03 from an earlier accordion-grouped-by-category version once a fresh Figma pull confirmed all three states render one flat, ungrouped list."
      }
    }
  },
  args: { files: [] }
} satisfies Meta<typeof FileUploadProgressList>;

export default meta;
type Story = StoryObj<typeof meta>;

const uploadingFiles: FileUploadFile[] = [
  { id: "1", name: "msa-2026-northwind.pdf", sizeLabel: "412kb", status: "uploaded" },
  { id: "2", name: "sow-amendment-03.pdf", sizeLabel: "88kb", status: "uploading", progress: 62 },
  { id: "3", name: "vendor-agreement.pdf", sizeLabel: "1.2mb", status: "uploading", progress: 18 },
  { id: "4", name: "signature-page.png", sizeLabel: "204kb", status: "uploading", progress: 40 },
  { id: "5", name: "stamp.jpg", sizeLabel: "56kb", status: "uploaded" }
];

const completeFiles: FileUploadFile[] = uploadingFiles.map((f) => ({
  ...f,
  status: "uploaded" as const,
  progress: 100
}));

const mixedFiles: FileUploadFile[] = [
  { id: "1", name: "msa-2026-northwind.pdf", sizeLabel: "412kb", status: "uploaded" },
  { id: "2", name: "vendor-agreement.pdf", sizeLabel: "1.2mb", status: "uploaded" },
  {
    id: "3",
    name: "scanned-form.jpg",
    sizeLabel: "6.4mb",
    status: "error",
    errorType: "size-limit",
    onRetry: () => {}
  },
  {
    id: "4",
    name: "budget.xlsx",
    sizeLabel: "112kb",
    status: "error",
    errorType: "unsupported-type",
    onRetry: () => {}
  }
];

export const Uploading: Story = {
  render: () => (
    <div className="w-[538px] rounded-[var(--radius-2xl)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] p-[var(--spacing-40)]">
      <FileUploadProgressList files={uploadingFiles} primaryActionDisabled onCancel={() => {}} />
    </div>
  )
};

export const Uploaded: Story = {
  render: () => (
    <div className="w-[538px] rounded-[var(--radius-2xl)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] p-[var(--spacing-40)]">
      <FileUploadProgressList files={completeFiles} onCancel={() => {}} onPrimaryAction={() => {}} />
    </div>
  )
};

export const CreatingProjectDisabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "State 5 (`1565:3337`): every row dims and its remove control locks while the primary action is in flight — a new, first-of-its-kind pattern for this codebase (see the component docblock)."
      }
    }
  },
  render: () => (
    <div className="w-[538px] rounded-[var(--radius-2xl)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] p-[var(--spacing-40)]">
      <FileUploadProgressList files={completeFiles} primaryActionLoading onCancel={() => {}} />
    </div>
  )
};

export const MixedErrorsPartialSuccess: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Error/recovery states have zero Figma source — built from the interaction spec only, using this repo's existing `status.error` token and `WarningAmberOutlinedIcon`."
      }
    }
  },
  render: () => (
    <div className="w-[538px] rounded-[var(--radius-2xl)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] p-[var(--spacing-40)]">
      <FileUploadProgressList files={mixedFiles} primaryActionDisabled={false} onCancel={() => {}} onPrimaryAction={() => {}} />
    </div>
  )
};

export const ProjectCreationFailed: Story = {
  render: () => (
    <div className="w-[538px] rounded-[var(--radius-2xl)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] p-[var(--spacing-40)]">
      <FileUploadProgressList
        files={completeFiles}
        onCancel={() => {}}
        onPrimaryAction={() => {}}
        primaryActionErrorMessage="Something went wrong. Please try again."
        primaryActionLabel="Try again"
      />
    </div>
  )
};

/** Progress advances on a timer so the transition from "Loading" to "Uploaded" can be watched live. */
export const LiveProgress: Story = {
  render: function LiveProgressStory() {
    const [files, setFiles] = useState<FileUploadFile[]>(() =>
      uploadingFiles.map((f) => ({ ...f, status: "uploading" as const, progress: 0 }))
    );
    useEffect(() => {
      const timer = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.status === "uploading"
              ? f.progress! + 15 >= 100
                ? { ...f, status: "uploaded" as const, progress: 100 }
                : { ...f, progress: f.progress! + 15 }
              : f
          )
        );
      }, 300);
      return () => clearInterval(timer);
    }, []);
    const allDone = files.every((f) => f.status === "uploaded");
    return (
      <div className="w-[538px] rounded-[var(--radius-2xl)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] p-[var(--spacing-40)]">
        <FileUploadProgressList files={files} primaryActionDisabled={!allDone} onCancel={() => {}} onPrimaryAction={() => {}} />
      </div>
    );
  }
};
