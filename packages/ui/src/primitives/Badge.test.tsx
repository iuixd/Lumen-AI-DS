import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge, badgeStatuses } from "./Badge";

describe("Badge", () => {
  it("renders the Figma default status and leading dot", () => {
    const { container } = render(<Badge>Label</Badge>);
    const badge = screen.getByText("Label");
    expect(badge).toHaveClass("bg-[var(--color-badge-default-bg)]", "text-badge-sm");
    expect(container.querySelector("[data-badge-dot]")).toHaveClass("size-[var(--spacing-6)]");
  });

  it.each(badgeStatuses)("binds the %s status tokens", (status) => {
    render(<Badge status={status}>{status}</Badge>);
    const badge = screen.getByText(status);
    expect(badge.className).toContain(`--color-badge-${status}-bg`);
    expect(badge.className).toContain(`--color-badge-${status}-text`);
  });

  it.each(["sm", "md", "lg"] as const)("binds the %s size geometry", (size) => {
    const { container } = render(<Badge size={size}>{size}</Badge>);
    expect(screen.getByText(size)).toHaveClass(`text-badge-${size}`);
    expect(container.querySelector("[data-badge-dot]")?.className).toContain(
      `--spacing-${size === "sm" ? "6" : size === "md" ? "7" : "8"}`
    );
  });

  it("can omit the decorative dot", () => {
    const { container } = render(<Badge showDot={false}>No dot</Badge>);
    expect(container.querySelector("[data-badge-dot]")).not.toBeInTheDocument();
  });

  it("keeps the legacy tone API as a compatibility alias", () => {
    render(<Badge tone="neutral">Legacy</Badge>);
    expect(screen.getByText("Legacy")).toHaveClass("bg-[var(--color-badge-gray-bg)]");
  });
});
