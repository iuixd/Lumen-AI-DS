import type { Meta, StoryObj } from "@storybook/react";
import { EnterpriseLoginPage } from "./EnterpriseLoginPage";

const meta = {
  title: "Patterns/EnterpriseLoginPage",
  component: EnterpriseLoginPage,
  parameters: { layout: "fullscreen" },
  args: {
    userName: "Priya",
    orgName: "Northwind Group",
    lastSignIn: "Last signed in 3 days ago · Bengaluru, IN · Chrome on macOS",
    recentWorkspaces: [
      { id: "northwind", name: "Northwind Group", initial: "N" },
      { id: "acme", name: "Acme Legal", initial: "A" }
    ],
    statusText: "All systems operational",
    statusHref: "https://status.lumen.ai",
    dataResidencyNote: "Data residency: EU (Frankfurt) · Tenant lumen-nw-eu-1"
  }
} satisfies Meta<typeof EnterpriseLoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SignInError: Story = {
  args: {
    onSubmitCredentials: () => ({
      success: false,
      error: "That password doesn't match our records. 4 attempts remaining before this account is temporarily locked."
    })
  }
};

export const Passkey: Story = {
  args: { initialScreen: "passkey" }
};

export const MultiFactorAuth: Story = {
  args: { initialScreen: "mfa" }
};

export const SignedIn: Story = {
  args: { initialScreen: "done" }
};

export const NoRecentWorkspaces: Story = {
  args: { recentWorkspaces: [], lastSignIn: undefined, userName: "there" }
};
