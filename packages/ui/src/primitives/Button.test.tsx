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

  it("hides the label visually while loading but keeps it in the accessible name", () => {
    // Previously only iconOnly buttons hid their label during loading — a regular
    // button would show the spinner AND the label text side by side, and the
    // fix for that (dropping the label from the DOM outright) would have made a
    // loading "Save changes" button announce no accessible name at all. It must
    // stay in the DOM as visually-hidden text, not disappear.
    render(<Button isLoading>Save changes</Button>);
    const button = screen.getByRole("button", { name: "Save changes" });
    const label = screen.getByText("Save changes");
    expect(button).toContainElement(label);
    expect(label).toHaveClass("sr-only");
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

  it("gives the raised variant an elevation shadow, distinguishing it from flat primary", () => {
    render(<Button variant="raised">Save changes</Button>);
    const className = screen.getByRole("button", { name: "Save changes" }).className;
    // Must be the arbitrary-property form `[box-shadow:var(...)]`, not
    // `shadow-[var(...)]` — Tailwind's `shadow-*` utility misreads a bare
    // `var(...)` arbitrary value as a shadow *color*, not the full shadow,
    // silently dropping the real shadow and falling back to Tailwind's
    // generic default `.shadow` shape instead.
    expect(className).toMatch(/\[box-shadow:var\(--shadow-button-default\)\]/);
    expect(className).not.toMatch(/\bshadow-\[var\(--shadow-button-default\)\]/);
  });

  it("applies rounded-full for the pill modifier regardless of variant", () => {
    render(<Button pill>Save changes</Button>);
    const className = screen.getByRole("button", { name: "Save changes" }).className;
    expect(className).toMatch(/\brounded-full\b/);
  });

  it("gives icon-only primary buttons a persistent border that regular primary buttons don't have", () => {
    render(
      <Button iconOnly aria-label="Search">
        {"✕"}
      </Button>
    );
    const iconOnlyClassName = screen.getByRole("button", { name: "Search" }).className;
    render(<Button>Save changes</Button>);
    const regularClassName = screen.getByRole("button", { name: "Save changes" }).className;
    // Primary also carries `focus-visible:border-[var(--color-brand-border)]` (the
    // border that appears only on focus) — match the unprefixed, always-on class
    // specifically, not that conditional one, to actually distinguish the two.
    const alwaysOnBorder = /(?<![-:\w])border-\[var\(--color-brand-border\)\]/;
    expect(iconOnlyClassName).toMatch(alwaysOnBorder);
    expect(regularClassName).not.toMatch(alwaysOnBorder);
  });

  it.each(["success", "warning", "error"] as const)(
    "applies the %s status tint on top of the primary variant with no border",
    (status) => {
      render(<Button status={status}>Save changes</Button>);
      const className = screen.getByRole("button", { name: "Save changes" }).className;
      expect(className).toMatch(new RegExp(`\\bbg-\\[var\\(--color-status-${status}-subtle\\)\\]`));
      expect(className).toMatch(new RegExp(`\\btext-\\[var\\(--color-status-${status}-text\\)\\]`));
      expect(className).toMatch(/\bborder-transparent\b/);
    }
  );

  it.each(["success", "warning", "error"] as const)(
    "adds a status-colored border for the secondary variant, unlike primary",
    (status) => {
      render(
        <Button variant="secondary" status={status}>
          Save changes
        </Button>
      );
      const className = screen.getByRole("button", { name: "Save changes" }).className;
      expect(className).toMatch(
        new RegExp(`\\bborder-\\[var\\(--color-status-${status}-border\\)\\]`)
      );
    }
  );

  it("fills the secondary variant with the brand-subtle background and brand-border-strong border at rest, not transparent", () => {
    // Regression test: secondary previously rendered bg-transparent at rest,
    // only filling on hover, and used the lighter brand.border token — both
    // wrong per a direct Figma re-check (Type=Secondary, State=Default).
    render(<Button variant="secondary">Save changes</Button>);
    const className = screen.getByRole("button", { name: "Save changes" }).className;
    expect(className).toMatch(/\bbg-\[var\(--color-brand-subtle\)\]/);
    const alwaysOnBorder = /(?<![-:\w])border-\[var\(--color-brand-border-strong\)\]/;
    expect(className).toMatch(alwaysOnBorder);
  });

  it("gives secondary a solid dark fill with white text and no border when active", () => {
    render(<Button variant="secondary">Save changes</Button>);
    const className = screen.getByRole("button", { name: "Save changes" }).className;
    expect(className).toMatch(/\bactive:bg-\[var\(--color-brand-solid-active\)\]/);
    expect(className).toMatch(/\bactive:text-neutral-white\b/);
    expect(className).toMatch(/\bactive:border-transparent\b/);
  });

  it("renders the outline variant transparent at rest with the same border/text colors as secondary", () => {
    render(<Button variant="outline">Save changes</Button>);
    const className = screen.getByRole("button", { name: "Save changes" }).className;
    expect(className).toMatch(/\bbg-transparent\b/);
    const alwaysOnBorder = /(?<![-:\w])border-\[var\(--color-brand-border-strong\)\]/;
    expect(className).toMatch(alwaysOnBorder);
    expect(className).toMatch(/\btext-\[var\(--color-brand-default\)\]/);
  });

  it("fills the outline variant on hover and gives it the same solid active fill as secondary", () => {
    render(<Button variant="outline">Save changes</Button>);
    const className = screen.getByRole("button", { name: "Save changes" }).className;
    expect(className).toMatch(/\bhover:bg-\[var\(--color-brand-subtle\)\]/);
    expect(className).toMatch(/\bactive:bg-\[var\(--color-brand-solid-active\)\]/);
    expect(className).toMatch(/\bactive:text-neutral-white\b/);
  });

  it("renders the accent variant with theme-aware AppShell tokens", () => {
    render(<Button variant="accent">New project</Button>);
    const className = screen.getByRole("button", { name: "New project" }).className;
    expect(className).toContain("bg-[var(--color-app-shell-button-accent-bg)]");
    expect(className).toContain("text-[var(--color-app-shell-button-accent-text)]");
  });

  it("lets disabled styling win over a status tint when both are set", () => {
    render(
      <Button status="success" disabled>
        Save changes
      </Button>
    );
    const className = screen.getByRole("button", { name: "Save changes" }).className;
    expect(className).toMatch(/\baria-disabled:bg-neutral-50\b/);
    expect(className).toMatch(/\baria-disabled:text-neutral-400\b/);
  });
});
