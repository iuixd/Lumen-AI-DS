import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders its label and uses the final 34px geometry", () => {
    render(<Button>Save changes</Button>);
    const button = screen.getByRole("button", { name: "Save changes" });
    expect(button).toHaveClass(
      "h-[var(--button-height,var(--spacing-34))]",
      "px-[var(--button-padding-x,var(--spacing-14))]"
    );
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

  it("renders standardized 14px leading and trailing icon slots", () => {
    render(
      <Button iconStart={<svg data-testid="start" />} iconEnd={<svg data-testid="end" />}>
        Save
      </Button>
    );
    expect(screen.getByTestId("start").parentElement).toHaveClass("size-[var(--spacing-14)]");
    expect(screen.getByTestId("end").parentElement).toHaveClass("size-[var(--spacing-14)]");
  });
});
