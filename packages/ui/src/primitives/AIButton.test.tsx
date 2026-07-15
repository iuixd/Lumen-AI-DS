import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AIButton } from "./AIButton";

describe("AIButton", () => {
  it("renders its label with a leading lm-aisymbol icon by default", () => {
    render(<AIButton>Summarize</AIButton>);
    const button = screen.getByRole("button", { name: "Summarize" });
    expect(button).toBeInTheDocument();
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<AIButton onClick={onClick}>Summarize</AIButton>);
    await userEvent.click(screen.getByRole("button", { name: "Summarize" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <AIButton onClick={onClick} disabled>
        Summarize
      </AIButton>
    );
    await userEvent.click(screen.getByRole("button", { name: "Summarize" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("marks the button aria-disabled and aria-busy while loading, and swaps the icon for a spinner", () => {
    render(<AIButton isLoading>Generating</AIButton>);
    const button = screen.getByRole("button", { name: "Generating" });
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("does not call onClick while loading", async () => {
    const onClick = vi.fn();
    render(
      <AIButton onClick={onClick} isLoading>
        Generating
      </AIButton>
    );
    await userEvent.click(screen.getByRole("button", { name: "Generating" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("warns in dev when an iconOnly button has no accessible name", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<AIButton iconOnly />);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("accessible name"));
    warnSpy.mockRestore();
  });

  it.each(["primary", "secondary", "tertiary", "outline"] as const)(
    "renders the %s variant without throwing",
    (variant) => {
      render(<AIButton variant={variant}>Summarize</AIButton>);
      expect(screen.getByRole("button", { name: "Summarize" })).toBeInTheDocument();
    }
  );

  it("marks destructive intent via a data attribute without changing the visible style", () => {
    render(
      <AIButton variant="secondary" destructive>
        Clean up records
      </AIButton>
    );
    const button = screen.getByRole("button", { name: "Clean up records" });
    expect(button).toHaveAttribute("data-destructive", "true");
  });

  it("accepts a custom leading icon override", () => {
    render(
      <AIButton icon={<span data-testid="custom-icon" />} isLoading={false}>
        Rewrite
      </AIButton>
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  describe("capability", () => {
    it("resolves a default label and icon from the catalog when no children are passed", () => {
      render(<AIButton capability="summarize" />);
      const button = screen.getByRole("button", { name: "Summarize" });
      expect(button).toBeInTheDocument();
      expect(button.querySelector("svg")).toBeInTheDocument();
    });

    it("lets explicit children override the capability's default label", () => {
      render(<AIButton capability="summarize">Custom label</AIButton>);
      expect(screen.getByRole("button", { name: "Custom label" })).toBeInTheDocument();
    });

    it("lets an explicit icon override the capability's default icon", () => {
      render(
        <AIButton capability="summarize" icon={<span data-testid="custom-icon" />}>
          Summarize
        </AIButton>
      );
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("stamps data-capability and data-ai-analytics-event on the rendered button", () => {
      render(<AIButton capability="draft" />);
      const button = screen.getByRole("button", { name: "Draft" });
      expect(button).toHaveAttribute("data-capability", "draft");
      expect(button).toHaveAttribute("data-ai-analytics-event", "ai_button.draft");
    });

    it("defaults aria-label to the capability's label for an icon-only button with no explicit label", () => {
      render(<AIButton iconOnly capability="translate" />);
      expect(screen.getByRole("button", { name: "Translate" })).toBeInTheDocument();
    });

    it("warns in dev and falls back to default rendering for an unrecognized capability id", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<AIButton capability="not-a-real-capability">Fallback label</AIButton>);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("unrecognized capability"));
      expect(screen.getByRole("button", { name: "Fallback label" })).toBeInTheDocument();
      warnSpy.mockRestore();
    });
  });
});
