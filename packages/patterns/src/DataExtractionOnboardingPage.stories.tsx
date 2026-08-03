import type { Meta, StoryObj } from "@storybook/react";
import { DataExtractionOnboardingPage } from "./DataExtractionOnboardingPage";

const meta = {
  title: "Patterns/DataExtractionOnboardingPage",
  component: DataExtractionOnboardingPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The full, click-through data-extraction onboarding journey: enterprise login → file upload (click-to-browse, drag-and-drop onto the card, or drop anywhere on the page) → flat per-file upload progress → Create Project. Sourced from the \"Upload Component\" Figma section (fileKey `GJBYRm6ySR7XIECFcHMgy2`, nodes `1565:3097`/`1565:3375`/`1565:3140`/`1565:3298`/`1565:3337`). Every step is real, functional interaction — try the passkey button (auto-succeeds in this demo), dropping a file anywhere on the page during the upload step, and Create Project once every file finishes."
      }
    }
  },
  args: {
    loginProps: {
      userName: "johndoe@company.com",
      lastSignIn: "Last signed in 3 days ago · Bengaluru, IN · Chrome on macOS",
      recentWorkspaces: [{ id: "northwind", name: "Northwind Group", initial: "N" }],
      onStartPasskey: () => true,
      onSubmitCredentials: () => ({ success: true })
    },
    onProjectCreated: (files: File[]) => {
      console.log("Project created with", files.length, "files");
    }
  }
} satisfies Meta<typeof DataExtractionOnboardingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Jumps straight to the upload step — try dropping a file anywhere on the canvas, not just on the card. */
export const UploadStep: Story = {
  args: { initialStep: "upload" }
};
