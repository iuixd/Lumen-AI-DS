import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileUploadProgressList, type FileUploadGroupData } from "./FileUploadProgressList";

const groups: FileUploadGroupData[] = [
  {
    id: "documents",
    name: "Documents",
    files: [
      { id: "1", name: "msa.pdf", sizeLabel: "412kb", status: "uploaded" },
      { id: "2", name: "sow.pdf", sizeLabel: "88kb", status: "uploading", progress: 40 }
    ]
  }
];

describe("FileUploadProgressList", () => {
  it("renders the heading, group name, and file count", () => {
    render(<FileUploadProgressList groups={groups} />);
    expect(screen.getByRole("heading", { name: "Group files by document type" })).toBeInTheDocument();
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("2 Files")).toBeInTheDocument();
  });

  it("renders each file's name, size, and status", () => {
    render(<FileUploadProgressList groups={groups} />);
    expect(screen.getByText("msa.pdf")).toBeInTheDocument();
    expect(screen.getByText("Uploaded")).toBeInTheDocument();
    expect(screen.getByText("sow.pdf")).toBeInTheDocument();
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("calls onRemoveFile with the group and file id", async () => {
    const user = userEvent.setup();
    const onRemoveFile = vi.fn();
    render(<FileUploadProgressList groups={groups} onRemoveFile={onRemoveFile} />);
    await user.click(screen.getByRole("button", { name: "Remove msa.pdf" }));
    expect(onRemoveFile).toHaveBeenCalledWith("documents", "1");
  });

  it("calls onCancel and onPrimaryAction from the footer actions", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onPrimaryAction = vi.fn();
    render(<FileUploadProgressList groups={groups} onCancel={onCancel} onPrimaryAction={onPrimaryAction} />);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledOnce();
    await user.click(screen.getByRole("button", { name: "Create Project" }));
    expect(onPrimaryAction).toHaveBeenCalledOnce();
  });

  it("shows the disabled 'Creating Project…' state and hides the normal label", () => {
    render(<FileUploadProgressList groups={groups} primaryActionLoading />);
    const button = screen.getByRole("button", { name: /Creating Project/ });
    expect(button).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Create Project" })).not.toBeInTheDocument();
  });

  it("disables the primary action when primaryActionDisabled is set", () => {
    render(<FileUploadProgressList groups={groups} primaryActionDisabled />);
    expect(screen.getByRole("button", { name: "Create Project" })).toBeDisabled();
  });
});
