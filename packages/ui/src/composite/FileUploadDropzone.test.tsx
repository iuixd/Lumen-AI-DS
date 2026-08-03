import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, file);
    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it("calls onFilesSelected when files are dropped on the dropzone", () => {
    const onFilesSelected = vi.fn();
    render(<FileUploadDropzone onFilesSelected={onFilesSelected} />);
    const dropzone = screen.getByRole("button", { name: /Click to upload/ });
    const file = makeFile("image.png", "image/png");
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    expect(onFilesSelected).toHaveBeenCalledWith([file]);
  });

  it("animates the header graphic when the dropzone is hovered, and reverts on mouse-leave", () => {
    render(<FileUploadDropzone />);
    const dropzone = screen.getByRole("button", { name: /Click to upload/ });
    const arrowGlyph = screen.getByTestId("header-upload-arrow-glyph");
    const tray = screen.getByTestId("header-upload-tray");
    const pdfFile = screen.getByTestId("header-pdf-file");
    const imageFile = screen.getByTestId("header-image-file");

    // The tray/bracket is its own element (a separate, Figma-sourced asset
    // from the arrow glyph) and never carries a translate class at all.
    expect(tray.className).not.toContain("translate");
    expect(arrowGlyph.className).toContain("translate-y-0");
    expect(pdfFile.className).toContain("translate-x-0");
    expect(pdfFile.className).toContain("rotate-[-19deg]");
    expect(imageFile.className).toContain("translate-x-0");
    expect(imageFile.className).toContain("rotate-[23deg]");

    fireEvent.mouseEnter(dropzone);
    expect(arrowGlyph.className).toContain("-translate-y-1.5");
    expect(tray.className).not.toContain("translate");
    // Icons converge toward each other on hover: PDF (left) pushes further
    // left, image (right) pushes further right, each easing back toward
    // level rotation.
    expect(pdfFile.className).toContain("-translate-y-1.5");
    expect(pdfFile.className).toContain("-translate-x-1.5");
    expect(pdfFile.className).toContain("rotate-[-9deg]");
    expect(imageFile.className).toContain("-translate-y-1.5");
    expect(imageFile.className).toContain("translate-x-1.5");
    expect(imageFile.className).toContain("rotate-[13deg]");

    fireEvent.mouseLeave(dropzone);
    expect(arrowGlyph.className).toContain("translate-y-0");
    expect(pdfFile.className).toContain("translate-x-0");
    expect(pdfFile.className).toContain("rotate-[-19deg]");
    expect(imageFile.className).toContain("translate-x-0");
    expect(imageFile.className).toContain("rotate-[23deg]");
  });

  it("does not call onFilesSelected when disabled", () => {
    const onFilesSelected = vi.fn();
    render(<FileUploadDropzone disabled onFilesSelected={onFilesSelected} />);
    const dropzone = document.querySelector('[aria-disabled="true"]') as HTMLElement;
    const file = makeFile("report.pdf");
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    expect(onFilesSelected).not.toHaveBeenCalled();
  });
});
