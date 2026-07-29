import { Highlight, type Language, type PrismTheme } from "prism-react-renderer";
import { cn } from "../lib/cn";

/**
 * CodeBlock — a syntax-highlighted, read-only code display.
 *
 * Sourced from Lumen-AI-Design-System node `1484:2905` ("AI Response
 * Components"), read via `get_design_context`/`get_variable_defs` on
 * 2026-07-29. Figma evidences a dark `bg/code` (#111111) container and
 * exactly two syntax-highlight colors: SQL keywords/operators in
 * `#F8A6C9` and string literals in `#83D197`. Real tokenization is
 * provided by `prism-react-renderer` (Prism grammars) rather than a
 * hand-rolled parser, at direct user request ("full fledge reusable
 * codeblock component with real syntax highlighter"); every other Prism
 * token type (comment, number, function, punctuation, etc.) has no Figma
 * evidence and is deliberately left at the plain text color rather than
 * an invented color.
 */
const lumenCodeTheme: PrismTheme = {
  plain: {
    color: "var(--color-text-inverse)"
  },
  styles: [
    {
      types: ["keyword", "operator", "builtin"],
      style: { color: "var(--color-code-syntax-keyword)" }
    },
    {
      types: ["string", "char"],
      style: { color: "var(--color-code-syntax-string)" }
    }
  ]
};

export interface CodeBlockProps {
  /** The source code to display. */
  code: string;
  /** Prism language identifier — e.g. "sql", "tsx", "json", "bash". Defaults to "sql" (the evidenced Figma example). */
  language?: Language;
  className?: string;
}

export function CodeBlock({ code, language = "sql", className }: CodeBlockProps) {
  return (
    <Highlight theme={lumenCodeTheme} code={code.trim()} language={language}>
      {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={cn(
            "overflow-x-auto rounded-[var(--radius-button)] bg-[var(--color-code-bg)] px-[var(--spacing-16)] py-[var(--spacing-12)] font-mono text-code-md",
            highlightClassName,
            className
          )}
          style={style}
        >
          {tokens.map((line, lineIndex) => {
            const lineProps = getLineProps({ line });
            return (
              <div key={lineIndex} {...lineProps}>
                {line.map((token, tokenIndex) => {
                  const tokenProps = getTokenProps({ token });
                  return <span key={tokenIndex} {...tokenProps} />;
                })}
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
}
