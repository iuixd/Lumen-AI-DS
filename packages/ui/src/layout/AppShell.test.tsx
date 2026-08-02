import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

function mockDesktop(matches: boolean) {
  const matchMedia = vi.fn().mockReturnValue({
    matches,
    media: "(min-width: 1024px)",
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  });
  const original = window.matchMedia;
  window.matchMedia = matchMedia as unknown as typeof window.matchMedia;
  return () => {
    window.matchMedia = original;
  };
}

describe("AppShell", () => {
  // 2026-07-29: the desktop nav column is now `SideNav`, a single persistent
  // component (see SideNav.test.tsx for its own full coverage) rather than
  // the previous Sidebar+NavigationRail pair rendered simultaneously — so
  // these tests assert one link per item, not two, and mock the desktop
  // breakpoint where they need to observe the expanded/labeled layout
  // (matching this file's existing precedent for the assistant panel below;
  // vitest.setup.ts stubs window.matchMedia to always report matches: false
  // otherwise).
  it("defaults to the sidebar variant and renders visible nav labels across sections", () => {
    const restore = mockDesktop(true);
    try {
      render(
        <AppShell nav={nav}>
          <p>Content</p>
        </AppShell>
      );
      expect(screen.getByRole("link", { name: /Home/ })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Members/ })).toBeInTheDocument();
      expect(screen.getByText("Admin")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    } finally {
      restore();
    }
  });

  it("marks the active nav item with aria-current", () => {
    const restore = mockDesktop(true);
    try {
      render(
        <AppShell nav={nav}>
          <p>Content</p>
        </AppShell>
      );
      expect(screen.getByRole("link", { name: /Home/ })).toHaveAttribute("aria-current", "page");
      expect(screen.getByRole("link", { name: /Members/ })).not.toHaveAttribute("aria-current");
    } finally {
      restore();
    }
  });

  it("renders a badge on nav items that have one", () => {
    const restore = mockDesktop(true);
    try {
      render(
        <AppShell nav={nav}>
          <p>Content</p>
        </AppShell>
      );
      expect(screen.getByRole("link", { name: /Inbox/ }).textContent).toContain("5");
    } finally {
      restore();
    }
  });

  it("renders the workspace name and plan when provided", () => {
    const restore = mockDesktop(true);
    try {
      render(
        <AppShell nav={nav} workspace={{ name: "Northwind Corp", plan: "Enterprise" }}>
          <p>Content</p>
        </AppShell>
      );
      expect(screen.getByText("Northwind Corp")).toBeInTheDocument();
      expect(screen.getByText("Enterprise")).toBeInTheDocument();
      expect(screen.getAllByText("N")).toHaveLength(1);
    } finally {
      restore();
    }
  });

  it("renders a Collapse control only when onCollapse is provided, and calls it on click", () => {
    const restore = mockDesktop(true);
    try {
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
    } finally {
      restore();
    }
  });

  it("calls onExpand from the rail variant's Expand control", async () => {
    const restore = mockDesktop(true);
    try {
      const user = userEvent.setup();
      const onExpand = vi.fn();
      render(
        <AppShell nav={nav} variant="rail" onExpand={onExpand}>
          <p>Content</p>
        </AppShell>
      );
      // userEvent.click, not the native .click() — the Expand control is
      // wrapped in a Tooltip (SideNav), and a raw .click() bypasses Testing
      // Library's act() wrapping around the Tooltip's own pointer-tracking
      // state update, producing an act() warning even though the test still
      // passes.
      await user.click(screen.getByRole("button", { name: "Expand navigation" }));
      expect(onExpand).toHaveBeenCalledOnce();
    } finally {
      restore();
    }
  });

  it("renders the rail variant with icon-only nav items exposing labels via aria-label", () => {
    const restore = mockDesktop(true);
    try {
      render(
        <AppShell nav={nav} variant="rail">
          <p>Content</p>
        </AppShell>
      );
      expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Members" })).toBeInTheDocument();
      expect(screen.queryByText("Admin")).not.toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    } finally {
      restore();
    }
  });

  it("always shows the icon-only rail below the desktop breakpoint, regardless of variant", () => {
    // Default (unmocked) matchMedia — vitest.setup.ts's stub reports
    // matches: false, exercising the tablet/mobile path.
    render(
      <AppShell nav={nav}>
        <p>Content</p>
      </AppShell>
    );
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Collapse" })).not.toBeInTheDocument();
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
      "h-[var(--size-header-h)]"
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
      "text-[var(--color-app-shell-text-body)]"
    );
    // Neither Button nor Input is locally re-scoped to app-shell-specific
    // token shadow-copies inside AppShell — both must read the same global
    // --color-button-*/--color-input-* tokens everywhere, so a fix to either
    // component's real tokens is never silently neutralized here again.
    expect(container.firstElementChild).not.toHaveClass(
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

  it("renders the assistant panel as a fixed, non-resizable aside when matchMedia reports below the desktop breakpoint", () => {
    // vitest.setup.ts stubs window.matchMedia to always report matches:
    // false, so this exercises the same default path as every other test
    // in this file — asserted explicitly here since it's the fallback this
    // suite's resizable-panel test below is contrasted against.
    render(
      <AppShell nav={nav} assistant={<span>Assistant</span>}>
        <p>Content</p>
      </AppShell>
    );
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    expect(screen.getByText("Assistant").parentElement).toHaveClass(
      "hidden",
      "w-[var(--size-ai-panel-w)]",
      "desktop:block"
    );
  });

  it("renders the assistant panel as a draggable ResizablePanel when matchMedia reports desktop", () => {
    const restore = mockDesktop(true);
    try {
      render(
        <AppShell nav={nav} assistant={<span>Assistant</span>}>
          <p>Content</p>
        </AppShell>
      );
      const separator = screen.getByRole("separator");
      expect(separator).toBeInTheDocument();
      // Plain draggable divider (the Resizable component's "Default" story),
      // not "With Handle Grip" — no grip-icon child.
      expect(separator).toBeEmptyDOMElement();
      expect(screen.getByText("Assistant")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
      // react-resizable-panels' Group hardcodes an inline height:"100%" that
      // never resolves against this row's flex-grow-derived height (verified
      // live in a browser, not just in jsdom) — this height:"auto" override
      // is what makes align-items:stretch actually fill the row. jsdom has
      // no layout engine so it can't verify the visual stretch itself, but
      // it can catch the override being silently removed.
      const group = separator.parentElement;
      expect(group).toHaveStyle({ height: "auto" });
    } finally {
      restore();
    }
  });

  it("binds navigation and count badges to the published AppShell and Badge roles", () => {
    const restore = mockDesktop(true);
    try {
      render(
        <AppShell nav={nav}>
          <p>Content</p>
        </AppShell>
      );

      const home = screen.getByRole("link", { name: /Home/ });
      const inbox = screen.getByRole("link", { name: /Inbox/ });
      const count = inbox.querySelector("span:last-child");

      expect(home).toHaveClass(
        "bg-[var(--color-app-shell-nav-active)]",
        "text-[var(--color-app-shell-nav-selected-on-action)]"
      );
      expect(home).not.toHaveClass("hover:bg-[var(--color-app-shell-nav-hover)]");
      expect(inbox).toHaveClass(
        "text-[var(--color-app-shell-nav-on-action)]",
        "hover:bg-[var(--color-app-shell-nav-hover)]"
      );
      expect(count).toHaveClass(
        "bg-[var(--color-badge-default-bg)]",
        "text-[var(--color-badge-default-text)]"
      );
    } finally {
      restore();
    }
  });
});
