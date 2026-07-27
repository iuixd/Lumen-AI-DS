import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  it("renders as a switch with a default accessible name", () => {
    render(<ThemeToggle name="theme" />);
    expect(screen.getByRole("switch", { name: "Toggle dark theme" })).toBeInTheDocument();
  });

  it("accepts an aria-label override", () => {
    render(<ThemeToggle name="theme" aria-label="Switch to dark mode" />);
    expect(screen.getByRole("switch", { name: "Switch to dark mode" })).toBeInTheDocument();
  });

  it("toggles checked state on click", async () => {
    render(<ThemeToggle name="theme" />);
    const toggle = screen.getByRole("switch");
    expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    expect(toggle).toBeChecked();
  });

  it("associates the label with the input via htmlFor/id", () => {
    render(<ThemeToggle name="theme" id="theme-toggle" />);
    expect(screen.getByRole("switch")).toHaveAttribute("id", "theme-toggle");
  });

  it("renders the exact fixed two-cell Figma anatomy", () => {
    const { container } = render(<ThemeToggle name="theme" />);
    const track = container.querySelector("label");
    expect(track).toHaveClass(
      "h-[var(--spacing-24)]",
      "w-[var(--spacing-54)]",
      "bg-[var(--color-app-shell-toggle-track)]"
    );
    expect(container.querySelector('[data-theme-toggle-asset="sunLight"]')).toHaveClass(
      "left-[var(--spacing-2)]"
    );
    expect(container.querySelector('[data-theme-toggle-asset="moonLight"]')).toHaveClass(
      "left-[var(--spacing-32)]"
    );
    expect(container.querySelectorAll("img")).toHaveLength(4);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("slides the knob and crossfades its icon via a peer-checked transition, not an instant swap", () => {
    const { container } = render(<ThemeToggle name="theme" />);
    const knobSun = container.querySelector('[data-theme-toggle-asset="sunLight"]');
    const knobMoon = container.querySelector('[data-theme-toggle-asset="moonDark"]');
    const mutedSun = container.querySelector('[data-theme-toggle-asset="sunDark"]');
    const mutedMoon = container.querySelector('[data-theme-toggle-asset="moonLight"]');

    // The knob pair starts at the same left anchor and translates together on check.
    expect(knobSun).toHaveClass("left-[var(--spacing-2)]", "peer-checked:translate-x-[var(--spacing-30)]");
    expect(knobMoon).toHaveClass("left-[var(--spacing-2)]", "peer-checked:translate-x-[var(--spacing-30)]");

    // Every layer crossfades opacity instead of toggling display.
    for (const layer of [knobSun, knobMoon, mutedSun, mutedMoon]) {
      expect(layer?.className).toMatch(/transition-(opacity|\[transform,opacity\])/);
      expect(layer).not.toHaveClass("hidden");
      expect(layer).toHaveClass("motion-reduce:transition-none");
    }
  });
});
