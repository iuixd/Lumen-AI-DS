import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SideNav, type NavSection } from "./SideNav";
import { LumenLogo } from "../primitives/LumenLogo";
import {
  DatabaseIcon,
  FileChartColumnIcon,
  HouseIcon,
  IdCardLanyardIcon,
  InboxIcon,
  LmAiOutlineIcon,
  LmAuditLogIcon,
  LmProjectIcon,
  ReceiptTextIcon
} from "../icons/generated";

// Icons match Figma node 1498:2877 ("SideNav") exactly by glyph name — e.g.
// Home is HouseIcon ("house" in Figma), Agents is LmAiOutlineIcon
// ("lm-ai-outline"), Reports is FileChartColumnIcon ("file-chart-column"),
// Members is IdCardLanyardIcon ("id-card-lanyard"), Billing is
// ReceiptTextIcon ("receipt-text").
const nav: NavSection[] = [
  {
    items: [
      { label: "Home", href: "#home", icon: <HouseIcon className="size-full" /> },
      {
        label: "Inbox",
        href: "#inbox",
        badge: 5,
        icon: <InboxIcon className="size-full" />
      },
      {
        label: "Projects",
        href: "#projects",
        active: true,
        icon: <LmProjectIcon className="size-full" />
      },
      { label: "Agents", href: "#agents", icon: <LmAiOutlineIcon className="size-full" /> },
      { label: "Data", href: "#data", icon: <DatabaseIcon className="size-full" /> },
      {
        label: "Reports",
        href: "#reports",
        icon: <FileChartColumnIcon className="size-full" />
      }
    ]
  },
  {
    label: "Admin",
    items: [
      {
        label: "Members",
        href: "#members",
        icon: <IdCardLanyardIcon className="size-full" />
      },
      { label: "Billing", href: "#billing", icon: <ReceiptTextIcon className="size-full" /> },
      { label: "Audit log", href: "#audit-log", icon: <LmAuditLogIcon className="size-full" /> }
    ]
  }
];

const screenHeightDecorator = (Story: () => React.JSX.Element) => (
  <div className="flex h-screen">
    <Story />
  </div>
);

const meta = {
  title: "Layout/SideNav",
  component: SideNav,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Lumen's collapsible desktop navigation column (Figma node 1498:2877). A single persistent component — the width, labels, and footer control all transition together instead of swapping between two separate trees. At tablet widths it always shows the icon-only rail regardless of `expanded`, matching AppShell's original responsive behavior."
      }
    }
  },
  args: {
    nav,
    expanded: true
  },
  decorators: [screenHeightDecorator]
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  args: {
    expanded: true,
    onCollapse: () => {}
  }
};

export const Collapsed: Story = {
  args: {
    expanded: false,
    onExpand: () => {}
  }
};

export const WithWorkspace: Story = {
  args: {
    expanded: true,
    onCollapse: () => {},
    workspace: { name: "Northwind Corp", plan: "Enterprise" }
  }
};

/** A custom `workspace.logo` (here, Lumen's own brand mark) overrides the default initial-letter fallback. */
export const WithCustomLogo: Story = {
  args: {
    expanded: true,
    onCollapse: () => {},
    workspace: {
      name: "Lumen",
      logo: <LumenLogo className="h-[21.8788px] w-[21.2423px]" title="" />
    }
  }
};

/** Click the footer control to see the real, animated expand/collapse interaction. */
export const Interactive: Story = {
  render: (args) => {
    function InteractiveSideNav() {
      const [expanded, setExpanded] = useState(true);
      return (
        <SideNav
          {...args}
          expanded={expanded}
          onCollapse={() => setExpanded(false)}
          onExpand={() => setExpanded(true)}
        />
      );
    }
    return <InteractiveSideNav />;
  }
};
