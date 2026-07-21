import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./Input";

describe("Input", () => {
  it.each([
    ["sm", "h-[var(--spacing-36)]", "text-input-sm"],
    ["md", "h-[var(--spacing-44)]", "text-input-md"],
    ["lg", "h-[var(--spacing-60)]", "text-input-md"]
  ] as const)("binds the %s Figma size tokens", (size, height, typography) => {
    render(<Input aria-label={size} size={size} />);
    expect(screen.getByRole("textbox", { name: size })).toHaveClass(height, typography);
  });

  it("preserves the native numeric size attribute", () => {
    render(<Input aria-label="native size" size={30} />);
    expect(screen.getByRole("textbox", { name: "native size" })).toHaveAttribute("size", "30");
  });

  it("binds the search tokens and shortcut anatomy", () => {
    render(<Input aria-label="Search" variant="search" />);
    const input = screen.getByRole("textbox", { name: "Search" });
    expect(input).toHaveClass(
      "bg-[var(--color-input-search-bg)]",
      "border-[var(--color-input-search-border)]"
    );
    expect(input.previousElementSibling).toHaveClass("left-[var(--spacing-14)]");
    expect(screen.getByText("⌘K").tagName).toBe("KBD");
  });

  it("maps invalid state semantically and visually", () => {
    render(<Input aria-label="Email" invalid />);
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.className).toContain("--color-input-primary-error-border");
  });
});
