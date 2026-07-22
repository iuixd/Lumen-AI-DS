import type { Meta, StoryObj } from "@storybook/react";
import { CheckIcon } from "../icons/generated";
import { Button, type ButtonProps } from "./Button";

const variants = ["primary", "accent", "secondary", "outline", "ghost", "destructive"] as const;

const hoverClasses: Record<(typeof variants)[number], string> = {
  primary:
    "bg-[var(--color-button-primary-hover-bg)] text-[var(--color-button-primary-hover-on-action)]",
  accent:
    "bg-[var(--color-button-accent-hover-bg)] text-[var(--color-button-accent-hover-on-action)]",
  secondary:
    "border-[var(--color-button-secondary-hover-border)] bg-[var(--color-button-secondary-hover-bg)] text-[var(--color-button-secondary-hover-on-action)]",
  outline:
    "border-[var(--color-button-outline-hover-border)] bg-[var(--color-button-outline-hover-bg)] text-[var(--color-button-outline-hover-on-action)]",
  ghost: "bg-[var(--color-button-ghost-hover-bg)]",
  destructive: "bg-[var(--color-button-destructive-hover-bg)]"
};

const meta = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "The standard Button collection includes Primary, Accent, Secondary, Outline, Ghost, and Destructive. All six variants use the 34px geometry and support light and dark Default, Hover, Focused, and Disabled roles. Link actions use the standalone TextLink component instead of a Button variant. Use Storybook's theme toggle to inspect either token mode."
      }
    }
  },
  argTypes: {
    variant: { control: "select", options: variants },
    disabled: { control: "boolean" }
  },
  args: { children: "Primary", variant: "primary", disabled: false }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

function StateButton({
  variant,
  state
}: {
  variant: NonNullable<ButtonProps["variant"]>;
  state: "Default" | "Hover" | "Focused" | "Disabled";
}) {
  return (
    <Button
      variant={variant}
      disabled={state === "Disabled"}
      iconStart={<CheckIcon aria-hidden />}
      className={
        state === "Hover"
          ? hoverClasses[variant]
          : state === "Focused"
            ? `ring-2 ring-[var(--color-button-focus-ring)] ring-offset-2 ring-offset-[var(--color-background-default)] ${variant === "outline" ? "border-[var(--color-button-outline-focus-border)]" : ""}`
            : undefined
      }
    >
      {variant[0].toUpperCase() + variant.slice(1)}
    </Button>
  );
}

export const FinalVariantCollection: Story = {
  parameters: { controls: { disable: true }, layout: "fullscreen" },
  render: () => (
    <div className="grid gap-6 bg-[var(--color-background-subtle)] p-6">
      {(["light", "dark"] as const).map((theme) => (
        <section
          key={theme}
          data-theme={theme}
          className="overflow-x-auto rounded-lg bg-[var(--color-background-default)] p-6"
        >
          <h2 className="mb-5 font-interface text-heading-sm capitalize text-[var(--color-text-heading)]">
            {theme}
          </h2>
          <div className="grid min-w-[800px] grid-cols-[80px_repeat(6,minmax(110px,1fr))] items-center gap-x-4 gap-y-4">
            <span />
            {variants.map((variant) => (
              <span
                key={variant}
                className="text-label-sm capitalize text-[var(--color-text-muted)]"
              >
                {variant}
              </span>
            ))}
            {(["Default", "Hover", "Focused", "Disabled"] as const).map((state) => (
              <div className="contents" key={state}>
                <span className="text-label-sm text-[var(--color-text-muted)]">{state}</span>
                {variants.map((variant) => (
                  <StateButton key={variant} variant={variant} state={state} />
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
};

export const IconPositions: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex gap-3">
      <Button iconStart={<CheckIcon aria-hidden />}>Leading icon</Button>
      <Button iconEnd={<CheckIcon aria-hidden />} variant="secondary">
        Trailing icon
      </Button>
    </div>
  )
};
