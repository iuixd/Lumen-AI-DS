import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders its label", () => {
    render(<Button>Save changes</Button>);
    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save changes</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Save changes
      </Button>
    );
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("marks the button aria-disabled and aria-busy while loading", () => {
    render(<Button isLoading>Save changes</Button>);
    const button = screen.getByRole("button", { name: "Save changes" });
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("does not call onClick while loading", async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} isLoading>
        Save changes
      </Button>
    );
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("warns in dev when an iconOnly button has no accessible name", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Button iconOnly>{"✕"}</Button>);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("accessible name"));
    warnSpy.mockRestore();
  });

  it.each(["xs", "sm", "md", "lg"] as const)(
    "resolves iconOnly size=%s to a single square size class with no conflicting box-model classes left over",
    (size) => {
      render(
        <Button iconOnly size={size} aria-label="Search">
          {"✕"}
        </Button>
      );
      const className = screen.getByRole("button", { name: "Search" }).className;
      // cva emits the size variant's own min-w-*/px-*/py-* alongside iconOnly's
      // min-w-0/p-0 and the compound variant's size-*; without tailwind-merge
      // resolving the conflict, both survive in the class list and which one
      // wins is down to Tailwind's generated stylesheet order, not intent —
      // this is exactly what produced the squished, non-square icon buttons.
      expect(className).toMatch(/\bsize-\[var\(--spacing-\d+\)\]/);
      expect(className).not.toMatch(/\bmin-w-\[var\(--spacing-(64|80|96|120)\)\]/);
      expect(className).not.toMatch(/\bpx-\[var\(--spacing-\d+\)\]/);
      expect(className).not.toMatch(/\bpy-\[var\(--spacing-\d+\)\]/);
    }
  );

  it.each(["xs", "sm", "md", "lg"] as const)(
    "keeps the text color class alongside the size's text-button-%s class instead of dropping one as a false conflict",
    (size) => {
      render(<Button size={size}>Save changes</Button>);
      const className = screen.getByRole("button", { name: "Save changes" }).className;
      // Without teaching tailwind-merge about the custom `button-*` font-size scale,
      // it can't tell `text-button-md` (a font size) apart from `text-neutral-white`
      // (a color) — both look like generic `text-<word>` values to it, so it treats
      // them as the same "text-color" conflict group and silently drops one. That's
      // exactly what made Primary button labels render in the default/inherited
      // color instead of white.
      expect(className).toMatch(new RegExp(`\\btext-button-${size}\\b`));
      expect(className).toMatch(/\btext-neutral-white\b/);
    }
  );
});
