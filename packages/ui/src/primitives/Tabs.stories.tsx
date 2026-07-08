import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabList, Tab, TabPanel } from "./Tabs";

const meta = {
  title: "Primitives/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Compound component: `<Tabs>` provides context, `<TabList>`/`<Tab>`/`<TabPanel>` consume it. Uncontrolled by default via `defaultValue`, or controlled via `value`/`onValueChange`."
      }
    },
    controls: { disable: true }
  },
  args: { children: null }
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <Tabs defaultValue="profile">
      <TabList>
        <Tab value="profile">Profile</Tab>
        <Tab value="team">Team</Tab>
        <Tab value="billing">Billing</Tab>
      </TabList>
      <TabPanel value="profile">
        <p className="pt-4 text-body-md text-[var(--color-text-body)]">Profile settings go here.</p>
      </TabPanel>
      <TabPanel value="team">
        <p className="pt-4 text-body-md text-[var(--color-text-body)]">Team settings go here.</p>
      </TabPanel>
      <TabPanel value="billing">
        <p className="pt-4 text-body-md text-[var(--color-text-body)]">Billing settings go here.</p>
      </TabPanel>
    </Tabs>
  )
};
