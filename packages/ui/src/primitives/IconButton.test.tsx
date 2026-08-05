import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IconButton, type IconButtonVariant } from "./IconButton";

const PlusGlyph = () => <svg data-testid="plus-glyph" />;

describe("IconButton", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the Figma-evidenced default: secondary variant, md size, exact geometry", () => {
    render(<IconButton icon={<PlusGlyph />} aria-label="Add item" />);
    const button = screen.getByRole("button", { name: "Add item" });
    expect(button).toHaveClass(
      "size-[var(--spacing-34)]",
      "border-[var(--color-button-secondary-border)]",
      "bg-[var(--color-button-secondary-bg)]"
    );
    expect(screen.getByTestId("plus-glyph")).toBeInTheDocument();
  });

  it.each([
    "default",
    "destructive",
    "outline",
    "secondary",
    "ghost",
    "link",
    "neutral-outline",
    "neutral-solid"
  ] as IconButtonVariant[])(
    "binds the %s variant's Button color tokens",
    (variant) => {
      render(<IconButton variant={variant} icon={<PlusGlyph />} aria-label={`${variant} action`} />);
      const button = screen.getByRole("button", { name: `${variant} action` });
      expect(button.className).toContain("--color-button-");
    }
  );

  it.each(["sm", "md", "lg", "xl"] as const)("binds the %s size geometry", (size) => {
    render(<IconButton size={size} icon={<PlusGlyph />} aria-label={`Add, ${size}`} />);
    expect(screen.getByRole("button", { name: `Add, ${size}` })).toHaveClass(
      `size-[var(--spacing-${{ sm: 30, md: 34, lg: 38, xl: 42 }[size]})]`
    );
  });

  it("hides the icon from assistive technology, relying on the accessible name", () => {
    render(<IconButton icon={<PlusGlyph />} aria-label="Add item" />);
    expect(screen.getByTestId("plus-glyph").closest("[aria-hidden]")).toBeInTheDocument();
  });

  it("supports aria-labelledby as an alternative to aria-label", () => {
    render(
      <>
        <span id="label-id">Add item</span>
        <IconButton icon={<PlusGlyph />} aria-labelledby="label-id" />
      </>
    );
    expect(screen.getByRole("button", { name: "Add item" })).toBeInTheDocument();
  });

  it("warns in development when no accessible name is provided", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<IconButton icon={<PlusGlyph />} />);
    expect(warnSpy).toHaveBeenCalledWith(
      "IconButton: an accessible name is required — pass aria-label."
    );
  });

  it("does not warn when an accessible name is provided", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<IconButton icon={<PlusGlyph />} aria-label="Add item" />);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("fires onClick and supports disabled behavior", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton icon={<PlusGlyph />} aria-label="Add item" onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: "Add item" }));
    expect(onClick).toHaveBeenCalledTimes(1);

    render(<IconButton icon={<PlusGlyph />} aria-label="Add another" disabled onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: "Add another" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("defaults to type=button so it never submits an enclosing form", () => {
    render(<IconButton icon={<PlusGlyph />} aria-label="Add item" />);
    expect(screen.getByRole("button", { name: "Add item" })).toHaveAttribute("type", "button");
  });
});
