import type { Meta, StoryObj } from "@storybook/react";
import { AuthForm } from "./AuthForm";

const meta = {
  title: "Patterns/AuthForm",
  component: AuthForm,
  parameters: { layout: "fullscreen" },
  argTypes: {
    mode: { control: "select", options: ["sign-in", "sign-up"] }
  },
  args: { mode: "sign-in" }
} satisfies Meta<typeof AuthForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    onSubmit: (e) => e.preventDefault()
  }
};

export const SignUp: Story = {
  args: { mode: "sign-up", onSubmit: (e) => e.preventDefault() }
};
