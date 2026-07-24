import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

const meta = {
  title: "Composite/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "shadcn/ui's own Tabs (Radix Tabs), sourced and adapted to Lumen's token system — see docs/shadcn-integration.md §7.8. Promoted to this plain name after Lumen's original hand-built `Tabs` primitive was retired in its favor. Dark mode follows the global `data-theme` toolbar toggle, not a separate story."
      }
    }
  },
  args: { defaultValue: "account" }
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args} className="w-[360px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-body-sm">Account settings go here.</p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-body-sm">Password settings go here.</p>
      </TabsContent>
    </Tabs>
  )
};
