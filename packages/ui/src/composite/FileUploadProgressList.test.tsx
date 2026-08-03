import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileUploadProgressList, type FileUploadFile } from "./FileUploadProgressList";

const files: FileUploadFile[] = [
  { id: "1", name: "msa.pdf", sizeLabel: "412kb", status: "uploaded" },
  { id: "2", name: "sow.pdf", sizeLabel: "88kb", status: "uploading", progress: 40 }
];

const uploadedFiles: FileUploadFile[] = [
  { id: "1", name: "msa.pdf", sizeLabel: "412kb", status: "uploaded" },
  { id: "2", name: "sow.pdf", sizeLabel: "88kb", status: "uploaded" }
];

describe("FileUploadProgressList", () => {
  it("renders the computed 'uploading' heading/subheading, no grouping", () => {
    render(<FileUploadProgressList files={files} />);
    expect(screen.getByRole("heading", { name: "Uploading files" })).toBeInTheDocument();
    expect(screen.getByText("Track each file as the upload moves forward.")).toBeInTheDocument();
    expect(screen.queryByText("Documents")).not.toBeInTheDocument();
  });

  it("renders the computed 'uploaded' heading with a live file count", () => {
    render(<FileUploadProgressList files={uploadedFiles} />);
    expect(screen.getByRole("heading", { name: "Files uploaded successfully" })).toBeInTheDocument();
    expect(screen.getByText("Review uploaded 2 files before creating project.")).toBeInTheDocument();
  });

  it("renders the computed 'creating' heading when primaryActionLoading", () => {
    render(<FileUploadProgressList files={uploadedFiles} primaryActionLoading />);
    expect(screen.getByRole("heading", { name: "Creating your project" })).toBeInTheDocument();
    expect(screen.getByText("Please wait while your project is being created.")).toBeInTheDocument();
  });

  it("renders each file's name, size, and status", () => {
    render(<FileUploadProgressList files={files} />);
    expect(screen.getByText("msa.pdf")).toBeInTheDocument();
    expect(screen.getByText("Uploaded")).toBeInTheDocument();
    expect(screen.getByText("sow.pdf")).toBeInTheDocument();
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("calls onRemoveFile with the file id", async () => {
    const user = userEvent.setup();
    const onRemoveFile = vi.fn();
    render(<FileUploadProgressList files={files} onRemoveFile={onRemoveFile} />);
    await user.click(screen.getByRole("button", { name: "Remove msa.pdf" }));
    expect(onRemoveFile).toHaveBeenCalledWith("1");
  });

  it("calls onCancel and onPrimaryAction from the footer actions", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onPrimaryAction = vi.fn();
    render(<FileUploadProgressList files={files} onCancel={onCancel} onPrimaryAction={onPrimaryAction} />);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledOnce();
    await user.click(screen.getByRole("button", { name: "Create Project" }));
    expect(onPrimaryAction).toHaveBeenCalledOnce();
  });

  it("shows the disabled 'Creating Project…' state and hides the normal label", () => {
    render(<FileUploadProgressList files={files} primaryActionLoading />);
    const button = screen.getByRole("button", { name: /Creating Project/ });
    expect(button).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Create Project" })).not.toBeInTheDocument();
  });

  it("disables the primary action when primaryActionDisabled is set", () => {
    render(<FileUploadProgressList files={files} primaryActionDisabled />);
    expect(screen.getByRole("button", { name: "Create Project" })).toBeDisabled();
  });

  it("locks file removal while primaryActionLoading is true", () => {
    render(<FileUploadProgressList files={uploadedFiles} primaryActionLoading />);
    expect(screen.getByRole("button", { name: "Remove msa.pdf" })).toBeDisabled();
  });

  it("shows a success checkmark once every file is uploaded", () => {
    const { container } = render(<FileUploadProgressList files={uploadedFiles} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders an error row with its message and a Retry affordance", () => {
    const onRetry = vi.fn();
    const errorFiles: FileUploadFile[] = [
      { id: "1", name: "big.jpg", sizeLabel: "6mb", status: "error", errorType: "size-limit", onRetry }
    ];
    render(<FileUploadProgressList files={errorFiles} />);
    expect(screen.getByText("File exceeds 3MB limit")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry big.jpg" })).toBeInTheDocument();
  });

  it("shows a partial-success banner when some files errored and some uploaded", () => {
    const partial: FileUploadFile[] = [
      { id: "1", name: "ok.pdf", sizeLabel: "1kb", status: "uploaded" },
      { id: "2", name: "bad.pdf", sizeLabel: "1kb", status: "error", errorType: "corrupted" }
    ];
    render(<FileUploadProgressList files={partial} />);
    expect(screen.getByText(/1 files are ready\. 1 files need attention\./)).toBeInTheDocument();
  });

  it("shows the primary-action error banner when primaryActionErrorMessage is set", () => {
    render(
      <FileUploadProgressList
        files={uploadedFiles}
        primaryActionErrorMessage="Something went wrong. Please try again."
      />
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong. Please try again.");
  });
});
