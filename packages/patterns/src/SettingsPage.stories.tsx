import type { Meta, StoryObj } from "@storybook/react";
import { SettingsPage, type SettingsSection } from "./SettingsPage";
import { FormField, Input, Switch, Stack } from "@lumen/ui";

const sections: SettingsSection[] = [
  {
    id: "profile",
    label: "Profile",
    content: (
      <Stack gap={4}>
        <FormField label="Full name" htmlFor="name">
          <Input id="name" defaultValue="Jane Cooper" />
        </FormField>
        <FormField label="Work email" htmlFor="email">
          <Input id="email" type="email" defaultValue="jane@lumen.dev" />
        </FormField>
      </Stack>
    )
  },
  {
    id: "notifications",
    label: "Notifications",
    content: (
      <Stack gap={3}>
        <Switch name="email-notifs" label="Email notifications" defaultChecked />
        <Switch name="push-notifs" label="Push notifications" />
      </Stack>
    )
  },
  {
    id: "billing",
    label: "Billing",
    content: <p className="text-body-md text-[var(--color-text-body)]">Billing details go here.</p>
  }
];

const meta = {
  title: "Patterns/SettingsPage",
  component: SettingsPage,
  parameters: { layout: "fullscreen", controls: { disable: true } },
  args: { title: "Settings", sections }
} satisfies Meta<typeof SettingsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
