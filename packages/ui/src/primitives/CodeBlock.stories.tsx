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
          "A syntax-highlighted, read-only code display, built on `prism-react-renderer` for real language-aware tokenization. Sourced from Lumen-AI-Design-System node `1484:2905` — only two Prism token colors are Figma-evidenced (keywords/operators, strings); every other token type renders in the plain text color rather than an invented one."
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
    code: `export function Greeting({ name }: { name: string }) {
  return <p>Hello, {name}!</p>;
}`
  }
};

export const JsonExample: Story = {
  args: {
    language: "json",
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
