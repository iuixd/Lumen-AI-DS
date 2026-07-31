import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileUploadProgressList, type FileUploadGroupData } from "./FileUploadProgressList";

const meta = {
  title: "Composite/FileUploadProgressList",
  component: FileUploadProgressList,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The accordion-grouped, per-file upload progress view that follows `FileUploadDropzone`. Sourced from Lumen-AI-Design-System nodes `1518:3766`/`1518:5832`/`1518:6065` (\"Upload Component\" section) — the same three frames covering uploading, complete, and the \"Creating Project…\" loading state."
      }
    }
  },
  args: { groups: [] }
} satisfies Meta<typeof FileUploadProgressList>;

export default meta;
type Story = StoryObj<typeof meta>;

const uploadingGroups: FileUploadGroupData[] = [
  {
    id: "documents",
    name: "Documents",
    files: [
      { id: "1", name: "msa-2026-northwind.pdf", sizeLabel: "412kb", status: "uploaded" },
      { id: "2", name: "sow-amendment-03.pdf", sizeLabel: "88kb", status: "uploading", progress: 62 },
      { id: "3", name: "vendor-agreement.pdf", sizeLabel: "1.2mb", status: "uploading", progress: 18 }
    ]
  },
  {
    id: "images",
    name: "Images",
    files: [
      { id: "4", name: "signature-page.png", sizeLabel: "204kb", status: "uploading", progress: 40 },
      { id: "5", name: "stamp.jpg", sizeLabel: "56kb", status: "uploaded" }
    ]
  }
];

const completeGroups: FileUploadGroupData[] = uploadingGroups.map((g) => ({
  ...g,
  files: g.files.map((f) => ({ ...f, status: "uploaded" as const, progress: 100 }))
}));

export const Uploading: Story = {
  render: () => (
    <div className="w-[538px] rounded-[var(--radius-2xl)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] p-[var(--spacing-40)]">
      <FileUploadProgressList groups={uploadingGroups} primaryActionDisabled onCancel={() => {}} />
    </div>
  )
};

export const Complete: Story = {
  render: () => (
    <div className="w-[538px] rounded-[var(--radius-2xl)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] p-[var(--spacing-40)]">
      <FileUploadProgressList groups={completeGroups} onCancel={() => {}} onPrimaryAction={() => {}} />
    </div>
  )
};

export const CreatingProject: Story = {
  render: () => (
    <div className="w-[538px] rounded-[var(--radius-2xl)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] p-[var(--spacing-40)]">
      <FileUploadProgressList groups={completeGroups} primaryActionLoading onCancel={() => {}} />
    </div>
  )
};

/** Progress advances on a timer so the transition from "Loading" to "Uploaded" — and the group header's aggregate bar — can be watched live. */
export const LiveProgress: Story = {
  render: function LiveProgressStory() {
    const [groups, setGroups] = useState<FileUploadGroupData[]>(() =>
      uploadingGroups.map((g) => ({ ...g, files: g.files.map((f) => ({ ...f, status: "uploading" as const, progress: 0 })) }))
    );
    useEffect(() => {
      const timer = setInterval(() => {
        setGroups((prev) =>
          prev.map((g) => ({
            ...g,
            files: g.files.map((f) =>
              f.status === "uploading"
                ? f.progress! + 15 >= 100
                  ? { ...f, status: "uploaded" as const, progress: 100 }
                  : { ...f, progress: f.progress! + 15 }
                : f
            )
          }))
        );
      }, 300);
      return () => clearInterval(timer);
    }, []);
    const allDone = groups.every((g) => g.files.every((f) => f.status === "uploaded"));
    return (
      <div className="w-[538px] rounded-[var(--radius-2xl)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] p-[var(--spacing-40)]">
        <FileUploadProgressList groups={groups} primaryActionDisabled={!allDone} onCancel={() => {}} onPrimaryAction={() => {}} />
      </div>
    );
  }
};
