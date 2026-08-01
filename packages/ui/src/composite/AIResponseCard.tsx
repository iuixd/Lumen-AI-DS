import { useCallback, useRef, useState, type ReactNode } from "react";
import type { BundledLanguage } from "shiki";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/collapsible/Collapsible";
import { Skeleton } from "../components/skeleton/Skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/tooltip/Tooltip";
import { CodeBlock } from "../primitives/CodeBlock";
import {
  LmBotStaticIcon,
  CopyIcon,
  CheckFilledIcon,
  RefreshOutlinedIcon,
  KeyboardArrowRightOutlinedIcon
} from "../icons/generated";
import { cn } from "../lib/cn";

/**
 * AIResponseCard — a structured AI-generated response: title, summary
 * bullets, an optional data table, an optional code block, additional
 * collapsed sections, and follow-up actions.
 *
 * Sourced from Lumen-AI-Design-System node `1484:2905` ("AI Response
 * Components"), read via `get_design_context`/`get_variable_defs` on
 * 2026-07-29 — the first real Figma evidence for what
 * `docs/component-architecture.md` §8 and `docs/component-specifications.md`
 * §31 had described only aspirationally as "AIResponse"/"AI Response Panel".
 * Named `AIResponseCard` to match Figma's own literal label, by direct user
 * confirmation.
 *
 * The table is NOT built on the existing `DataTable` composite: `DataTable`
 * hardcodes `text-title-sm`/`text-muted` headers and `text-body-md` cells
 * with `border.default`/`background.subtle`/8px radius, none of which match
 * this frame's evidenced `title-sm`/`text.heading` headers, `body-sm` cells,
 * `border.input`/`background.app`, and 10px radius — and `DataTable` exposes
 * no styling override props. Rather than force a visually-inexact reuse or
 * widen `DataTable`'s API for a single new consumer, this renders its own
 * semantic `<table>` matching Figma exactly, the same "one-off treatment"
 * precedent already used for AIPanel's send button.
 *
 * The expand/collapse control for additional sections is built on the
 * existing `Collapsible` primitive (Radix), not a new bespoke toggle —
 * `Collapsible` is intentionally unopinionated about trigger content, which
 * is what this frame's custom chevron+label+dot+label trigger needs.
 *
 * The Copy and Regenerate footer actions are genuinely functional, at
 * direct user request ("make Copy and Refresh iconButtons interactive and
 * functional"), not bare buttons that do nothing without caller wiring:
 * Copy writes a plain-text rendering of every section (title, bullets,
 * table, code) to the clipboard via `navigator.clipboard.writeText` and
 * shows a brief "Copied" confirmation (icon swap + accessible-name change,
 * reverting after 2s) before also calling the optional `onCopy(text)` for
 * callers that want the same text (analytics, a toast, etc.). Regenerate
 * supports an async `onRegenerate`, showing a spinner and disabling itself
 * (`aria-busy`) for the duration, using the same CSS-spinner treatment
 * already established in `AIButton`/`SplitButton` — this still does not
 * call an AI model or manage generation state itself, per the component's
 * own documented scope; it only manages the *button's* pending state around
 * whatever async work the caller's `onRegenerate` does. While pending, the
 * section body is also replaced with `ResponseSkeleton` (built from the
 * existing `Skeleton` primitive, same composition pattern `ContentState`
 * already established) — not Figma-evidenced, a code-side decision per
 * direct user request ("refresh should show the demo skeleton loading...
 * for every refresh"). Both footer icon actions have `Tooltip`s (Radix,
 * via the existing `Tooltip` component), also direct user request — the
 * tooltip text tracks the button's current state ("Copied"/
 * "Regenerating…") rather than staying static.
 */
export interface AIResponseCardColumn {
  key: string;
  header: string;
}

export interface AIResponseCardSection {
  title: string;
  bullets?: string[];
  table?: {
    columns: AIResponseCardColumn[];
    rows: Record<string, ReactNode>[];
  };
  code?: {
    code: string;
    language?: BundledLanguage;
  };
}

export interface AIResponseCardProps {
  /** Card title. Defaults to Figma's own example, "AI Response Card". */
  title?: string;
  /** Model badge, e.g. "claude-fable-5". Omitted when not provided. */
  model?: string;
  /** The first section renders inline; any further sections render behind the expand control. */
  sections: AIResponseCardSection[];
  /** Label before the section count, e.g. "Multi-part response". */
  multiPartLabel?: string;
  /** Source count shown next to the suggested action, e.g. 2 -> "2 sources". Omitted when not provided. */
  sourcesCount?: number;
  /** The green suggested-action pill, e.g. { label: "Draft outreach emails for all three" }. */
  suggestedAction?: { label: string; onClick?: () => void };
  /** Called with the plain-text response after a successful clipboard copy. */
  onCopy?: (copiedText: string) => void;
  /** May return a Promise — the Regenerate button shows a spinner and disables itself until it resolves. */
  onRegenerate?: () => void | Promise<void>;
  className?: string;
}

/** Plain-text rendering of every section, used by the Copy action. Not exported — an internal implementation detail of the Copy behavior, not a public serialization API. */
function sectionsToPlainText(title: string, model: string | undefined, sections: AIResponseCardSection[]): string {
  const lines: string[] = [model ? `${title} (${model})` : title];
  for (const section of sections) {
    lines.push("", section.title);
    for (const bullet of section.bullets ?? []) lines.push(`- ${bullet}`);
    if (section.table) {
      lines.push(section.table.columns.map((col) => col.header).join("\t"));
      for (const row of section.table.rows) {
        lines.push(section.table.columns.map((col) => String(row[col.key] ?? "")).join("\t"));
      }
    }
    if (section.code) lines.push(section.code.code);
  }
  return lines.join("\n");
}

/**
 * Shown in place of the section body while `onRegenerate` is pending — not
 * Figma-evidenced (this frame has no loading state), a code-side decision
 * following the same `Skeleton`-composition pattern `ContentState` already
 * established, at direct user request ("refresh should show the demo
 * skeleton loading... for every refresh").
 */
function ResponseSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex w-full flex-col items-start gap-[var(--spacing-16)]"
    >
      <span className="sr-only">Regenerating response</span>
      <Skeleton className="h-[var(--spacing-20)] w-[var(--spacing-128)]" aria-hidden />
      <div className="flex w-full flex-col gap-[var(--spacing-8)]">
        <Skeleton className="h-[var(--spacing-16)] w-full" aria-hidden />
        <Skeleton className="h-[var(--spacing-16)] w-full" aria-hidden />
        <Skeleton className="h-[var(--spacing-16)] w-3/4" aria-hidden />
      </div>
      <Skeleton className="h-[var(--spacing-80)] w-full" aria-hidden />
    </div>
  );
}

function SectionBody({ section }: { section: AIResponseCardSection }) {
  return (
    <div className="flex w-full flex-col items-start gap-[var(--spacing-16)]">
      <p className="text-button-md text-[var(--color-text-heading)]">{section.title}</p>
      {section.bullets && section.bullets.length > 0 && (
        <ul className="list-disc pl-[var(--spacing-20)] text-body-sm text-[var(--color-text-body)]">
          {section.bullets.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
      )}
      {section.table && (
        <div className="w-full overflow-hidden rounded-[var(--radius-button)] border border-[var(--color-border-input)]">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--color-border-input)] bg-[var(--color-background-app)]">
                {section.table.columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-[var(--spacing-12)] py-[var(--spacing-6)] text-title-sm text-[var(--color-text-heading)]"
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex < section.table!.rows.length - 1 ? "border-b border-[var(--color-border-input)]" : undefined}
                >
                  {section.table!.columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-[var(--spacing-12)] py-[var(--spacing-6)] text-body-sm text-[var(--color-text-heading)]"
                    >
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {section.code && <CodeBlock code={section.code.code} language={section.code.language} />}
    </div>
  );
}

export function AIResponseCard({
  title = "AI Response Card",
  model,
  sections,
  multiPartLabel = "Multi-part response",
  sourcesCount,
  suggestedAction,
  onCopy,
  onRegenerate,
  className
}: AIResponseCardProps) {
  const [firstSection, ...restSections] = sections;
  const remainingCount = restSections.length;

  const [copied, setCopied] = useState(false);
  const copyResetRef = useRef<ReturnType<typeof setTimeout>>();
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleCopy = useCallback(async () => {
    const text = sectionsToPlainText(title, model, sections);
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Clipboard API can reject (denied permission, insecure context) —
        // the caller's onCopy still fires below so it can offer a fallback.
      }
    }
    setCopied(true);
    clearTimeout(copyResetRef.current);
    copyResetRef.current = setTimeout(() => setCopied(false), 2000);
    onCopy?.(text);
  }, [title, model, sections, onCopy]);

  const handleRegenerate = useCallback(async () => {
    if (isRegenerating) return;
    setIsRegenerating(true);
    try {
      await onRegenerate?.();
    } finally {
      setIsRegenerating(false);
    }
  }, [isRegenerating, onRegenerate]);

  return (
    <div
      className={cn(
        "flex w-full flex-col items-start gap-[var(--spacing-12)] rounded-[var(--radius-2xl)] border border-[var(--color-border-input)] bg-[var(--color-background-raised)] p-[var(--spacing-32)]",
        className
      )}
    >
      <div className="flex w-full items-center gap-[var(--spacing-8)]">
        <LmBotStaticIcon className="size-[var(--spacing-24)]" aria-hidden />
        <p className="text-input-lg text-[var(--color-text-primary)]">{title}</p>
        {model && (
          <span className="rounded-[var(--radius-sm)] bg-[var(--color-background-nav-active)] px-[var(--spacing-4)] font-mono text-code-sm text-[var(--color-text-primary)]">
            {model}
          </span>
        )}
      </div>

      {isRegenerating ? (
        <ResponseSkeleton />
      ) : (
        <>
          {firstSection && <SectionBody section={firstSection} />}

          {remainingCount > 0 && (
            <Collapsible className="w-full">
              <CollapsibleTrigger className="flex items-center gap-[var(--spacing-10)] rounded-[var(--radius-button)] px-[var(--spacing-16)] py-[var(--spacing-12)] text-body-sm text-[var(--color-text-primary)] [&[data-state=open]_svg]:rotate-90">
                <KeyboardArrowRightOutlinedIcon
                  className="size-[var(--spacing-16)] shrink-0 transition-transform"
                  aria-hidden
                />
                <span>{multiPartLabel}</span>
                <span aria-hidden className="size-[var(--spacing-4)] rounded-full bg-current" />
                <span>
                  {remainingCount} more section{remainingCount === 1 ? "" : "s"}
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex w-full flex-col gap-[var(--spacing-16)] pt-[var(--spacing-16)]">
                {restSections.map((section, index) => (
                  <SectionBody key={index} section={section} />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </>
      )}

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-[var(--spacing-8)]">
          {suggestedAction && (
            <button
              type="button"
              onClick={suggestedAction.onClick}
              className="inline-flex h-[var(--spacing-30)] items-center justify-center rounded-[var(--radius-full)] border border-[var(--color-green-100)] bg-[var(--color-status-success-subtle)] px-[var(--spacing-14)] py-[var(--spacing-7)] text-button-sm text-[var(--color-status-success)]"
            >
              {suggestedAction.label}
            </button>
          )}
          {typeof sourcesCount === "number" && (
            <span className="text-body-sm text-[var(--color-text-tertiary)]">
              {sourcesCount} source{sourcesCount === 1 ? "" : "s"}
            </span>
          )}
        </div>
        <TooltipProvider>
          <div className="flex items-center gap-[var(--spacing-16)]">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={copied ? "Copied" : "Copy response"}
                  onClick={handleCopy}
                  className="text-[var(--color-icon-default)]"
                >
                  {copied ? (
                    <CheckFilledIcon
                      className="size-[var(--spacing-16)] text-[var(--color-status-success)]"
                      aria-hidden
                    />
                  ) : (
                    <CopyIcon className="size-[var(--spacing-16)]" aria-hidden />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>{copied ? "Copied" : "Copy response"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="Regenerate response"
                  aria-busy={isRegenerating || undefined}
                  disabled={isRegenerating}
                  onClick={handleRegenerate}
                  className="text-[var(--color-icon-default)] disabled:opacity-50"
                >
                  {isRegenerating ? (
                    <span
                      className="size-[var(--spacing-16)] animate-spin rounded-full border-2 border-current border-t-transparent"
                      aria-hidden
                    />
                  ) : (
                    <RefreshOutlinedIcon className="size-[var(--spacing-16)]" aria-hidden />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>{isRegenerating ? "Regenerating…" : "Regenerate response"}</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
