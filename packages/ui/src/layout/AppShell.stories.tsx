import { useState, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppShell, type NavSection } from "./AppShell";
import { Icon } from "../primitives/Icon";
import { Avatar } from "../primitives/Avatar";
import { Badge } from "../primitives/Badge";
import { Button } from "../primitives/Button";
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
  LmSearchIcon,
  PlusIcon,
  SignalIcon,
  TrendingDownIcon,
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

function Brand({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className="flex items-center gap-[var(--spacing-8)]">
      <span
        className={
          mobile
            ? "flex size-[var(--spacing-24)] items-center justify-center rounded-md bg-[var(--color-app-shell-brand-primary)] font-brand text-app-logo-compact text-[var(--color-app-shell-text-on-brand)]"
            : "flex size-[var(--spacing-28)] items-center justify-center rounded-md bg-[var(--color-app-shell-brand-primary)] font-brand text-app-logo text-[var(--color-app-shell-text-on-brand)]"
        }
      >
        L
      </span>
      <span
        className={
          mobile
            ? "font-brand text-app-mobile-brand text-[var(--color-app-shell-text-primary)]"
            : "font-brand text-app-brand text-[var(--color-app-shell-text-primary)]"
        }
      >
        Lumen
      </span>
    </div>
  );
}

function SearchBar({ tablet = false }: { tablet?: boolean }) {
  return (
    <label
      className={
        tablet
          ? "flex h-[var(--spacing-40)] w-[var(--spacing-360)] items-center gap-[var(--spacing-8)] rounded-[var(--radius-app-search)] border border-[var(--color-app-shell-border-input)] bg-[var(--color-app-shell-background)] px-[var(--spacing-10)]"
          : "flex h-[var(--spacing-34)] w-[var(--spacing-400)] items-center gap-[var(--spacing-8)] rounded-lg border border-[var(--color-app-shell-border-input)] bg-[var(--color-app-shell-background)] px-[var(--spacing-10)]"
      }
    >
      <LmSearchIcon
        className="size-[var(--spacing-14)] shrink-0 text-[var(--color-app-shell-text-placeholder)]"
        aria-hidden
      />
      <span className="sr-only">Search or ask AI</span>
      <input
        className="min-w-0 flex-1 bg-transparent font-interface text-app-body text-[var(--color-app-shell-text-placeholder)] outline-none placeholder:text-[var(--color-app-shell-text-placeholder)]"
        placeholder="Search or ask AI..."
      />
      <kbd className="rounded-sm border border-[var(--color-app-shell-border-default)] bg-[var(--color-app-shell-surface)] px-[var(--spacing-4)] py-px font-interface text-app-caption text-[var(--color-app-shell-text-placeholder)]">
        ⌘K
      </kbd>
    </label>
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
      <Brand />
      <SearchBar tablet={tablet} />
      <div
        className={
          tablet
            ? "flex items-center gap-[var(--spacing-16)]"
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
          className="flex size-[var(--spacing-32)] items-center justify-center rounded-md text-[var(--color-app-shell-text-heading)]"
        >
          <BellIcon className="size-[var(--spacing-18)]" aria-hidden />
        </button>
        <Avatar
          name="Jane Doe"
          tone="neutral"
          size="md"
          className="bg-[var(--color-app-shell-text-muted)] text-app-label-semibold text-[var(--color-app-shell-text-on-brand)]"
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

function MobileHeader() {
  return (
    <div className="flex h-[var(--spacing-52)] items-center justify-between border-b border-[var(--color-app-shell-border-default)] bg-[var(--color-app-shell-surface)] px-[var(--spacing-16)]">
      <Brand mobile />
      <div className="flex items-center gap-[var(--spacing-12)]">
        <button
          type="button"
          aria-label="Search"
          className="flex size-[var(--spacing-32)] items-center justify-center"
        >
          <LmSearchIcon className="size-[var(--spacing-20)]" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="flex size-[var(--spacing-32)] items-center justify-center"
        >
          <BellIcon className="size-[var(--spacing-18)]" aria-hidden />
        </button>
        <Avatar
          name="Jane Doe"
          tone="neutral"
          size="md"
          className="bg-[var(--color-app-shell-text-muted)] text-[var(--color-app-shell-text-on-brand)]"
        />
      </div>
    </div>
  );
}

function StatusBadge({ tone, children }: { tone: "success" | "warning"; children: ReactNode }) {
  return (
    <Badge
      className={
        tone === "success"
          ? "bg-[var(--color-app-shell-status-success-bg)] px-[var(--spacing-8)] py-[var(--spacing-2)] text-app-caption-medium text-[var(--color-app-shell-status-success)]"
          : "bg-[var(--color-app-shell-status-warning-bg)] px-[var(--spacing-8)] py-[var(--spacing-2)] text-app-caption-medium text-[var(--color-app-shell-status-warning)]"
      }
    >
      {children}
    </Badge>
  );
}

function AppButton({
  accent = false,
  small = false,
  icon,
  children
}: {
  accent?: boolean;
  small?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Button
      variant={accent ? "accent" : "secondary"}
      size="xs"
      iconStart={icon}
      className={cnButton(small, accent)}
    >
      {children}
    </Button>
  );
}

function cnButton(small: boolean, accent: boolean) {
  const size = small
    ? "h-[var(--spacing-28)] min-w-0 border px-[var(--spacing-14)] py-[var(--spacing-6)] font-interface text-app-button-sm [letter-spacing:var(--text-app-button-sm-letter-spacing)]"
    : "h-[var(--spacing-34)] min-w-0 border px-[var(--spacing-14)] py-[var(--spacing-7)] font-interface text-app-button [letter-spacing:var(--text-app-button-letter-spacing)]";
  const color = accent
    ? "border-transparent bg-[var(--color-app-shell-button-accent-bg)] text-[var(--color-app-shell-button-accent-text)]"
    : "border-[var(--color-app-shell-button-secondary-border)] bg-[var(--color-app-shell-button-secondary-bg)] text-[var(--color-app-shell-button-secondary-text)] hover:bg-[var(--color-app-shell-button-secondary-bg)]";
  return `${size} ${color}`;
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
            <AppButton>Share</AppButton>
            <AppButton>Export</AppButton>
            <AppButton accent icon={<PlusIcon />}>
              New project
            </AppButton>
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
            <span className="size-[var(--spacing-6)] rounded-full bg-[var(--color-app-shell-status-danger)]" />
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
      <div className="flex flex-col gap-[var(--spacing-24)]">
        <div className="flex gap-[var(--spacing-6)] text-app-breadcrumb">
          <a href="#workspace" className="text-[var(--color-app-shell-text-link)]">
            Workspace
          </a>
          <span>›</span>
          <a href="#projects" className="text-[var(--color-app-shell-text-link)]">
            Projects
          </a>
          <span>›</span>
          <span>Renewal pipeline</span>
        </div>
        <div className="space-y-[var(--spacing-8)]">
          <h1 className="text-app-tablet-title text-[var(--color-app-shell-text-primary)]">
            Renewal pipeline
          </h1>
          <p className="text-app-tablet-body text-[var(--color-app-shell-text-secondary)]">
            Track all risk accounts and let the AI surface next steps.
          </p>
        </div>
        <div className="flex gap-[var(--spacing-12)]">
          <AppButton>Share</AppButton>
          <AppButton>Export</AppButton>
          <AppButton accent icon={<PlusIcon />}>
            New project
          </AppButton>
        </div>
      </div>
      <div className="flex gap-[var(--spacing-16)]">
        <KPICard label="Open renewals" value="47" delta="▲ 12% this quarter" />
        <KPICard label="At risk" value="9" delta="▲ 3 flagged" />
        <KPICard label="Forecast ARR" value="$4.2M" delta="83% confidence" />
      </div>
      <div className="px-[var(--spacing-32)]">
        <h2 className="pb-[var(--spacing-12)] text-app-table-heading">
          Accounts closing this quarter
        </h2>
        {accounts.map((account, index) => (
          <div
            key={account.name}
            className="flex items-center gap-[var(--spacing-12)] border-b border-[var(--color-app-shell-border-subtle)] bg-[var(--color-app-shell-surface)] px-[var(--spacing-16)] py-[var(--spacing-10)] text-app-nav"
          >
            <div className="flex w-[var(--spacing-120)] items-center gap-[var(--spacing-8)]">
              <span className="size-[var(--spacing-6)] rounded-full bg-[var(--color-app-shell-status-danger)]" />
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
  tone,
  children
}: {
  label: string;
  value: string;
  tone?: "success" | "warning" | "badge";
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--color-app-shell-border-subtle)] bg-[var(--color-app-shell-surface)] p-[var(--spacing-16)]">
      <div>
        <p className="text-app-label text-[var(--color-app-shell-text-secondary)]">{label}</p>
        <p className="text-app-mobile-value text-[var(--color-app-shell-text-body)]">{value}</p>
      </div>
      <div
        className={
          tone === "warning"
            ? "flex items-center gap-[var(--spacing-4)] rounded-md bg-[var(--color-app-shell-status-warning-bg)] px-[var(--spacing-8)] py-[var(--spacing-4)] text-app-label-semibold text-[var(--color-app-shell-status-warning)]"
            : tone === "badge"
              ? "rounded-md bg-[var(--color-app-shell-badge-bg)] px-[var(--spacing-8)] py-[var(--spacing-4)] text-app-label-semibold text-[var(--color-app-shell-badge-text)]"
              : "flex items-center gap-[var(--spacing-4)] rounded-md bg-[var(--color-app-shell-status-success-bg)] px-[var(--spacing-8)] py-[var(--spacing-4)] text-app-label-semibold text-[var(--color-app-shell-status-success)]"
        }
      >
        {children}
      </div>
    </div>
  );
}

function MobileContent() {
  return (
    <div className="flex flex-col gap-[var(--spacing-24)] pb-[var(--spacing-32)] pt-[var(--spacing-16)] tablet:hidden">
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
            <button className="rounded-full border border-[var(--color-app-shell-border-default)] bg-[var(--color-app-shell-surface)] px-[var(--spacing-12)] py-[var(--spacing-6)] text-app-label">
              All Filters
            </button>
            <button className="rounded-full border border-[var(--color-app-shell-border-default)] bg-[var(--color-app-shell-surface)] px-[var(--spacing-12)] py-[var(--spacing-6)] text-app-label">
              Sort: Days Left
            </button>
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
        <MobileMetric label="At risk" value="9" tone="warning">
          <TrendingDownIcon className="size-[var(--spacing-14)]" />3 flagged
        </MobileMetric>
        <MobileMetric label="Forecast ARR" value="$4.2M" tone="badge">
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
                <span className="size-[var(--spacing-8)] rounded-full bg-[var(--color-app-shell-status-danger)]" />
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
      className="justify-between px-[var(--spacing-24)] py-[var(--spacing-16)] [&>div:nth-of-type(1)]:rounded-md [&>div:nth-of-type(1)]:border [&>div:nth-of-type(1)]:border-[var(--color-app-shell-border-default)] [&>div:nth-of-type(1)]:bg-[var(--color-app-shell-background)] [&>div:nth-of-type(1)]:px-[var(--spacing-10)] [&>div:nth-of-type(1)]:py-[var(--spacing-6)]"
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
        workspace={{ name: "Northwind Corp", plan: "Enterprise" }}
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
        mobileHeader={<MobileHeader />}
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
                    <AppButton small>Review draft</AppButton>
                    <AppButton small>View accounts</AppButton>
                  </>
                )
              }
            ]}
            inputPlaceholder="Summarize pipeline..."
            onNewThread={() => {}}
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
  mobile: { name: "Mobile 390 × 1015", styles: { width: "390px", height: "1015px" } }
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
