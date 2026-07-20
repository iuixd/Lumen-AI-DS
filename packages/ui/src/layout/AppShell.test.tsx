import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppShell, type NavSection } from "./AppShell";

const nav: NavSection[] = [
  {
    items: [
      { label: "Home", href: "/home", active: true },
      { label: "Inbox", href: "/inbox", badge: 5 }
    ]
  },
  {
    label: "Admin",
    items: [{ label: "Members", href: "/members" }]
  }
];

describe("AppShell", () => {
  it("defaults to the sidebar variant and renders visible nav labels across sections", () => {
    render(
      <AppShell nav={nav}>
        <p>Content</p>
      </AppShell>
    );
    expect(screen.getByRole("link", { name: /Home/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Members/ })).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("marks the active nav item with aria-current", () => {
    render(
      <AppShell nav={nav}>
        <p>Content</p>
      </AppShell>
    );
    expect(screen.getByRole("link", { name: /Home/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /Members/ })).not.toHaveAttribute("aria-current");
  });

  it("renders a badge on nav items that have one", () => {
    render(
      <AppShell nav={nav}>
        <p>Content</p>
      </AppShell>
    );
    expect(screen.getByRole("link", { name: /Inbox/ })).toHaveTextContent("5");
  });

  it("renders a section header for labeled sections only", () => {
    render(
      <AppShell nav={nav}>
        <p>Content</p>
      </AppShell>
    );
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("renders the WorkspaceSwitcher when workspace is provided", () => {
    render(
      <AppShell nav={nav} workspace={{ name: "Northwind Corp", plan: "Enterprise" }}>
        <p>Content</p>
      </AppShell>
    );
    expect(screen.getByText("Northwind Corp")).toBeInTheDocument();
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
    expect(screen.getByText("N")).toBeInTheDocument();
  });

  it("renders a Collapse control only when onCollapse is provided, and calls it on click", async () => {
    const onCollapse = vi.fn();
    const { rerender } = render(
      <AppShell nav={nav}>
        <p>Content</p>
      </AppShell>
    );
    expect(screen.queryByRole("button", { name: "Collapse" })).not.toBeInTheDocument();

    rerender(
      <AppShell nav={nav} onCollapse={onCollapse}>
        <p>Content</p>
      </AppShell>
    );
    const collapseButton = screen.getByRole("button", { name: "Collapse" });
    collapseButton.click();
    expect(onCollapse).toHaveBeenCalledOnce();
  });

  it("renders the rail variant with icon-only nav items exposing labels via aria-label, flattening sections", () => {
    render(
      <AppShell nav={nav} variant="rail">
        <p>Content</p>
      </AppShell>
    );
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Members" })).toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders header and footer content in both variants when provided", () => {
    const { rerender } = render(
      <AppShell nav={nav} header={<p>Header content</p>} footer={<p>Footer content</p>}>
        <p>Content</p>
      </AppShell>
    );
    expect(screen.getByText("Header content")).toBeInTheDocument();
    expect(screen.getByText("Footer content")).toBeInTheDocument();

    rerender(
      <AppShell nav={nav} variant="rail" header={<p>Header content</p>} footer={<p>Footer content</p>}>
        <p>Content</p>
      </AppShell>
    );
    expect(screen.getByText("Header content")).toBeInTheDocument();
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("omits header and footer when not provided, in either variant", () => {
    const { container } = render(
      <AppShell nav={nav}>
        <p>Content</p>
      </AppShell>
    );
    expect(container.querySelector("header")).not.toBeInTheDocument();
    expect(container.querySelector("footer")).not.toBeInTheDocument();
  });
});
