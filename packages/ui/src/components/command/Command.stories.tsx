import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from "./Command";
import { Button } from "../button/Button";

const meta = {
  title: "Composite/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Command palette / combobox list, sourced from shadcn/ui (cmdk + Radix Dialog) and adapted to Lumen's token system — see docs/shadcn-integration.md. Colors, radius, and elevation all resolve through packages/ui/src/styles/shadcn-lumen-bridge.css onto existing Lumen semantic tokens; dark mode follows the same global `data-theme` toolbar toggle every other story in this system uses, not a separate story."
      }
    }
  }
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Command className="w-[320px] rounded-lg border shadow-[var(--shadow-menu-default)]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Search records</CommandItem>
          <CommandItem>Create new item</CommandItem>
          <CommandItem>
            Open settings
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Danger zone">
          <CommandItem disabled>Delete workspace (disabled)</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
};

/** cmdk highlights the first non-disabled item by default — this represents
 * the selected/highlighted row a keyboard or mouse user is currently on
 * (`data-[selected=true]` in command.tsx, mapped to the bridged `--accent`
 * token). */
export const SelectedState: Story = {
  render: () => (
    <Command className="w-[320px] rounded-lg border shadow-[var(--shadow-menu-default)]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandGroup heading="Suggestions">
          <CommandItem>Search records</CommandItem>
          <CommandItem>Create new item</CommandItem>
          <CommandItem>Open settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
};

export const DisabledItem: Story = {
  render: () => (
    <Command className="w-[320px] rounded-lg border shadow-[var(--shadow-menu-default)]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandGroup heading="Actions">
          <CommandItem>Available action</CommandItem>
          <CommandItem disabled>Unavailable action</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
};

/** cmdk renders CommandEmpty only once every item has been filtered out —
 * typing a query that matches nothing demonstrates the real empty state. */
export const EmptyState: Story = {
  render: function Render() {
    const [search, setSearch] = useState("no matches");
    return (
      <Command className="w-[320px] rounded-lg border shadow-[var(--shadow-menu-default)]">
        <CommandInput
          placeholder="Type a command or search..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Search records</CommandItem>
            <CommandItem>Create new item</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );
  }
};

export const LongContent: Story = {
  render: () => (
    <Command className="w-[320px] rounded-lg border shadow-[var(--shadow-menu-default)]">
      <CommandInput placeholder="Type a command or search..." />
      {/* CommandList caps at max-h-[300px] and scrolls — this group has more
          rows than fit, exercising that scroll behavior. */}
      <CommandList>
        <CommandGroup heading="All records">
          {Array.from({ length: 20 }, (_, i) => (
            <CommandItem key={i}>Record {i + 1}</CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
};

/** CommandDialog composes Command with Radix Dialog for a full command-palette
 * overlay — mirrors Modal.stories.tsx's own open/close Playground pattern.
 * Also demonstrates keyboard dismissal (Escape) and focus return to the
 * trigger button, both handled by Radix Dialog. */
export const OpenInDialog: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          setOpen((prev) => !prev);
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open command palette (⌘K)</Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem onSelect={() => setOpen(false)}>Search records</CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>Create new item</CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>Open settings</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    );
  }
};

/** Command has no fixed width of its own — this fixes the viewport-facing
 * container to a small (320px) width to demonstrate it stays usable at
 * mobile/narrow breakpoints. */
export const SmallViewport: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <Command className="w-full rounded-lg border shadow-[var(--shadow-menu-default)]">
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandGroup heading="Suggestions">
            <CommandItem>Search records</CommandItem>
            <CommandItem>Create new item</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
};
