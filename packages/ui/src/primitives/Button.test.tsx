import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders its label and defaults to the 34px md geometry", () => {
    render(<Button>Save changes</Button>);
    const button = screen.getByRole("button", { name: "Save changes" });
    expect(button).toHaveClass(
      "h-[var(--button-height)]",
      "[--button-height:var(--spacing-34)]",
      "[--button-padding-x:var(--spacing-16)]"
    );
  });

  it.each([
    ["sm", "30", "14", "6", "12"],
    ["md", "34", "16", "8", "14"],
    ["lg", "38", "16", "8", "16"],
    ["xl", "42", "16", "8", "18"]
  ] as const)("uses the Figma geometry for size=%s", (size, height, paddingX, gap, iconSize) => {
    render(
      <Button size={size} iconStart={<svg data-testid="icon" />}>
        Save
      </Button>
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      `[--button-height:var(--spacing-${height})]`,
      `[--button-padding-x:var(--spacing-${paddingX})]`,
      `[--button-gap:var(--spacing-${gap})]`,
      `text-standard-button-${size}`
    );
    expect(button.className).toContain(`--button-icon-size:var(--spacing-${iconSize})`);
    expect(screen.getByTestId("icon").parentElement).toHaveClass("size-[var(--button-icon-size)]");
  });

  it("calls onClick when enabled", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save changes</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("uses aria-disabled and blocks activation when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Save changes
      </Button>
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toHaveAttribute("disabled");
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each(["primary", "accent", "secondary", "outline", "ghost", "destructive"] as const)(
    "uses the final %s semantic tokens",
    (variant) => {
      render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByRole("button").className).toContain(`--color-button-${variant}`);
    }
  );

  it("binds the Figma Ghost hover surface role", () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button")).toHaveClass(
      "hover:bg-[var(--color-button-ghost-hover-bg)]"
    );
  });

  it("renders size-aware leading and trailing icon slots", () => {
    render(
      <Button iconStart={<svg data-testid="start" />} iconEnd={<svg data-testid="end" />}>
        Save
      </Button>
    );
    expect(screen.getByTestId("start").parentElement).toHaveClass("size-[var(--button-icon-size)]");
    expect(screen.getByTestId("end").parentElement).toHaveClass("size-[var(--button-icon-size)]");
  });
});
