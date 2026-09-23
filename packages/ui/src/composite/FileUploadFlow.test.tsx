import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileUploadFlow } from "./FileUploadFlow";

function makeFile(name: string, type = "application/pdf") {
  return new File(["contents"], name, { type });
}

function selectFiles(files: File[]) {
  fireEvent.change(screen.getByLabelText("Upload files"), { target: { files } });
}

const fileDrag = (files: File[] = []) => ({ dataTransfer: { types: ["Files"], files } });

describe("FileUploadFlow", () => {
  it("starts on the dropzone with the drag overlay hidden", () => {
    render(<FileUploadFlow />);
    expect(screen.getByRole("heading", { name: "Start by uploading 20+ files" })).toBeInTheDocument();
    expect(screen.getByTestId("drag-mask")).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards dropzone copy", () => {
    render(<FileUploadFlow dropzoneProps={{ heading: "Add your contracts" }} />);
    expect(screen.getByRole("heading", { name: "Add your contracts" })).toBeInTheDocument();
  });

  it("shows the overlay while dragging and starts uploading when files are dropped anywhere", () => {
    render(<FileUploadFlow />);
    fireEvent.dragEnter(window, fileDrag());
    expect(screen.getByTestId("drag-mask")).toHaveAttribute("aria-hidden", "false");

    fireEvent.drop(window, fileDrag([makeFile("contract.pdf")]));
    expect(screen.getByTestId("drag-mask")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("heading", { name: "Uploading files" })).toBeInTheDocument();
    expect(screen.getByText("contract.pdf")).toBeInTheDocument();
  });

  it("starts uploading when files are dropped on the card", () => {
    render(<FileUploadFlow />);
    fireEvent.drop(screen.getByTestId("file-upload-zone"), fileDrag([makeFile("contract.pdf")]));
    expect(screen.getByRole("heading", { name: "Uploading files" })).toBeInTheDocument();
  });

  it("returns to the dropzone when Cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<FileUploadFlow />);
    selectFiles([makeFile("contract.pdf")]);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByRole("heading", { name: "Start by uploading 20+ files" })).toBeInTheDocument();
  });

  it("confirms before removing a file and returns to the dropzone once the last one is removed", async () => {
    const user = userEvent.setup();
    render(<FileUploadFlow />);
    selectFiles([makeFile("contract.pdf"), makeFile("signature.png", "image/png")]);

    await user.click(screen.getByRole("button", { name: "Remove contract.pdf" }));
    await user.click(screen.getByRole("button", { name: "Remove file" }));
    expect(screen.queryByText("contract.pdf")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Uploading files" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Remove signature.png" }));
    await user.click(screen.getByRole("button", { name: "Remove file" }));
    expect(screen.getByRole("heading", { name: "Start by uploading 20+ files" })).toBeInTheDocument();
  });

  describe("simulated upload progress", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("keeps Create Project disabled while uploading, then moves to Uploaded and enables it", async () => {
      render(<FileUploadFlow />);
      selectFiles([makeFile("contract.pdf")]);
      const createProject = screen.getByRole("button", { name: "Create Project" });
      expect(createProject).toBeDisabled();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(3000);
      });

      expect(screen.getByRole("heading", { name: "Files uploaded successfully" })).toBeInTheDocument();
      expect(createProject).not.toBeDisabled();
      expect(screen.getByText("Files uploaded!")).toBeInTheDocument();
    });

    it("calls onProjectCreated with the selected files and holds the creating state", async () => {
      const onProjectCreated = vi.fn();
      render(<FileUploadFlow onProjectCreated={onProjectCreated} />);
      const file = makeFile("contract.pdf");
      selectFiles([file]);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(3000);
      });
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Create Project" }));
      });
      expect(onProjectCreated).toHaveBeenCalledWith([file]);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(600);
      });
      expect(screen.getByRole("heading", { name: "Creating your project" })).toBeInTheDocument();
    });

    it("shows a recoverable error when onProjectCreated rejects", async () => {
      render(<FileUploadFlow onProjectCreated={vi.fn().mockRejectedValue(new Error("Network error"))} />);
      selectFiles([makeFile("contract.pdf")]);
      await act(async () => {
        await vi.advanceTimersByTimeAsync(3000);
      });
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Create Project" }));
      });
      expect(screen.getByRole("alert")).toHaveTextContent("Network error");
      expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    });
  });
});
