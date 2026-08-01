import type { Meta, StoryObj } from "@storybook/react";
import { CodeBlock } from "./CodeBlock";

const meta = {
  title: "Primitives/CodeBlock",
  component: CodeBlock,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A syntax-highlighted, read-only code display, built on Shiki (dual `github-light`/`github-dark-default` themes) for real, theme-aware tokenization — adapted from the `@shadcn-space` registry's `code-block-01`. Chrome (header bar, borders, copy button) resolves through Lumen's shadcn bridge tokens; individual syntax-token colors come from Shiki's bundled themes and are not themselves Lumen tokens (see the component's own docblock for the full rationale)."
      }
    }
  },
  argTypes: {
    language: { control: "text" }
  },
  args: {
    code: `SELECT account, arr, risk_score FROM renewals WHERE quarter = 'Q3';`,
    language: "sql"
  }
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const TypeScript: Story = {
  args: {
    language: "tsx",
    filename: "Greeting.tsx",
    code: `export function Greeting({ name }: { name: string }) {
  return <p>Hello, {name}!</p>;
}`
  }
};

export const JsonExample: Story = {
  args: {
    language: "json",
    filename: "config.json",
    code: `{
  "variant": "primary",
  "size": "md",
  "disabled": false
}`
  }
};

export const Bash: Story = {
  args: {
    language: "bash",
    code: `pnpm --filter @lumen/tokens build`
  }
};

export const WithLineNumbers: Story = {
  args: {
    language: "tsx",
    filename: "Greeting.tsx",
    showLineNumbers: true,
    code: `export function Greeting({ name }: { name: string }) {
  return <p>Hello, {name}!</p>;
}`
  }
};

export const WithHighlightedLines: Story = {
  args: {
    language: "tsx",
    filename: "Greeting.tsx",
    showLineNumbers: true,
    highlightLines: [2],
    code: `export function Greeting({ name }: { name: string }) {
  return <p>Hello, {name}!</p>;
}`
  }
};

export const Scrollable: Story = {
  args: {
    language: "sql",
    filename: "renewals.sql",
    scrollable: true,
    maxHeight: 160,
    showLineNumbers: true,
    code: Array.from({ length: 20 }, (_, i) => `SELECT ${i + 1} AS row_number;`).join("\n")
  }
};
