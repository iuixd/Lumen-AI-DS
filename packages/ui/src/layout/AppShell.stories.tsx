import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppShell, type NavSection } from "./AppShell";
import { Icon } from "../primitives/Icon";
import { Avatar } from "../primitives/Avatar";
import { Badge } from "../primitives/Badge";
import { Button } from "../primitives/Button";
import { Input } from "../primitives/Input";
import { KPICard } from "../primitives/KPICard";
import { ThemeToggle } from "../primitives/ThemeToggle";
import { AIPanel } from "../composite/AIPanel";
import { PageHeader } from "../composite/PageHeader";
import { Footer } from "./Footer";
import {
  ArrowLeftIcon,
  BatteryFullIcon,
  BellIcon,
  BotIcon,
  ChartBarIcon,
  DatabaseIcon,
  FolderIcon,
  HomeIcon,
  LmAuditLogIcon,
  LmProjectIcon,
  MenuIcon,
  PlusIcon,
  SignalIcon,
  TrendingUpIcon,
  WifiIcon
} from "../icons/generated";

const nav: NavSection[] = [
  {
    items: [
      { label: "Home", href: "#home", icon: <Icon name="home" className="size-full" /> },
      {
        label: "Inbox",
        href: "#inbox",
        badge: 5,
        icon: <Icon name="inbox" className="size-full" />
      },
      {
        label: "Projects",
        href: "#projects",
        active: true,
        icon: <LmProjectIcon className="size-full" />
      },
      { label: "Agents", href: "#agents", icon: <Icon name="bot" className="size-full" /> },
      { label: "Data", href: "#data", icon: <Icon name="database" className="size-full" /> },
      {
        label: "Reports",
        href: "#reports",
        icon: <Icon name="chart-column" className="size-full" />
      }
    ]
  },
  {
    label: "Admin",
    items: [
      { label: "Members", href: "#members", icon: <Icon name="id-card" className="size-full" /> },
      { label: "Billing", href: "#billing", icon: <Icon name="receipt" className="size-full" /> },
      { label: "Audit log", href: "#audit-log", icon: <LmAuditLogIcon className="size-full" /> }
    ]
  }
];

const accounts = [
  {
    name: "Meridian Health",
    value: "$380K",
    days: "15 days",
    status: "Draft ready",
    tone: "success" as const
  },
  {
    name: "Kestrel Logistics",
    value: "$215K",
    days: "28 days",
    status: "Pending",
    tone: "warning" as const
  },
  {
    name: "Aurora Fintech",
    value: "$490K",
    days: "44 days",
    status: "On track",
    tone: "success" as const
  }
];

function Brand({ mobile = false, tablet = false }: { mobile?: boolean; tablet?: boolean }) {
  return (
    <div className="flex items-center gap-[var(--spacing-8)]">
      <span
        className={
          mobile
            ? "flex size-[var(--spacing-28)] items-center justify-center rounded-md bg-[var(--color-app-shell-brand-primary)] font-brand text-app-logo-compact text-[var(--color-app-shell-text-on-brand)]"
            : "flex size-[var(--spacing-28)] items-center justify-center rounded-md bg-[var(--color-app-shell-brand-primary)] font-brand text-app-logo text-[var(--color-app-shell-text-on-brand)]"
        }
      >
        L
      </span>
      <span
        className={
          mobile
            ? "font-brand text-app-mobile-brand text-[var(--color-app-shell-text-primary)]"
            : tablet
              ? "font-brand text-app-brand text-[var(--color-app-shell-text-heading)]"
              : "font-brand text-app-brand text-[var(--color-app-shell-text-primary)]"
        }
      >
        Lumen
      </span>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="w-[var(--spacing-400)]">
      <Input
        size="md"
        variant="search"
        aria-label="Type your question"
        placeholder="Type your question..."
        className="h-[var(--spacing-36)]"
      />
    </div>
  );
}

function AppHeader({
  tablet = false,
  dark,
  onThemeChange
}: {
  tablet?: boolean;
  dark: boolean;
  onThemeChange: (dark: boolean) => void;
}) {
  return (
    <div
      className={
        tablet
          ? "flex w-full items-center justify-between px-[var(--spacing-24)]"
          : "flex w-full items-center justify-between px-[var(--spacing-16)]"
      }
    >
      <Brand tablet={tablet} />
      {!tablet && <SearchBar />}
      <div
        className={
          tablet
            ? "flex items-center gap-[var(--spacing-8)]"
            : "flex items-center gap-[var(--spacing-4)]"
        }
      >
        <ThemeToggle
          name={tablet ? "tablet-theme" : "desktop-theme"}
          checked={dark}
          onChange={(event) => onThemeChange(event.currentTarget.checked)}
        />
        <button
          type="button"
          aria-label="Notifications"
          className="flex size-[var(--spacing-32)] items-center justify-center rounded-md text-[var(--color-app-shell-icon-default)]"
        >
          <BellIcon className="size-[var(--spacing-18)]" aria-hidden />
        </button>
        <Avatar
          name="Jane Doe"
          tone="neutral"
          size="md"
          className={
            tablet
              ? "bg-[var(--color-app-shell-avatar-tablet-bg)] text-app-label-semibold text-[var(--color-app-shell-text-on-brand)]"
              : "bg-[var(--color-app-shell-avatar-bg)] text-app-label-semibold text-[var(--color-app-shell-text-on-brand)]"
          }
        />
      </div>
    </div>
  );
}

function MobileStatusBar() {
  return (
    <div className="flex h-[var(--spacing-44)] items-center justify-between px-[var(--spacing-16)] font-interface text-app-status-bar text-[var(--color-app-shell-text-primary)]">
      <span>9:41</span>
      <div className="flex items-center gap-[var(--spacing-6)]" aria-hidden>
        <SignalIcon className="h-[var(--spacing-11)] w-[var(--spacing-17)]" />
        <WifiIcon className="h-[var(--spacing-11)] w-[var(--spacing-15)]" />
        <BatteryFullIcon className="h-[var(--spacing-12)] w-[var(--spacing-25)]" />
      </div>
    </div>
  );
}

function MobileHeader({
  dark,
  onThemeChange
}: {
  dark: boolean;
  onThemeChange: (dark: boolean) => void;
}) {
  return (
    <div className="flex h-[var(--spacing-52)] items-center justify-between border-b border-[var(--color-app-shell-border-default)] bg-[var(--color-app-shell-surface)] px-[var(--spacing-16)]">
      <div className="flex items-center gap-[var(--spacing-12)]">
        <button
          type="button"
          aria-label="Open navigation"
          className="flex size-[var(--spacing-32)] items-center justify-center text-[var(--color-app-shell-icon-default)]"
        >
          <MenuIcon className="size-[var(--spacing-20)]" aria-hidden />
        </button>
        <Brand mobile />
      </div>
      <div className="flex items-center gap-[var(--spacing-8)]">
        <ThemeToggle
          name="mobile-theme"
          checked={dark}
          onChange={(event) => onThemeChange(event.currentTarget.checked)}
        />
        <button
          type="button"
          aria-label="Notifications"
          className="flex size-[var(--spacing-32)] items-center justify-center text-[var(--color-app-shell-icon-default)]"
        >
          <BellIcon className="size-[var(--spacing-18)]" aria-hidden />
        </button>
        <Avatar
          name="Jane Doe"
          tone="neutral"
          size="md"
          className="bg-[var(--color-app-shell-avatar-bg)] text-[var(--color-app-shell-text-on-brand)]"
        />
      </div>
    </div>
  );
}

function StatusBadge({ tone, children }: { tone: "success" | "warning"; children: ReactNode }) {
  return <Badge status={tone}>{children}</Badge>;
}

function DesktopContent() {
  return (
    <div className="hidden h-full flex-col desktop:flex">
      <PageHeader
        breadcrumbs={[
          { label: "Workspace", href: "#workspace" },
          { label: "Projects", href: "#projects" },
          { label: "Renewal pipeline" }
        ]}
        title="Renewal pipeline"
        description="Track all risk accounts and let the assistant draft outreach before contracts lapse."
        actions={
          <>
            <Button variant="secondary">Share</Button>
            <Button variant="secondary">Export</Button>
            <Button variant="primary" iconStart={<PlusIcon aria-hidden />}>
              New project
            </Button>
          </>
        }
      />
      <div className="flex gap-[var(--spacing-16)] px-[var(--spacing-32)] pb-[var(--spacing-20)]">
        <KPICard label="Open renewals" value="47" delta="▲ 12% this quarter" />
        <KPICard label="At risk" value="9" delta="▲ 3 flagged" />
        <KPICard label="Forecast ARR" value="$4.2M" delta="83% confidence" />
      </div>
      <div className="px-[var(--spacing-32)] pb-[var(--spacing-24)]">
        <h2 className="pb-[var(--spacing-12)] text-app-table-heading text-[var(--color-app-shell-text-body)]">
          Accounts closing this quarter
        </h2>
        {accounts.map((account) => (
          <div
            key={account.name}
            className="flex items-center gap-[var(--spacing-12)] border border-[var(--color-app-shell-border-subtle)] bg-[var(--color-app-shell-surface)] px-[var(--spacing-16)] py-[var(--spacing-10)] text-app-nav"
          >
            <span className="size-[var(--spacing-6)] rounded-full bg-[var(--color-app-shell-brand-dark)]" />
            <span className="min-w-0 flex-1 text-[var(--color-app-shell-text-body)]">
              {account.name}
            </span>
            <span className="text-[var(--color-app-shell-text-secondary)]">{account.value}</span>
            <span className="text-[var(--color-app-shell-text-secondary)]">{account.days}</span>
            <StatusBadge tone={account.tone}>{account.status}</StatusBadge>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabletContent() {
  return (
    <div className="hidden h-full flex-col gap-[var(--spacing-24)] p-[var(--spacing-32)] tablet:flex desktop:hidden">
      <div className="flex flex-col gap-[var(--spacing-16)] pb-[var(--spacing-20)]">
        <div className="flex gap-[var(--spacing-6)] text-app-breadcrumb text-[var(--color-app-shell-text-tertiary)]">
          <a href="#workspace" className="text-[var(--color-app-shell-text-link)]">
            Workspace
          </a>
          <span>›</span>
          <a href="#projects" className="text-[var(--color-app-shell-text-link)]">
            Projects
          </a>
          <span>›</span>
          <span className="text-[var(--color-app-shell-text-body)]">Renewal pipeline</span>
        </div>
        <h1 className="text-app-tablet-title text-[var(--color-app-shell-text-primary)]">
          Renewal pipeline
        </h1>
        <div className="flex gap-[var(--spacing-12)]">
          <Button variant="secondary">Share</Button>
          <Button variant="secondary">Export</Button>
          <Button variant="primary" iconStart={<PlusIcon aria-hidden />}>
            New project
          </Button>
        </div>
        <p className="text-app-tablet-body text-[var(--color-app-shell-text-secondary)]">
          Track all risk accounts and let the assistant draft outreach before contracts lapse.
        </p>
      </div>
      <div className="flex gap-[var(--spacing-16)]">
        <KPICard label="Open renewals" value="47" delta="▲ 12% this quarter" />
        <KPICard label="At risk" value="9" delta="▲ 3 flagged" />
        <KPICard label="Forecast ARR" value="$4.2M" delta="83% confidence" />
      </div>
      <div>
        <h2 className="pb-[var(--spacing-12)] text-app-table-heading">
          Accounts closing this quarter
        </h2>
        {accounts.map((account, index) => (
          <div
            key={account.name}
            className="flex items-center gap-[var(--spacing-12)] border-b border-[var(--color-app-shell-border-subtle)] bg-[var(--color-app-shell-surface)] px-[var(--spacing-16)] py-[var(--spacing-10)] text-app-nav"
          >
            <div className="flex w-[var(--spacing-120)] items-center gap-[var(--spacing-8)]">
              <span className="size-[var(--spacing-6)] rounded-full bg-[var(--color-app-shell-brand-dark)]" />
              <span className="truncate">{index === 1 ? "Kestrel Industries" : account.name}</span>
            </div>
            <span>{account.value}</span>
            <span className="flex-1 text-[var(--color-app-shell-text-secondary)]">
              {account.days}
            </span>
            <StatusBadge tone={account.tone}>{account.status}</StatusBadge>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileMetric({
  label,
  value,
  children
}: {
  label: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--color-app-shell-border-subtle)] bg-[var(--color-app-shell-surface)] p-[var(--spacing-16)]">
      <div>
        <p className="text-app-label text-[var(--color-app-shell-text-secondary)]">{label}</p>
        <p className="text-app-mobile-value text-[var(--color-app-shell-text-body)]">{value}</p>
      </div>
      <div className="flex items-center gap-[var(--spacing-4)] rounded-md bg-[var(--color-app-shell-status-success-bg)] px-[var(--spacing-8)] py-[var(--spacing-4)] text-app-label-semibold text-[var(--color-app-shell-status-success)]">
        {children}
      </div>
    </div>
  );
}

function MobileContent() {
  return (
    <div className="flex flex-col gap-[var(--spacing-24)] pb-[var(--spacing-32)] pt-[var(--spacing-32)] tablet:hidden">
      <div className="flex flex-col gap-[var(--spacing-12)] px-[var(--spacing-16)]">
        <a
          href="#projects"
          className="flex items-center gap-[var(--spacing-6)] text-app-button text-[var(--color-app-shell-text-link)]"
        >
          <ArrowLeftIcon className="size-[var(--spacing-20)]" />
          Projects
        </a>
        <div className="space-y-[var(--spacing-4)]">
          <h1 className="text-app-mobile-title text-[var(--color-app-shell-text-heading)]">
            Renewal pipeline
          </h1>
          <p className="text-app-mobile-body text-[var(--color-app-shell-text-secondary)]">
            Track risk accounts and coordinate customer outreach before contracts lapse.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-[var(--spacing-8)]">
            <Button variant="secondary">Share</Button>
            <Button variant="secondary">Export</Button>
          </div>
          <button
            aria-label="New project"
            className="flex size-[var(--spacing-40)] items-center justify-center rounded-full bg-[var(--color-app-shell-brand-primary)] text-[var(--color-app-shell-text-on-brand)]"
          >
            <PlusIcon className="size-[var(--spacing-16)]" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-[var(--spacing-12)] px-[var(--spacing-16)]">
        <MobileMetric label="Open renewals" value="47">
          <TrendingUpIcon className="size-[var(--spacing-14)]" />
          +12%
        </MobileMetric>
        <MobileMetric label="At risk" value="9">
          3 flagged
        </MobileMetric>
        <MobileMetric label="Forecast ARR" value="$4.2M">
          83% conf
        </MobileMetric>
      </div>
      <div className="flex flex-col gap-[var(--spacing-12)] px-[var(--spacing-16)]">
        <h2 className="text-app-table-heading">Accounts closing this quarter</h2>
        {accounts.map((account) => (
          <div
            key={account.name}
            className="flex flex-col gap-[var(--spacing-12)] rounded-xl border border-[var(--color-app-shell-border-subtle)] bg-[var(--color-app-shell-surface)] p-[var(--spacing-16)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[var(--spacing-8)]">
                <span className="size-[var(--spacing-8)] rounded-full bg-[var(--color-app-shell-brand-dark)]" />
                <strong className="text-app-table-name text-[var(--color-app-shell-text-primary)]">
                  {account.name}
                </strong>
              </div>
              <StatusBadge tone={account.tone}>{account.status}</StatusBadge>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-app-caption text-[var(--color-app-shell-text-secondary)]">
                  VALUE
                </p>
                <p className="text-app-nav text-[var(--color-app-shell-text-primary)]">
                  {account.value}
                </p>
              </div>
              <div className="text-right">
                <p className="text-app-caption text-[var(--color-app-shell-text-secondary)]">
                  CLOSING IN
                </p>
                <p className="text-app-nav text-[var(--color-app-shell-text-primary)]">
                  {account.days}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardContent() {
  return (
    <>
      <DesktopContent />
      <TabletContent />
      <MobileContent />
    </>
  );
}

function TabletFooter() {
  return (
    <Footer
      version="Lumen Platform v4.0"
      statusLabel="All systems normal"
      links={[
        { label: "Privacy", href: "#privacy" },
        { label: "Terms", href: "#terms" },
        { label: "Security", href: "#security" }
      ]}
      className="h-[var(--spacing-60)] justify-between px-[var(--spacing-24)] py-[var(--spacing-16)]"
    />
  );
}

function MobileNavigation() {
  const items = [
    { label: "Home", icon: HomeIcon },
    { label: "Inbox", icon: FolderIcon, active: true },
    { label: "Projects", icon: BotIcon },
    { label: "Agents", icon: DatabaseIcon },
    { label: "Reports", icon: ChartBarIcon }
  ];
  return (
    <div className="h-[var(--spacing-74)] border-t border-[var(--color-app-shell-border-default)] bg-[var(--color-app-shell-surface)]">
      <div className="flex items-center justify-between px-[var(--spacing-12)] pb-[var(--spacing-8)] pt-[var(--spacing-10)]">
        {items.map(({ label, icon: ItemIcon, active }) => (
          <a
            key={label}
            href={`#${label.toLowerCase()}`}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "flex w-[var(--spacing-64)] flex-col items-center gap-[var(--spacing-4)] text-app-bottom-nav text-[var(--color-app-shell-brand-primary)]"
                : "flex w-[var(--spacing-64)] flex-col items-center gap-[var(--spacing-4)] text-app-bottom-nav text-[var(--color-app-shell-text-secondary)]"
            }
          >
            <ItemIcon className="size-[var(--spacing-20)]" />
            <span>{label}</span>
          </a>
        ))}
      </div>
      <div className="flex h-[var(--spacing-20)] items-center justify-center">
        <div className="h-[var(--spacing-5)] w-[var(--spacing-140)] rounded-full bg-[var(--color-app-shell-toggle-bg)] opacity-30" />
      </div>
    </div>
  );
}

function AppShellDemo({ initialTheme }: { initialTheme: "light" | "dark" }) {
  const [theme, setTheme] = useState(initialTheme);
  const dark = theme === "dark";
  return (
    <div data-theme={theme} className="h-screen">
      <AppShell
        nav={nav}
        onCollapse={() => {}}
        onExpand={() => {}}
        header={
          <AppHeader dark={dark} onThemeChange={(next) => setTheme(next ? "dark" : "light")} />
        }
        tabletHeader={
          <AppHeader
            tablet
            dark={dark}
            onThemeChange={(next) => setTheme(next ? "dark" : "light")}
          />
        }
        mobileStatusBar={<MobileStatusBar />}
        mobileHeader={
          <MobileHeader dark={dark} onThemeChange={(next) => setTheme(next ? "dark" : "light")} />
        }
        assistant={
          <AIPanel
            messages={[
              { role: "user", content: "Which renewals should I focus on this week?" },
              {
                role: "assistant",
                content:
                  "Start with Meridian Health — $380k closing in 15 days with no exec touchpoint since May. I've drafted an outreach email referencing support tickets.",
                actions: (
                  <>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="secondary">Secondary</Button>
                  </>
                )
              }
            ]}
            inputPlaceholder="Summarize pipeline..."
          />
        }
        footer={
          <Footer
            version="Lumen Platform v4.0"
            statusLabel="All systems normal"
            links={[
              { label: "Privacy", href: "#privacy" },
              { label: "Terms", href: "#terms" },
              { label: "Security", href: "#security" }
            ]}
          />
        }
        tabletFooter={<TabletFooter />}
        mobileNavigation={<MobileNavigation />}
      >
        <DashboardContent />
      </AppShell>
    </div>
  );
}

const viewports = {
  desktop: { name: "Desktop 1440 × 900", styles: { width: "1440px", height: "900px" } },
  tablet: { name: "Tablet 768 × 1024", styles: { width: "768px", height: "1024px" } },
  mobile: { name: "Mobile 390 × 844", styles: { width: "390px", height: "844px" } }
};

const meta = {
  title: "Layout/AppShell",
  component: AppShell,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", viewport: { viewports }, controls: { disable: true } },
  args: { nav, children: null }
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopLight: Story = {
  render: () => <AppShellDemo initialTheme="light" />,
  parameters: { viewport: { defaultViewport: "desktop" } }
};
export const DesktopDark: Story = {
  render: () => <AppShellDemo initialTheme="dark" />,
  parameters: { viewport: { defaultViewport: "desktop" } }
};
export const TabletLight: Story = {
  render: () => <AppShellDemo initialTheme="light" />,
  parameters: { viewport: { defaultViewport: "tablet" } }
};
export const TabletDark: Story = {
  render: () => <AppShellDemo initialTheme="dark" />,
  parameters: { viewport: { defaultViewport: "tablet" } }
};
export const MobileLight: Story = {
  render: () => <AppShellDemo initialTheme="light" />,
  parameters: { viewport: { defaultViewport: "mobile" } }
};
export const MobileDark: Story = {
  render: () => <AppShellDemo initialTheme="dark" />,
  parameters: { viewport: { defaultViewport: "mobile" } }
};
