import type { Meta, StoryObj } from "@storybook/react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./Resizable";

const meta = {
  title: "Composite/Resizable",
  component: ResizablePanelGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Draggable-divider layout panels, sourced from shadcn/ui (react-resizable-panels) and adapted to Lumen's token system — see docs/shadcn-integration.md. Dark mode follows the global `data-theme` toolbar toggle, not a separate story."
      }
    }
  }
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ResizablePanelGroup direction="horizontal" className="h-48 max-w-md rounded-md border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">One</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">Two</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
};

export const WithHandleGrip: Story = {
  render: () => (
    <ResizablePanelGroup direction="horizontal" className="h-48 max-w-md rounded-md border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">One</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">Two</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
};

export const Vertical: Story = {
  render: () => (
    <ResizablePanelGroup direction="vertical" className="h-64 max-w-md rounded-md border">
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">Header</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full items-center justify-center p-6">Content</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
};

export const ThreePanels: Story = {
  render: () => (
    <ResizablePanelGroup direction="horizontal" className="h-48 max-w-2xl rounded-md border">
      <ResizablePanel defaultSize={20} minSize={10}>
        <div className="flex h-full items-center justify-center p-6">Sidebar</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60}>
        <div className="flex h-full items-center justify-center p-6">Main</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={20} minSize={10}>
        <div className="flex h-full items-center justify-center p-6">Inspector</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
};
