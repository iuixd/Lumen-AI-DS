import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileUploadDropzone } from "./FileUploadDropzone";

function makeFile(name: string, type = "application/pdf") {
  return new File(["contents"], name, { type });
}

describe("FileUploadDropzone", () => {
  it("renders the heading, subheading, and helper text", () => {
    render(<FileUploadDropzone />);
    expect(screen.getByRole("heading", { name: "Start by uploading 20+ files" })).toBeInTheDocument();
    expect(screen.getByText("to create a project for optimal results")).toBeInTheDocument();
    expect(screen.getByText("PDF, PNG, JPG or GIF (max. 3MB)")).toBeInTheDocument();
    expect(screen.getByLabelText("Upload files")).toHaveAttribute("type", "file");
    expect(screen.getByTestId("file-upload-zone").tagName).toBe("LABEL");
    expect(screen.queryByRole("button", { name: /Click to upload/ })).not.toBeInTheDocument();
  });

  it("renders custom copy when provided", () => {
    render(<FileUploadDropzone heading="Add your contracts" subheading="for extraction" helperText="PDF only" />);
    expect(screen.getByRole("heading", { name: "Add your contracts" })).toBeInTheDocument();
    expect(screen.getByText("for extraction")).toBeInTheDocument();
    expect(screen.getByText("PDF only")).toBeInTheDocument();
  });

  it("calls onFilesSelected when a file is chosen via the hidden input", async () => {
    const user = userEvent.setup();
    const onFilesSelected = vi.fn();
    render(<FileUploadDropzone onFilesSelected={onFilesSelected} />);
    const file = makeFile("report.pdf");
    const input = screen.getByLabelText("Upload files") as HTMLInputElement;
    await user.upload(input, file);
    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it("calls onFilesSelected when files are dropped on the dropzone", () => {
    const onFilesSelected = vi.fn();
    render(<FileUploadDropzone onFilesSelected={onFilesSelected} />);
    const dropzone = screen.getByTestId("file-upload-zone");
    const file = makeFile("image.png", "image/png");
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it("crossfades from the default header SVG to the animated SVG while the dropzone is hovered", async () => {
    render(<FileUploadDropzone />);
    const dropzone = screen.getByTestId("file-upload-zone");
    const defaultHeader = screen.getByTestId("header-default-asset");

    expect(defaultHeader).toHaveClass("opacity-100");
    expect(screen.queryByTestId("header-hover-asset")).not.toBeInTheDocument();

    fireEvent.mouseEnter(dropzone);
    fireEvent.load(screen.getByTestId("header-hover-asset"));
    await waitFor(() => expect(screen.getByTestId("header-hover-asset")).toHaveClass("opacity-100"));
    expect(defaultHeader).toHaveClass("opacity-0");

    fireEvent.mouseLeave(dropzone);
    expect(screen.getByTestId("header-hover-asset")).toHaveClass("opacity-0");
    expect(defaultHeader).toHaveClass("opacity-100");
  });

  describe("full-window drag overlay", () => {
    const fileDrag = () => ({ dataTransfer: { types: ["Files"], files: [] as File[] } });

    it("stays hidden at rest, shows while files are dragged over the window, and hides when they leave", () => {
      render(<FileUploadDropzone />);
      const overlay = screen.getByTestId("drag-mask");
      expect(overlay).toHaveAttribute("aria-hidden", "true");
      expect(overlay.parentElement).toBe(document.body);

      fireEvent.dragEnter(window, fileDrag());
      expect(overlay).toHaveAttribute("aria-hidden", "false");
      expect(screen.getByText("Drop your files like there's no limit!")).toBeInTheDocument();

      fireEvent.dragLeave(window, fileDrag());
      expect(overlay).toHaveAttribute("aria-hidden", "true");
    });

    it("stays visible while the drag crosses onto the dropzone card", () => {
      render(<FileUploadDropzone />);
      const dropzone = screen.getByTestId("file-upload-zone");
      fireEvent.dragEnter(window, fileDrag());
      fireEvent.dragEnter(dropzone, fileDrag());
      fireEvent.dragLeave(window, fileDrag());
      expect(screen.getByTestId("drag-mask")).toHaveAttribute("aria-hidden", "false");
    });

    it("accepts a drop anywhere on the window and hides the overlay", () => {
      const onFilesSelected = vi.fn();
      render(<FileUploadDropzone onFilesSelected={onFilesSelected} />);
      const file = makeFile("report.pdf");
      fireEvent.dragEnter(window, fileDrag());
      fireEvent.drop(window, { dataTransfer: { types: ["Files"], files: [file] } });
      expect(onFilesSelected).toHaveBeenCalledWith([file]);
      expect(screen.getByTestId("drag-mask")).toHaveAttribute("aria-hidden", "true");
    });

    it("hides the overlay and selects files once when the drop lands on the card", () => {
      const onFilesSelected = vi.fn();
      render(<FileUploadDropzone onFilesSelected={onFilesSelected} />);
      const dropzone = screen.getByTestId("file-upload-zone");
      const file = makeFile("report.pdf");
      fireEvent.dragEnter(window, fileDrag());
      fireEvent.dragEnter(dropzone, fileDrag());
      fireEvent.drop(dropzone, { dataTransfer: { types: ["Files"], files: [file] } });
      expect(onFilesSelected).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId("drag-mask")).toHaveAttribute("aria-hidden", "true");
    });

    it("ignores drags that don't carry files", () => {
      render(<FileUploadDropzone />);
      fireEvent.dragEnter(window, { dataTransfer: { types: ["text/plain"], files: [] } });
      expect(screen.getByTestId("drag-mask")).toHaveAttribute("aria-hidden", "true");
    });

    it("is not rendered when disabled or when dropOverlay is \"none\"", () => {
      const { unmount } = render(<FileUploadDropzone disabled />);
      fireEvent.dragEnter(window, fileDrag());
      expect(screen.getByTestId("drag-mask")).toHaveAttribute("aria-hidden", "true");
      unmount();

      render(<FileUploadDropzone dropOverlay="none" />);
      fireEvent.dragEnter(window, fileDrag());
      expect(screen.queryByTestId("drag-mask")).not.toBeInTheDocument();
    });
  });

  it("does not call onFilesSelected when disabled", () => {
    const onFilesSelected = vi.fn();
    render(<FileUploadDropzone disabled onFilesSelected={onFilesSelected} />);
    const dropzone = screen.getByTestId("file-upload-zone");
    const file = makeFile("report.pdf");
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    expect(onFilesSelected).not.toHaveBeenCalled();
  });
});
