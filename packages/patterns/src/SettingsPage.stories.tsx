import type { Meta, StoryObj } from "@storybook/react";
import { SettingsPage, type SettingsSection } from "./SettingsPage";
import { FormField, Input, Switch, Label, Stack } from "@lumen/ui";

const sections: SettingsSection[] = [
  {
    id: "profile",
    label: "Profile",
    content: (
      <Stack gap={16}>
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
      <Stack gap={12}>
        <div className="flex items-center gap-2">
          <Switch id="email-notifs" name="email-notifs" defaultChecked />
          <Label htmlFor="email-notifs">Email notifications</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="push-notifs" name="push-notifs" />
          <Label htmlFor="push-notifs">Push notifications</Label>
        </div>
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
