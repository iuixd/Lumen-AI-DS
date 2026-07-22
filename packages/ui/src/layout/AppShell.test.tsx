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
    expect(screen.getAllByRole("link", { name: /Home/ })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: /Members/ })).toHaveLength(2);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("marks the active nav item with aria-current", () => {
    render(
      <AppShell nav={nav}>
        <p>Content</p>
      </AppShell>
    );
    screen
      .getAllByRole("link", { name: /Home/ })
      .forEach((link) => expect(link).toHaveAttribute("aria-current", "page"));
    screen
      .getAllByRole("link", { name: /Members/ })
      .forEach((link) => expect(link).not.toHaveAttribute("aria-current"));
  });

  it("renders a badge on nav items that have one", () => {
    render(
      <AppShell nav={nav}>
        <p>Content</p>
      </AppShell>
    );
    expect(
      screen.getAllByRole("link", { name: /Inbox/ }).some((link) => link.textContent?.includes("5"))
    ).toBe(true);
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
    expect(screen.getAllByText("N")).toHaveLength(1);
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
      <AppShell
        nav={nav}
        variant="rail"
        header={<p>Header content</p>}
        footer={<p>Footer content</p>}
      >
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

  it("renders each breakpoint-specific shell slot with canonical visibility classes", () => {
    const { container } = render(
      <AppShell
        nav={nav}
        header={<span>Desktop header</span>}
        tabletHeader={<span>Tablet header</span>}
        mobileStatusBar={<span>Mobile status</span>}
        mobileHeader={<span>Mobile header</span>}
        footer={<span>Desktop footer</span>}
        tabletFooter={<span>Tablet footer</span>}
        mobileNavigation={<span>Mobile navigation</span>}
        assistant={<span>Assistant</span>}
      >
        <p>Content</p>
      </AppShell>
    );

    expect(screen.getByText("Desktop header").parentElement).toHaveClass("desktop:flex");
    expect(screen.getByText("Tablet header").parentElement).toHaveClass(
      "tablet:flex",
      "desktop:hidden",
      "h-[var(--spacing-52)]"
    );
    expect(screen.getByText("Mobile status").parentElement).toHaveClass("tablet:hidden");
    expect(screen.getByText("Mobile header").parentElement).toHaveClass("tablet:hidden");
    expect(screen.getByText("Desktop footer").parentElement).toHaveClass("desktop:block");
    expect(screen.getByText("Tablet footer").parentElement).toHaveClass(
      "tablet:block",
      "desktop:hidden"
    );
    expect(screen.getByRole("navigation", { name: "Mobile" })).toHaveClass("tablet:hidden");
    expect(screen.getByText("Assistant").parentElement).toHaveClass("desktop:block");
    expect(container.firstElementChild).toHaveClass(
      "bg-[var(--color-app-shell-background)]",
      "text-[var(--color-app-shell-text-body)]",
      "[--color-button-primary-bg:var(--color-app-shell-button-primary-bg)]",
      "[--color-button-secondary-bg:var(--color-app-shell-button-secondary-bg)]",
      "[--color-button-accent-bg:var(--color-app-shell-button-accent-bg)]",
      "[--color-input-primary-bg:var(--color-app-shell-background)]",
      "[--color-input-primary-border:var(--color-app-shell-border-input)]",
      "[--color-input-primary-placeholder-text:var(--color-app-shell-text-placeholder)]",
      "[--color-input-search-bg:var(--color-app-shell-background)]",
      "[--color-input-search-border:var(--color-app-shell-border-input)]",
      "[--color-input-search-icon:var(--color-app-shell-text-placeholder)]"
    );
  });

  it("binds navigation and count badges to the published AppShell and Badge roles", () => {
    render(
      <AppShell nav={nav}>
        <p>Content</p>
      </AppShell>
    );

    const desktopHome = screen.getAllByRole("link", { name: /Home/ })[0];
    const desktopInbox = screen.getAllByRole("link", { name: /Inbox/ })[0];
    const count = desktopInbox.querySelector("span:last-child");

    expect(desktopHome).toHaveClass(
      "bg-[var(--color-app-shell-nav-active)]",
      "text-[var(--color-app-shell-nav-selected-on-action)]"
    );
    expect(desktopHome).not.toHaveClass("hover:bg-[var(--color-app-shell-nav-hover)]");
    expect(desktopInbox).toHaveClass(
      "text-[var(--color-app-shell-nav-on-action)]",
      "hover:bg-[var(--color-app-shell-nav-hover)]"
    );
    expect(count).toHaveClass(
      "bg-[var(--color-badge-default-bg)]",
      "text-[var(--color-badge-default-text)]"
    );
  });
});
