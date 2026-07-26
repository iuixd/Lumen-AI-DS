import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./Resizable";
import * as PublicExports from "../../index";

describe("Resizable", () => {
  it("is exported from @lumen/ui's public entry point", () => {
    expect(PublicExports.ResizablePanelGroup).toBe(ResizablePanelGroup);
    expect(PublicExports.ResizablePanel).toBeDefined();
    expect(PublicExports.ResizableHandle).toBeDefined();
  });

  it("renders both panels' content", () => {
    render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>One</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>Two</ResizablePanel>
      </ResizablePanelGroup>
    );
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("exposes the handle as a keyboard-focusable ARIA separator with a live value", () => {
    render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={40}>One</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>Two</ResizablePanel>
      </ResizablePanelGroup>
    );
    const handle = screen.getByRole("separator");
    expect(handle).toHaveAttribute("tabIndex", "0");
    expect(handle).toHaveAttribute("aria-valuenow");
    expect(handle).toHaveAttribute("aria-orientation", "vertical");
  });

  it("sets the group's flex-direction inline style directly for vertical layout", () => {
    const { container } = render(
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={50}>Top</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>Bottom</ResizablePanel>
      </ResizablePanelGroup>
    );
    // react-resizable-panels@4.12 never sets a `data-panel-group-direction`
    // attribute (verified against its bundled source) — it sets
    // `flexDirection` as an inline style instead, so the vertical layout
    // must be asserted there, not via a (non-existent) data-attribute.
    // The library also unconditionally overwrites any custom `data-testid`
    // prop with its own auto-generated id, so the group is queried via its
    // own `data-group` attribute instead.
    const group = container.querySelector("[data-group]");
    expect(group).toHaveStyle({ flexDirection: "column" });
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("applies the handle's horizontal-orientation classes when the group is vertical (regression: upstream never sets data-panel-group-direction)", () => {
    render(
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={50}>Top</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>Bottom</ResizablePanel>
      </ResizablePanelGroup>
    );
    const handle = screen.getByRole("separator");
    expect(handle).toHaveAttribute("aria-orientation", "horizontal");
    expect(handle.className).toContain("aria-[orientation=horizontal]:h-px");
  });

  it("renders the grip indicator only when withHandle is set", () => {
    const { container, rerender } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>One</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>Two</ResizablePanel>
      </ResizablePanelGroup>
    );
    expect(container.querySelector("svg")).not.toBeInTheDocument();

    rerender(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>One</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>Two</ResizablePanel>
      </ResizablePanelGroup>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
