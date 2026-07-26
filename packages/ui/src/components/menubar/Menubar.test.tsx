import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from "./Menubar";
import * as PublicExports from "../../index";

beforeEach(() => {
  Element.prototype.hasPointerCapture = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});

describe("Menubar", () => {
  it("is exported from @lumen/ui's public entry point", () => {
    expect(PublicExports.Menubar).toBe(Menubar);
    expect(PublicExports.MenubarMenu).toBeDefined();
    expect(PublicExports.MenubarTrigger).toBeDefined();
    expect(PublicExports.MenubarContent).toBeDefined();
    expect(PublicExports.MenubarItem).toBeDefined();
    expect(PublicExports.MenubarCheckboxItem).toBeDefined();
    expect(PublicExports.MenubarRadioItem).toBeDefined();
    expect(PublicExports.MenubarLabel).toBeDefined();
    expect(PublicExports.MenubarSeparator).toBeDefined();
    expect(PublicExports.MenubarShortcut).toBeDefined();
  });

  it("is closed by default and opens its content on trigger click", async () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New Tab</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    expect(screen.queryByText("New Tab")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("File"));
    expect(await screen.findByText("New Tab")).toBeInTheDocument();
  });

  it("calls onSelect and closes when a menu item is chosen", async () => {
    const onSelect = vi.fn();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={onSelect}>New Tab</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    await userEvent.click(screen.getByText("File"));
    await userEvent.click(await screen.findByText("New Tab"));
    expect(onSelect).toHaveBeenCalled();
  });

  it("does not call onSelect for a disabled item", async () => {
    const onSelect = vi.fn();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem disabled onSelect={onSelect}>
              Print
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    await userEvent.click(screen.getByText("File"));
    await userEvent.click(await screen.findByText("Print"));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("toggles a checkbox item's checked state on select", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked={false} onCheckedChange={onCheckedChange}>
              Show Status Bar
            </MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    await userEvent.click(screen.getByText("View"));
    await userEvent.click(await screen.findByText("Show Status Bar"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("closes on Escape", async () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New Tab</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
    await userEvent.click(screen.getByText("File"));
    expect(await screen.findByText("New Tab")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByText("New Tab")).not.toBeInTheDocument();
  });
});
