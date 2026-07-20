import type { Meta, StoryObj } from "@storybook/react";
import { AppShell, type NavSection } from "./AppShell";
import { Icon } from "../primitives/Icon";
import { Avatar } from "../primitives/Avatar";
import { Button } from "../primitives/Button";
import { ThemeToggle } from "../primitives/ThemeToggle";
import { Footer } from "./Footer";
import { BellIcon } from "../icons/generated";

/** Sourced from the canonical "AppShell" page's `SideNav/Expanded` component (Lumen-AI-Design-System, node 1007:3700, `1079:2427`). */
const nav: NavSection[] = [
  {
    items: [
      { label: "Home", href: "#home", icon: <Icon name="home" className="size-5" /> },
      { label: "Inbox", href: "#inbox", badge: 5, icon: <Icon name="inbox" className="size-5" /> },
      { label: "Projects", href: "#projects", active: true, icon: <Icon name="folder" className="size-5" /> },
      { label: "Agents", href: "#agents", icon: <Icon name="bot" className="size-5" /> },
      { label: "Data", href: "#data", icon: <Icon name="database" className="size-5" /> },
      { label: "Reports", href: "#reports", icon: <Icon name="chart-column" className="size-5" /> }
    ]
  },
  {
    label: "Admin",
    items: [
      { label: "Members", href: "#members", icon: <Icon name="id-card" className="size-5" /> },
      { label: "Billing", href: "#billing", icon: <Icon name="receipt" className="size-5" /> },
      { label: "Audit log", href: "#audit-log", icon: <Icon name="history" className="size-5" /> }
    ]
  }
];

const desktopHeader = (
  <div className="flex w-full items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="flex size-7 items-center justify-center rounded-md bg-[var(--color-brand-default)] text-label-md font-bold text-neutral-white">
        L
      </div>
      <span className="text-body-md font-semibold text-[var(--color-text-title)]">Lumen</span>
    </div>
    <div className="flex items-center gap-1">
      <ThemeToggle name="theme" />
      <Button variant="tertiary" iconOnly aria-label="Notifications">
        <BellIcon className="size-4" />
      </Button>
      <Avatar name="Jane Doe" tone="neutral" size="sm" />
    </div>
  </div>
);

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
    workspace: { name: "Northwind Corp", plan: "Enterprise" },
    onCollapse: () => {},
    header: desktopHeader,
    footer: <Footer version="Lumen Platform v4.0" statusLabel="All systems normal" statusTone="success" />,
    children: <p className="text-body-md text-[var(--color-text-body)]">Page content renders here.</p>
  }
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const railNav: NavSection[] = [
  {
    items: [
      { label: "Home", href: "#home", active: true, icon: <Icon name="home" className="size-5" /> },
      { label: "Search", href: "#search", icon: <Icon name="search" className="size-5" /> },
      { label: "Notifications", href: "#notifications", icon: <Icon name="notification" className="size-5" /> },
      { label: "Settings", href: "#settings", icon: <Icon name="setting" className="size-5" /> }
    ]
  }
];

/** Sourced from the canonical "AppShell" page's `NavigationRail` component (Lumen-AI-Design-System, node 1007:3700, `1079:2686`) — a 64px icon-only collapsed rail with a full-width header above it and a Footer below the content. */
export const Rail: Story = {
  args: {
    nav: railNav,
    variant: "rail",
    workspace: undefined,
    onCollapse: undefined,
    logo: (
      <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--color-brand-default)] text-body-md font-bold text-neutral-white">
        L
      </div>
    ),
    header: desktopHeader,
    footer: <Footer version="Lumen Platform v4.0" statusLabel="All systems normal" statusTone="success" />,
    children: <p className="p-8 text-body-md text-[var(--color-text-body)]">Page content renders here.</p>
  }
};
