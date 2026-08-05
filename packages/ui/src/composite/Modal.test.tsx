import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("renders nothing when closed", () => {
    render(<Modal open={false} onOpenChange={vi.fn()} title="Remove file?" />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the dialog with its title and description when open", () => {
    render(
      <Modal open onOpenChange={vi.fn()} title="Remove file?" description="This can't be undone." />
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Remove file?")).toBeInTheDocument();
    expect(screen.getByText("This can't be undone.")).toBeInTheDocument();
  });

  it("renders without a description when omitted", () => {
    render(<Modal open onOpenChange={vi.fn()} title="Remove file?" />);
    expect(screen.getByText("Remove file?")).toBeInTheDocument();
  });

  it("renders the actions slot when provided", () => {
    render(
      <Modal
        open
        onOpenChange={vi.fn()}
        title="Remove file?"
        actions={<button type="button">Remove file</button>}
      />
    );
    expect(screen.getByRole("button", { name: "Remove file" })).toBeInTheDocument();
  });

  it("calls onOpenChange(false) on Escape", async () => {
    const onOpenChange = vi.fn();
    render(<Modal open onOpenChange={onOpenChange} title="Remove file?" />);
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange(false) on close-button click", async () => {
    const onOpenChange = vi.fn();
    render(<Modal open onOpenChange={onOpenChange} title="Remove file?" />);
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
