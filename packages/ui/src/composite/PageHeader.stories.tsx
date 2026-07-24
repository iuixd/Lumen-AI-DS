import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "./PageHeader";
import { Button } from "../components/button/Button";
import { PlusIcon } from "../icons/generated";

const meta = {
  title: "Composite/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Sourced from the Figma 'appshell-desktop-closed-light' reference screen (Lumen-AI-Design-System, node 1197:1652): breadcrumbs, an H1 + trailing action-button row, and a description line."
      }
    }
  },
  args: {
    breadcrumbs: [{ label: "Workspace", href: "#" }, { label: "Projects", href: "#" }, { label: "Renewal pipeline" }],
    title: "Renewal pipeline",
    description: "Track all risk accounts and let the assistant draft outreach before contracts lapse.",
    actions: (
      <>
        <Button variant="secondary">Share</Button>
        <Button variant="secondary">Export</Button>
        <Button>
          <PlusIcon className="size-4" aria-hidden />
          New project
        </Button>
      </>
    )
  }
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithoutBreadcrumbs: Story = {
  args: { breadcrumbs: undefined }
};

export const WithoutActions: Story = {
  args: { actions: undefined }
};
