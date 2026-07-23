import type { Meta, StoryObj } from "@storybook/react";
import { CheckIcon, PlusIcon } from "../icons/generated";
import { Button, type ButtonProps } from "./Button";

const variants = ["primary", "accent", "secondary", "outline", "ghost", "destructive"] as const;
const sizes = ["sm", "md", "lg", "xl"] as const;

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
          "The final standard Button variants come from Figma node 1027:3733: Primary, Accent, Secondary, Outline, Ghost, and Destructive. Link actions use the standalone TextLink component. The sm, md, lg, and xl size geometry comes from node 1034:4459: 30px, 34px, 38px, and 42px high, with md as the default. Use Storybook's theme toggle to inspect either token mode."
      }
    }
  },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: sizes },
    disabled: { control: "boolean" }
  },
  args: { children: "Primary", variant: "primary", size: "md", disabled: false }
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
  const stateClass =
    state === "Hover"
      ? hoverClasses[variant]
      : state === "Focused"
        ? `ring-2 ring-[var(--color-button-focus-ring)] ring-offset-2 ring-offset-[var(--color-background-default)] ${variant === "outline" ? "border-[var(--color-button-outline-focus-border)]" : ""}`
        : "";

  return (
    <Button
      variant={variant}
      disabled={state === "Disabled"}
      iconStart={<CheckIcon aria-hidden />}
      className={`justify-self-start ${variant === "destructive" ? "col-start-8" : ""} ${stateClass}`}
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
                className={`text-label-sm capitalize text-[var(--color-text-muted)] ${variant === "destructive" ? "col-start-8" : ""}`}
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

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-10">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col items-start gap-3">
          <Button size={size} iconStart={<PlusIcon aria-hidden />}>
            {size === "sm"
              ? "Small"
              : size === "md"
                ? "Medium"
                : size === "lg"
                  ? "Large"
                  : "X-Large"}
          </Button>
          <span className="font-mono text-code-sm text-[var(--color-text-muted)]">
            {size} -{" "}
            {size === "sm" ? "30px" : size === "md" ? "34px" : size === "lg" ? "38px" : "42px"}
          </span>
        </div>
      ))}
    </div>
  )
};
