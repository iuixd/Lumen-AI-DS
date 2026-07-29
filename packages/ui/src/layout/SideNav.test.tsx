import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SideNav, type NavSection } from "./SideNav";

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

describe("SideNav", () => {
  it("shows the icon-only rail below the desktop breakpoint regardless of `expanded`", () => {
    // vitest.setup.ts stubs window.matchMedia to always report matches: false,
    // so this is the default path for every test in this file except the ones
    // that explicitly mock desktop below.
    render(<SideNav nav={nav} expanded onCollapse={() => {}} />);
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Collapse" })).not.toBeInTheDocument();
  });

  it("shows full labels, section headers, and the Collapse control at desktop when expanded", () => {
    const restore = mockDesktop(true);
    try {
      render(<SideNav nav={nav} expanded onCollapse={() => {}} />);
      expect(screen.getByRole("link", { name: /Home/ })).toBeInTheDocument();
      expect(screen.getByText("Admin")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Collapse" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Expand navigation" })).not.toBeInTheDocument();
    } finally {
      restore();
    }
  });

  it("shows the icon-only rail and Expand control at desktop when not expanded", () => {
    const restore = mockDesktop(true);
    try {
      render(<SideNav nav={nav} expanded={false} onExpand={() => {}} />);
      expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
      expect(screen.queryByText("Admin")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Expand navigation" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Collapse" })).not.toBeInTheDocument();
    } finally {
      restore();
    }
  });

  it("marks the active item with aria-current in both layouts", () => {
    const restore = mockDesktop(true);
    try {
      const { rerender } = render(<SideNav nav={nav} expanded />);
      expect(screen.getByRole("link", { name: /Home/ })).toHaveAttribute("aria-current", "page");
      rerender(<SideNav nav={nav} expanded={false} />);
      expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    } finally {
      restore();
    }
  });

  it("renders a badge on nav items that have one, only when expanded at desktop", () => {
    const restore = mockDesktop(true);
    try {
      render(<SideNav nav={nav} expanded />);
      expect(
        screen.getByRole("link", { name: /Inbox/ }).textContent?.includes("5")
      ).toBe(true);
    } finally {
      restore();
    }
  });

  it("calls onCollapse when the Collapse control is clicked", () => {
    const restore = mockDesktop(true);
    try {
      const onCollapse = vi.fn();
      render(<SideNav nav={nav} expanded onCollapse={onCollapse} />);
      screen.getByRole("button", { name: "Collapse" }).click();
      expect(onCollapse).toHaveBeenCalledOnce();
    } finally {
      restore();
    }
  });

  it("calls onExpand when the Expand control is clicked", async () => {
    const restore = mockDesktop(true);
    try {
      const user = userEvent.setup();
      const onExpand = vi.fn();
      render(<SideNav nav={nav} expanded={false} onExpand={onExpand} />);
      // userEvent.click, not the native .click() — the Expand control is
      // wrapped in a Tooltip, and a raw .click() bypasses Testing Library's
      // act() wrapping around the Tooltip's own pointer-tracking state
      // update, producing an act() warning even though the test still
      // passes.
      await user.click(screen.getByRole("button", { name: "Expand navigation" }));
      expect(onExpand).toHaveBeenCalledOnce();
    } finally {
      restore();
    }
  });

  it("renders the workspace name and plan only when expanded at desktop", () => {
    const restore = mockDesktop(true);
    try {
      const { rerender } = render(
        <SideNav nav={nav} expanded workspace={{ name: "Northwind Corp", plan: "Enterprise" }} />
      );
      expect(screen.getByText("Northwind Corp")).toBeInTheDocument();
      expect(screen.getByText("Enterprise")).toBeInTheDocument();

      rerender(
        <SideNav
          nav={nav}
          expanded={false}
          workspace={{ name: "Northwind Corp", plan: "Enterprise" }}
        />
      );
      expect(screen.queryByText("Northwind Corp")).not.toBeInTheDocument();
    } finally {
      restore();
    }
  });

  it("applies the desktop-expanded and desktop-collapsed widths", () => {
    const restore = mockDesktop(true);
    try {
      const { rerender, container } = render(<SideNav nav={nav} expanded />);
      expect(container.firstElementChild).toHaveClass("w-[var(--spacing-224)]");
      rerender(<SideNav nav={nav} expanded={false} />);
      expect(container.firstElementChild).toHaveClass("w-[var(--spacing-64)]");
    } finally {
      restore();
    }
  });

  it("shows a tooltip with the item's label on hover in the collapsed rail", async () => {
    const restore = mockDesktop(true);
    try {
      const user = userEvent.setup();
      render(<SideNav nav={nav} expanded={false} />);
      expect(screen.queryByText("Members", { selector: "[role=tooltip] *" })).not.toBeInTheDocument();
      await user.hover(screen.getByRole("link", { name: "Members" }));
      await waitFor(() => expect(screen.getByRole("tooltip")).toHaveTextContent("Members"), {
        timeout: 2000
      });
    } finally {
      restore();
    }
  });

  it("shows a tooltip on the Expand control when collapsed", async () => {
    const restore = mockDesktop(true);
    try {
      const user = userEvent.setup();
      render(<SideNav nav={nav} expanded={false} onExpand={() => {}} />);
      await user.hover(screen.getByRole("button", { name: "Expand navigation" }));
      await waitFor(() => expect(screen.getByRole("tooltip")).toHaveTextContent("Expand navigation"), {
        timeout: 2000
      });
    } finally {
      restore();
    }
  });

  it("uses an accessible color (not text-tertiary) for the section label", () => {
    // text-tertiary (lumen-gray.600, #838F92 on white) contrasts at 3.32:1,
    // below WCAG AA's 4.5:1 minimum for this label's 10px text — an axe
    // "Serious" violation flagged against this exact element.
    const restore = mockDesktop(true);
    try {
      render(<SideNav nav={nav} expanded />);
      const label = screen.getByText("Admin");
      expect(label).toHaveClass("text-[var(--color-app-shell-text-secondary)]");
      expect(label).not.toHaveClass("text-[var(--color-app-shell-text-tertiary)]");
    } finally {
      restore();
    }
  });
});
