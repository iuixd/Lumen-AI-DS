import { useEffect, useState } from "react";
import { codeToHtml, type BundledLanguage } from "shiki";
import { cn } from "../lib/cn";
import { Button } from "../components/button/Button";
import { CheckIcon } from "../icons/generated/CheckIcon";
import { CopyIcon } from "../icons/generated/CopyIcon";
import { FileCodeIcon } from "../icons/generated/FileCodeIcon";

/**
 * CodeBlock — a syntax-highlighted, read-only code display.
 *
 * Rewritten 2026-07-31 (direct user request: "install and replace existing
 * code block UI with Shadcn code block ui" — the previous build's single,
 * dark-only, Figma-evidenced color scheme wasn't legible against a light
 * surface at all). Adapted from the "shadcn-space" third-party registry's
 * `code-block-01` (`https://shadcnspace.com/r/code-block-01.json`, MIT-style
 * community registry, not shadcn's own core `registry:ui` set — that set has
 * no code-block component at all, confirmed via a direct 404 against both
 * `ui.shadcn.com/r/code-block.json` and the `new-york`-style path, the same
 * verification pattern this repo's other "requested but unavailable"
 * components already establish) — per direct user decision, only the core
 * single-file `CodeBlock` export was adopted, not the same source's
 * `MultiFileCodeBlock`/`LanguageTabsCodeBlock`/`InstallCommand` (no consumer
 * needs tabbed files, language switching, or package-manager install
 * commands today; those, and the four inlined pnpm/npm/yarn/bun icon
 * components they alone depended on, were dropped entirely rather than
 * shipped as unused code).
 *
 * Adaptation from the registry source:
 * - Relative imports; dropped the Next.js `"use client"` directive (no
 *   other file in this repo uses it, same call already made for
 *   `Resizable`).
 * - `Check`/`Copy`/`FileCode2` (lucide-react) replaced with Lumen's own
 *   generated `CheckIcon`/`CopyIcon`/`FileCodeIcon` — all three already
 *   existed in `icons/generated`, no new icon needed.
 * - The registry's own inline `Button` (shadcn's generic one) replaced with
 *   `@lumen/ui`'s own public `Button` (itself shadcn-sourced and canonical
 *   since docs/shadcn-integration.md §7.8 — not a second, competing
 *   button), overridden to a smaller `size-7` footprint via `className`
 *   (this component's copy control sits in a compact 40px header bar;
 *   `Button`'s own smallest built-in preset, `size="icon"`, is 36px).
 * - Container chrome (`border`, `bg-muted`, `bg-background`,
 *   `text-muted-foreground`, `text-foreground`) already resolves through
 *   the existing `shadcn-lumen-bridge.css` → real Lumen semantic tokens,
 *   automatically correct in both themes — this is the actual fix for the
 *   reported dark-mode legibility problem, not a new color decision. Per
 *   docs/shadcn-integration.md §5's standing rule that opacity modifiers
 *   are unreliable against this repo's hex-based (not HSL-triple) bridged
 *   colors, the registry's `bg-muted/50` header-bar background was
 *   corrected to solid `bg-muted`.
 * - The registry's hardcoded `text-teal-400` (copy-success checkmark) has
 *   no Lumen token behind it at all; replaced with the real
 *   `--color-status-success` token. The line-highlight background/border
 *   (raw `oklch(...)` literals in the source, an amber tint) replaced with
 *   the existing `--color-status-warning-subtle`/`-border` token pair — a
 *   real, already-theme-aware match for the same warm-amber highlight
 *   intent, not an invented color.
 * - The registry injects two small CSS rules (line-number counters, the
 *   highlighted-line style) via a runtime `document.createElement("style")`
 *   call rather than a stylesheet, since Shiki's per-token colors are
 *   inline HTML styles that Tailwind's own utility classes can't reach
 *   into — kept, since this repo has no other mechanism for styling inside
 *   `dangerouslySetInnerHTML`'d markup either, but the injected rule's
 *   color values were pointed at the same bridged/Lumen tokens above
 *   instead of the source's own raw literals, and the injected `<style>`
 *   element's id was renamed into this repo's own `lm-*` namespace
 *   (matching `lumen-skeleton-pulse`/`lumen-hero-rotate`'s existing
 *   convention) rather than the registry's generic `ss-code-block`.
 * - Real syntax-highlight token colors (keywords, strings, comments,
 *   punctuation, ...) are NOT Lumen tokens and are a disclosed, deliberate
 *   exception to the "every visual property resolves to a token" rule:
 *   Shiki bakes each token's color as an inline style computed from its
 *   `themes` option (`github-light`/`github-dark-default`, Shiki's own
 *   bundled dual themes chosen specifically for cross-theme legibility —
 *   the reported problem), not a CSS class a Lumen variable could
 *   intercept. Hand-mapping dozens of Shiki token types onto bespoke
 *   tokens was judged impractical and out of scope; the previous
 *   implementation already had the identical gap for every Prism token
 *   type beyond the two Figma had evidenced (see this file's prior
 *   history) — full syntax-color token coverage was never actually
 *   achieved before this rewrite either.
 * - `language` is now Shiki's own `BundledLanguage` type (previously
 *   Prism's `Language`) — both use compatible identifiers for every
 *   language this repo's one real consumer (`AIResponseCard`) passes
 *   today ("sql"), so no call-site change was needed.
 */

const CODE_BLOCK_STYLES_ID = "lm-code-block-styles";
const CODE_BLOCK_STYLES = `
.lm-code-block-line-numbers code { counter-reset: line; counter-increment: line 0; }
.lm-code-block-line-numbers .line::before {
  content: counter(line);
  counter-increment: line;
  display: inline-block;
  min-width: 1.5rem;
  padding-right: 0.75rem;
  margin-right: 1rem;
  text-align: right;
  font-size: 0.75rem;
  line-height: 1.7;
  user-select: none;
  color: var(--muted-foreground);
}
.lm-code-block-highlight-lines .line-highlighted {
  display: block;
  background-color: var(--color-status-warning-subtle);
  border-left: 2px solid var(--color-status-warning-border);
  margin: 0 -1rem;
  padding: 0 1rem;
}
`;

function injectCodeBlockStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(CODE_BLOCK_STYLES_ID)) return;
  const style = document.createElement("style");
  style.id = CODE_BLOCK_STYLES_ID;
  style.textContent = CODE_BLOCK_STYLES;
  document.head.appendChild(style);
}

async function renderCode(code: string, language: string, highlightLines?: number[]): Promise<string> {
  return codeToHtml(code, {
    lang: language as BundledLanguage,
    themes: { light: "github-light", dark: "github-dark-default" },
    tabindex: false,
    transformers: [
      {
        pre(node) {
          // Strip Shiki's own inline background so bodyClassName shows through instead.
          if (node.properties?.style) {
            node.properties.style = (node.properties.style as string)
              .replace(/background-color:\s*[^;]+;?\s*/gi, "")
              .replace(/--shiki-dark-bg:\s*[^;]+;?\s*/gi, "");
          }
        },
        line(node, line) {
          if (highlightLines?.includes(line)) {
            this.addClassToHast(node, "line-highlighted");
          }
        }
      }
    ]
  });
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (typeof window === "undefined" || !navigator?.clipboard) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className="size-7 shrink-0"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy code"}
    >
      {copied ? <CheckIcon className="text-[var(--color-status-success)]" /> : <CopyIcon />}
    </Button>
  );
}

interface CodeRendererProps {
  code: string;
  language: string;
  showLineNumbers: boolean;
  scrollable: boolean;
  maxHeight: number;
  highlightLines?: number[];
  bodyClassName?: string;
}

function CodeRenderer({
  code,
  language,
  showLineNumbers,
  scrollable,
  maxHeight,
  highlightLines,
  bodyClassName
}: CodeRendererProps) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    injectCodeBlockStyles();
    renderCode(code, language, highlightLines).then(setHtml);
  }, [code, language, highlightLines]);

  return (
    <div
      className={cn("overflow-x-auto", scrollable && "overflow-y-auto", bodyClassName ?? "bg-background")}
      style={scrollable ? { maxHeight: `${maxHeight}px` } : undefined}
    >
      {html ? (
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          className={cn(
            "text-sm [&>pre]:p-4 [&_.line]:leading-[1.7]",
            showLineNumbers && "lm-code-block-line-numbers",
            highlightLines?.length && "lm-code-block-highlight-lines"
          )}
        />
      ) : (
        <div className="flex h-16 items-center justify-center">
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent"
          />
        </div>
      )}
    </div>
  );
}

export interface CodeBlockProps {
  /** The source code to display. */
  code: string;
  /** Shiki bundled-language identifier — e.g. "sql", "tsx", "json", "bash". Defaults to "sql" (this component's original Figma-evidenced example). */
  language?: BundledLanguage;
  /** Shown in the header in place of the language name. */
  filename?: string;
  /** Prefix each line with its line number. */
  showLineNumbers?: boolean;
  /** Constrain the code body to `maxHeight` and scroll vertically past it. */
  scrollable?: boolean;
  maxHeight?: number;
  /** 1-indexed line numbers to highlight. */
  highlightLines?: number[];
  /** Tailwind class(es) applied to the code body's background — defaults to the bridged `bg-background`. */
  bodyClassName?: string;
  className?: string;
}

export function CodeBlock({
  code,
  language = "sql",
  filename,
  showLineNumbers = false,
  scrollable = false,
  maxHeight = 400,
  highlightLines,
  bodyClassName,
  className
}: CodeBlockProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border", className)}>
      <div className="flex h-10 items-center justify-between gap-2 border-b bg-muted px-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileCodeIcon className="size-4 shrink-0" />
          <span className="truncate font-mono text-xs">{filename ?? language}</span>
        </div>
        <CopyButton code={code} />
      </div>
      <CodeRenderer
        code={code}
        language={language}
        showLineNumbers={showLineNumbers}
        scrollable={scrollable}
        maxHeight={maxHeight}
        highlightLines={highlightLines}
        bodyClassName={bodyClassName}
      />
    </div>
  );
}
