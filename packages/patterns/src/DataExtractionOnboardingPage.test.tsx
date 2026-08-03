import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataExtractionOnboardingPage } from "./DataExtractionOnboardingPage";

function makeFile(name: string, type = "application/pdf") {
  return new File(["contents"], name, { type });
}

function selectFiles(files: File[]) {
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  fireEvent.change(input, { target: { files } });
}

describe("DataExtractionOnboardingPage", () => {
  it("renders the login step by default", () => {
    render(<DataExtractionOnboardingPage />);
    expect(screen.getByRole("heading", { name: /Welcome back/ })).toBeInTheDocument();
  });

  it("advances to the upload step once login completes via passkey", async () => {
    const user = userEvent.setup();
    render(<DataExtractionOnboardingPage loginProps={{ onStartPasskey: () => true }} />);
    await user.click(screen.getByRole("button", { name: "Continue with passkey" }));
    await waitFor(() => expect(screen.getByRole("heading", { name: /Start by uploading/ })).toBeInTheDocument());
  });

  it("renders selected files as a flat list and advances to the progress step", () => {
    render(<DataExtractionOnboardingPage initialStep="upload" />);
    selectFiles([makeFile("contract.pdf"), makeFile("signature.png", "image/png")]);
    expect(screen.getByRole("heading", { name: "Uploading files" })).toBeInTheDocument();
    expect(screen.getByText("contract.pdf")).toBeInTheDocument();
    expect(screen.getByText("signature.png")).toBeInTheDocument();
  });

  it("returns to the upload step when Cancel is clicked from the progress step", async () => {
    const user = userEvent.setup();
    render(<DataExtractionOnboardingPage initialStep="upload" />);
    selectFiles([makeFile("contract.pdf")]);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByRole("heading", { name: /Start by uploading/ })).toBeInTheDocument();
  });

  describe("simulated upload progress", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("advances every file to Uploaded and enables Create Project", async () => {
      render(<DataExtractionOnboardingPage initialStep="upload" />);
      selectFiles([makeFile("contract.pdf")]);

      const createProject = screen.getByRole("button", { name: "Create Project" });
      expect(createProject).toBeDisabled();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(3000);
      });

      expect(screen.getByText("Uploaded")).toBeInTheDocument();
      expect(createProject).not.toBeDisabled();
      expect(screen.getByRole("heading", { name: "Files uploaded successfully" })).toBeInTheDocument();
      expect(screen.getByText("Review uploaded 1 files before creating project.")).toBeInTheDocument();
    });

    it("calls onProjectCreated with the selected files when Create Project is clicked", async () => {
      const onProjectCreated = vi.fn();
      render(<DataExtractionOnboardingPage initialStep="upload" onProjectCreated={onProjectCreated} />);
      const file = makeFile("contract.pdf");
      selectFiles([file]);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(3000);
      });

      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Create Project" }));
      });
      expect(onProjectCreated).toHaveBeenCalledWith([file]);
    });

    it("keeps the 'Creating your project' screen visible even when onProjectCreated is omitted or resolves instantly", async () => {
      render(<DataExtractionOnboardingPage initialStep="upload" />);
      selectFiles([makeFile("contract.pdf")]);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(3000);
      });

      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Create Project" }));
      });

      // Without a minimum-visible-duration floor, createPhase would already
      // have flipped past "creating" by this point since there's no real
      // onProjectCreated to wait on — the exact bug reported.
      expect(screen.getByRole("heading", { name: "Creating your project" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Creating Project…" })).toBeInTheDocument();

      await act(async () => {
        await vi.advanceTimersByTimeAsync(600);
      });
      // Stays on the "creating" screen after success too — there's no next
      // screen for this pattern to move to, so reverting to the pre-click
      // state would read as the click having silently failed.
      expect(screen.getByRole("heading", { name: "Creating your project" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Creating Project…" })).toBeInTheDocument();
    });

    it("shows a recoverable error and 'Try again' when onProjectCreated rejects", async () => {
      const onProjectCreated = vi.fn().mockRejectedValue(new Error("Network error"));
      render(<DataExtractionOnboardingPage initialStep="upload" onProjectCreated={onProjectCreated} />);
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

  it("asks for confirmation before removing a file, and keeps it if cancelled", async () => {
    const user = userEvent.setup();
    render(<DataExtractionOnboardingPage initialStep="upload" />);
    selectFiles([makeFile("contract.pdf"), makeFile("signature.png", "image/png")]);

    await user.click(screen.getByRole("button", { name: "Remove contract.pdf" }));
    const dialog = screen.getByRole("dialog", { name: "Remove file?" });
    expect(within(dialog).getByText("contract.pdf")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Keep file" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("contract.pdf")).toBeInTheDocument();
    expect(screen.getByText("signature.png")).toBeInTheDocument();
  });

  it("removes a file once removal is confirmed, staying on the progress step if files remain", async () => {
    const user = userEvent.setup();
    render(<DataExtractionOnboardingPage initialStep="upload" />);
    selectFiles([makeFile("contract.pdf"), makeFile("signature.png", "image/png")]);

    await user.click(screen.getByRole("button", { name: "Remove contract.pdf" }));
    await user.click(screen.getByRole("button", { name: "Remove file" }));

    expect(screen.queryByText("contract.pdf")).not.toBeInTheDocument();
    expect(screen.getByText("signature.png")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Uploading files" })).toBeInTheDocument();
  });

  it("returns to the upload step once the last file is removed", async () => {
    const user = userEvent.setup();
    render(<DataExtractionOnboardingPage initialStep="upload" />);
    selectFiles([makeFile("contract.pdf")]);

    await user.click(screen.getByRole("button", { name: "Remove contract.pdf" }));
    await user.click(screen.getByRole("button", { name: "Remove file" }));

    expect(screen.getByRole("heading", { name: /Start by uploading/ })).toBeInTheDocument();
  });

  it("shows the full-page drag mask even when the drag starts directly over the dropzone card, not just the page background", () => {
    render(<DataExtractionOnboardingPage initialStep="upload" />);
    const dropzone = screen.getByRole("button", { name: /drag and drop/i });
    const dataTransfer = { types: ["Files"] };

    expect(screen.getByTestId("drag-mask")).toHaveAttribute("aria-hidden", "true");

    fireEvent.dragEnter(dropzone, { dataTransfer });
    expect(screen.getByTestId("drag-mask")).toHaveAttribute("aria-hidden", "false");

    fireEvent.dragLeave(dropzone, { dataTransfer });
    expect(screen.getByTestId("drag-mask")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders the upload and progress steps directly via initialStep, for preview/testing", () => {
    const { unmount } = render(<DataExtractionOnboardingPage initialStep="upload" />);
    expect(screen.getByRole("heading", { name: /Start by uploading/ })).toBeInTheDocument();
    unmount();
  });
});
