import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, fireEvent, waitFor } from "@testing-library/react";
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

  it("groups selected files by category and advances to the progress step", () => {
    render(<DataExtractionOnboardingPage initialStep="upload" />);
    selectFiles([makeFile("contract.pdf"), makeFile("signature.png", "image/png")]);
    expect(screen.getByRole("heading", { name: "Group files by document type" })).toBeInTheDocument();
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("Images")).toBeInTheDocument();
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
  });

  it("renders the upload and progress steps directly via initialStep, for preview/testing", () => {
    const { unmount } = render(<DataExtractionOnboardingPage initialStep="upload" />);
    expect(screen.getByRole("heading", { name: /Start by uploading/ })).toBeInTheDocument();
    unmount();
  });
});
