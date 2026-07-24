import { useState, type ChangeEvent } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Icon, type IconProps } from "./Icon";
import { Input } from "../components/input/Input";
import { iconRegistry } from "../icons/generated/registry";

const meta = {
  title: "Primitives/Icon",
  component: Icon,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Looks up a generated icon by name — for data-driven cases where the icon isn't known until render. Prefer importing the specific `{Name}Icon` component directly when the icon is static in JSX, so bundlers can tree-shake unused icons — this matters more than usual here: the registry below eagerly imports all ~1,920 icons, so any use of <Icon name> pulls the whole set into the bundle. Three sources feed this set: a curated Sharp/Light starter subset of the old Iconly library (not the full 1,949-icon set), the form-control state glyphs (checkbox/radio) from the current Lumen-AI-Design-System Figma file's 'Icons' page, and 1,893 icons from that same file's much larger bulk icon library (Lucide-style generic icons, a curated Lumen-branded subset, and third-party brand logos rendered in their authentic colors rather than currentColor). See docs/figma-sync.md for the extraction workflow for all three."
      }
    }
  },
  argTypes: {
    name: { control: "select", options: Object.keys(iconRegistry) }
  },
  args: { name: "home" }
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args: IconProps) => <Icon {...args} className="size-6 text-[var(--color-text-title)]" />
};

const allIconNames = Object.keys(iconRegistry);

function AllIconsGrid() {
  const [query, setQuery] = useState("");
  const filtered = query.trim()
    ? allIconNames.filter((name) => name.includes(query.trim().toLowerCase()))
    : allIconNames;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          type="search"
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          placeholder="Search icons by name…"
          aria-label="Search icons by name"
          className="max-w-xs"
        />
        <span className="text-label-sm text-[var(--color-text-muted)]">
          {filtered.length} of {allIconNames.length} icons
        </span>
      </div>
      {filtered.length === 0 ? (
        <p className="text-body-md text-[var(--color-text-muted)]">No icons match “{query}”.</p>
      ) : (
        <div className="grid grid-cols-6 gap-4">
          {filtered.map((name) => (
            <div key={name} className="flex flex-col items-center gap-2 rounded-md border border-[var(--color-border-default)] p-3">
              <Icon name={name} className="size-6 text-[var(--color-text-title)]" />
              <span className="text-label-sm text-[var(--color-text-muted)]">{name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const AllIcons: Story = {
  parameters: { controls: { disable: true } },
  render: () => <AllIconsGrid />
};
