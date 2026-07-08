import type { Meta, StoryObj } from "@storybook/react";
import { AppShell, type NavItem } from "./AppShell";
import { Icon } from "../primitives/Icon";
import { Avatar } from "../primitives/Avatar";

const nav: NavItem[] = [
  { label: "Home", href: "#", active: true, icon: <Icon name="home" className="size-4" /> },
  { label: "Search", href: "#", icon: <Icon name="search" className="size-4" /> },
  { label: "Notifications", href: "#", icon: <Icon name="notification" className="size-4" /> },
  { label: "Settings", href: "#", icon: <Icon name="setting" className="size-4" /> }
];

const meta = {
  title: "Layout/AppShell",
  component: AppShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The standard product shell: fixed sidebar + main content area. Every enterprise screen should be built inside this shell rather than a bespoke layout."
      }
    },
    controls: { disable: true }
  },
  args: {
    nav,
    logo: <div className="text-title-md font-semibold text-[var(--color-text-title)]">Lumen</div>,
    header: (
      <div className="flex items-center justify-between">
        <h1 className="text-title-md text-[var(--color-text-title)]">Dashboard</h1>
        <Avatar name="Jane Cooper" size="sm" />
      </div>
    ),
    children: <p className="text-body-md text-[var(--color-text-body)]">Page content renders here.</p>
  }
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
