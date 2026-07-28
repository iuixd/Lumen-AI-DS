import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContentState } from "./ContentState";

describe("ContentState", () => {
  describe("empty", () => {
    it("is the default state and renders title, description, icon slot and action slot", () => {
      render(
        <ContentState
          title="No projects yet"
          description="Create your first project to get started."
          icon={<span data-testid="custom-icon" />}
          action={<button type="button">New project</button>}
        />
      );
      expect(screen.getByText("No projects yet")).toBeInTheDocument();
      expect(screen.getByText("Create your first project to get started.")).toBeInTheDocument();
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "New project" })).toBeInTheDocument();
    });

    it("falls back to Figma's outlined-square glyph when no icon is given, so the badge is never blank", () => {
      const { container } = render(<ContentState title="No projects yet" />);
      const badge = container.querySelector("[aria-hidden]");
      expect(badge).not.toBeNull();
      expect(badge?.firstElementChild).toHaveStyle({
        borderWidth: "var(--content-state-empty-glyph-border-width)"
      });
    });

    it("carries no live-region semantics — an empty result is expected, not interruptive", () => {
      render(<ContentState title="No projects yet" />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("uses the tertiary text role for its description, per Figma's text/tertiary binding", () => {
      render(<ContentState title="No projects yet" description="Some copy." />);
      expect(screen.getByText("Some copy.")).toHaveClass("text-[var(--color-text-tertiary)]");
    });
  });

  describe("error", () => {
    it("exposes role=alert so a load failure is announced without being requested", () => {
      render(<ContentState state="error" title="Something went wrong" />);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("renders the error title, description and action", () => {
      render(
        <ContentState
          state="error"
          title="Something went wrong"
          description="We couldn't load this page."
          action={<button type="button">Try again</button>}
        />
      );
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
      expect(screen.getByText("We couldn't load this page.")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    });

    it("tints the badge with the error status roles rather than the empty state's neutral roles", () => {
      const { container } = render(<ContentState state="error" title="Something went wrong" />);
      const badge = container.querySelector("[aria-hidden]");
      expect(badge).toHaveClass("bg-[var(--color-status-error-subtle)]");
      expect(badge).toHaveClass("text-[var(--color-status-error)]");
    });

    it("uses the secondary text role for its description, a step darker than the empty state's", () => {
      render(<ContentState state="error" title="Something went wrong" description="Some copy." />);
      expect(screen.getByText("Some copy.")).toHaveClass("text-[var(--color-text-secondary)]");
    });
  });

  describe("loading", () => {
    it("announces itself through a polite, busy live region", () => {
      render(<ContentState state="loading" />);
      const region = screen.getByRole("status");
      expect(region).toHaveAttribute("aria-live", "polite");
      expect(region).toHaveAttribute("aria-busy", "true");
    });

    it("names the wait with a default label, overridable for the specific content", () => {
      const { unmount } = render(<ContentState state="loading" />);
      expect(screen.getByText("Loading content")).toBeInTheDocument();
      unmount();
      render(<ContentState state="loading" loadingLabel="Loading projects" />);
      expect(screen.getByText("Loading projects")).toBeInTheDocument();
    });

    it("hides every placeholder bar from assistive tech, leaving only the label to read", () => {
      const { container } = render(<ContentState state="loading" />);
      const bars = container.querySelectorAll(".lumen-skeleton-pulse");
      expect(bars.length).toBeGreaterThan(0);
      bars.forEach((bar) => expect(bar).toHaveAttribute("aria-hidden", "true"));
    });

    it("renders Figma's default skeleton anatomy — title, subtitle, 3 cards, 3 rows", () => {
      const { container } = render(<ContentState state="loading" />);
      // 1 title + 1 subtitle + (3 cards x 3 bars) + (3 rows x 4 bars) = 23
      expect(container.querySelectorAll(".lumen-skeleton-pulse")).toHaveLength(23);
    });

    it("drives the pulse from the shared Figma-sourced keyframes, not Skeleton's own animate-pulse", () => {
      const { container } = render(<ContentState state="loading" />);
      const bar = container.querySelector(".lumen-skeleton-pulse");
      expect(bar).toHaveClass("animate-none");
      expect(bar).not.toHaveClass("animate-pulse");
    });

    it("staggers each bar with its own token-sourced delay rather than one shared animation", () => {
      const { container } = render(<ContentState state="loading" />);
      const [title, subtitle] = Array.from(
        container.querySelectorAll<HTMLElement>(".lumen-skeleton-pulse")
      );
      expect(title.style.getPropertyValue("--lumen-skeleton-delay")).toBe(
        "var(--duration-stagger-skeleton-step-0)"
      );
      expect(subtitle.style.getPropertyValue("--lumen-skeleton-delay")).toBe(
        "var(--duration-stagger-skeleton-step-1)"
      );
    });

    it("swaps in a caller-supplied skeleton when the real content's shape differs", () => {
      const { container } = render(
        <ContentState state="loading" skeleton={<div data-testid="custom-skeleton" />} />
      );
      expect(screen.getByTestId("custom-skeleton")).toBeInTheDocument();
      expect(container.querySelectorAll(".lumen-skeleton-pulse")).toHaveLength(0);
    });

    it("ignores the empty/error content props entirely", () => {
      render(<ContentState state="loading" title="No projects yet" action={<button type="button">New</button>} />);
      expect(screen.queryByText("No projects yet")).not.toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  it("sits on the app canvas background in every state, per Figma's bg/app binding", () => {
    (["empty", "loading", "error"] as const).forEach((state) => {
      const { container, unmount } = render(<ContentState state={state} title="Title" />);
      expect(container.firstElementChild).toHaveClass("bg-[var(--color-background-app)]");
      unmount();
    });
  });
});
