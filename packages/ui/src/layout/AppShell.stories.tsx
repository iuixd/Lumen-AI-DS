import type { Meta, StoryObj } from "@storybook/react";
import { AppShell, type NavItem } from "./AppShell";
import { Icon } from "../primitives/Icon";
import { Avatar } from "../primitives/Avatar";
import { Button } from "../primitives/Button";
import { ThemeToggle } from "../primitives/ThemeToggle";
import { Footer } from "./Footer";
import { BellIcon } from "../icons/generated";

const nav: NavItem[] = [
  { label: "Home", href: "#home", active: true, icon: <Icon name="home" className="size-4" /> },
  { label: "Search", href: "#search", icon: <Icon name="search" className="size-4" /> },
  { label: "Notifications", href: "#notifications", icon: <Icon name="notification" className="size-4" /> },
  { label: "Settings", href: "#settings", icon: <Icon name="setting" className="size-4" /> }
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

const railNav: NavItem[] = [
  { label: "Home", href: "#home", active: true, icon: <Icon name="home" className="size-5" /> },
  { label: "Search", href: "#search", icon: <Icon name="search" className="size-5" /> },
  { label: "Notifications", href: "#notifications", icon: <Icon name="notification" className="size-5" /> },
  { label: "Settings", href: "#settings", icon: <Icon name="setting" className="size-5" /> }
];

/** Sourced from the "appshell-desktop-closed-light" reference screen (Lumen-AI-Design-System, node 1197:1652): a 64px icon-only collapsed rail with a full-width header above it and a Footer below the content. */
export const Rail: Story = {
  args: {
    nav: railNav,
    variant: "rail",
    logo: (
      <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--color-brand-default)] text-body-md font-bold text-neutral-white">
        L
      </div>
    ),
    header: (
      <div className="flex w-full items-center justify-between">
        <div className="text-title-md font-semibold text-[var(--color-text-title)]">Lumen</div>
        <div className="flex items-center gap-2">
          <ThemeToggle name="theme" />
          <Button variant="tertiary" iconOnly aria-label="Notifications">
            <BellIcon className="size-4" />
          </Button>
          <Avatar name="Jane Doe" tone="neutral" size="sm" />
        </div>
      </div>
    ),
    footer: <Footer version="Lumen Platform v4.0" statusLabel="All systems normal" statusTone="success" />,
    children: <p className="p-8 text-body-md text-[var(--color-text-body)]">Page content renders here.</p>
  }
};
