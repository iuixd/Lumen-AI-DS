import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, screen, renderHook, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider, useToast, type ToastItem } from "./Toast";

function wrapper({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}

describe("Toast", () => {
  it("throws when useToast is used outside a ToastProvider", () => {
    const { result } = renderHook(() => {
      try {
        useToast();
        return null;
      } catch (error) {
        return error as Error;
      }
    });
    expect(result.current).toBeInstanceOf(Error);
  });

  it("renders a pushed toast's title and description with role=status", () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.push({ title: "Saved", description: "3 records updated", tone: "success" });
    });

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("3 records updated")).toBeInTheDocument();
  });

  describe.each<{ tone: ToastItem["tone"]; hasDefaultIcon: boolean }>([
    { tone: "info", hasDefaultIcon: true },
    { tone: "warning", hasDefaultIcon: true },
    { tone: "error", hasDefaultIcon: true },
    { tone: "success", hasDefaultIcon: false },
    { tone: "neutral", hasDefaultIcon: false },
    { tone: "celebration", hasDefaultIcon: true }
  ])("tone=$tone", ({ tone, hasDefaultIcon }) => {
    it(`${hasDefaultIcon ? "renders" : "omits"} a default status icon (Figma-evidenced tones only)`, () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      act(() => {
        result.current.push({ title: "Message", tone });
      });

      const status = screen.getByRole("status");
      const icon = status.querySelector('[aria-hidden="true"] svg');
      if (hasDefaultIcon) {
        expect(icon).not.toBeNull();
      } else {
        expect(icon).toBeNull();
      }
    });
  });

  it("renders a caller-supplied icon regardless of tone", () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.push({
        title: "Message",
        tone: "neutral",
        icon: <span data-testid="custom-icon" />
      });
    });
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("renders the solid variant with a filled background instead of a left-border accent", () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.push({ title: "Files uploaded!", tone: "celebration", variant: "solid" });
    });
    const status = screen.getByRole("status");
    expect(status).toHaveStyle({ background: "var(--color-background-toaster-systeminfo-bg)" });
    expect(status.style.borderLeftWidth).toBe("");
  });

  it("provides an accessible, keyboard-reachable close button that dismisses the toast", async () => {
    const user = userEvent.setup();
    const { result } = renderHook(() => useToast(), { wrapper });
    act(() => {
      result.current.push({ title: "Dismiss me" });
    });

    const closeButton = screen.getByRole("button", { name: "Dismiss notification" });
    expect(closeButton).toBeInTheDocument();
    await user.click(closeButton);
    // Dismiss now defers the actual unmount by `--duration-moderate` (200ms)
    // to let the exit fade play, rather than removing the toast instantly.
    await waitFor(() => expect(screen.queryByText("Dismiss me")).not.toBeInTheDocument());
  });

  describe("auto-dismiss timing", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("auto-dismisses after the 6-second toast duration", () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      act(() => {
        result.current.push({ title: "Times out" });
      });
      expect(screen.getByText("Times out")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(5999);
      });
      expect(screen.getByText("Times out")).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      // Exit-fade defer: the toast unmounts `--duration-moderate` (200ms)
      // after the dismiss timer fires, not on the same tick.
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(screen.queryByText("Times out")).not.toBeInTheDocument();
    });

    it("pauses the dismiss timer on hover and resumes on mouse leave", () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      act(() => {
        result.current.push({ title: "Hover pauses me" });
      });

      const status = screen.getByRole("status");
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      fireEvent.mouseEnter(status);

      // Fully past the original 6s mark, but paused for the last 3s of it —
      // should still be present.
      act(() => {
        vi.advanceTimersByTime(4000);
      });
      expect(screen.getByText("Hover pauses me")).toBeInTheDocument();

      fireEvent.mouseLeave(status);
      // ~3s remained when paused.
      act(() => {
        vi.advanceTimersByTime(2999);
      });
      expect(screen.getByText("Hover pauses me")).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(1);
      });
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(screen.queryByText("Hover pauses me")).not.toBeInTheDocument();
    });

    it("pauses the dismiss timer on keyboard focus and resumes on blur", () => {
      const { result } = renderHook(() => useToast(), { wrapper });
      act(() => {
        result.current.push({ title: "Focus pauses me" });
      });

      const status = screen.getByRole("status");
      fireEvent.focus(status);
      act(() => {
        vi.advanceTimersByTime(6000);
      });
      expect(screen.getByText("Focus pauses me")).toBeInTheDocument();

      fireEvent.blur(status);
      act(() => {
        vi.advanceTimersByTime(6000);
      });
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(screen.queryByText("Focus pauses me")).not.toBeInTheDocument();
    });
  });
});
