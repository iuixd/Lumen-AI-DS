import { useState, type FormEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { LmAisymbolIcon } from "../icons/generated";

export interface AIPanelMessage {
  role: "user" | "assistant";
  content: ReactNode;
  /** Secondary-button actions rendered below an assistant message (Figma's "Review draft"/"View accounts"). */
  actions?: ReactNode;
}

export interface AIPanelProps {
  title?: string;
  messages: AIPanelMessage[];
  inputPlaceholder?: string;
  /** Called with the input's trimmed value on submit (Enter or the send button); the panel clears its own input afterward. */
  onSend?: (value: string) => void;
  /** Shows the "+Thread" control in the header when provided. */
  onNewThread?: () => void;
  className?: string;
}

/**
 * AIPanel
 * Sourced from the canonical Figma "AppShell" page (Lumen-AI-Design-System,
 * node 1007:3700, `AIPanel` component `1079:3141`, re-verified against the
 * Breakpoint=Desktop/Theme=Light composition `1127:4196`, instance
 * `1119:3351`) — a 304px right-side assistant chat panel: header
 * (icon + "Assistant" title + optional "+Thread"), a scrollable message
 * list (right-aligned dark user-prompt bubbles, left-aligned bordered
 * assistant-response bubbles with optional secondary-button actions
 * beneath), and a text input + send button. Not previously implemented in
 * any framework package — entirely new to the system, not a variant of an
 * existing component. The header icon uses the existing `LmAisymbolIcon`
 * (already this repo's default AI glyph, e.g. `AIButton`'s icon) rather
 * than Figma's `lm-ai-outline`, which has no corresponding entry in this
 * repo's icon set.
 */
export function AIPanel({ title = "Assistant", messages, inputPlaceholder, onSend, onNewThread, className }: AIPanelProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setValue("");
  };

  return (
    <div
      className={cn(
        "flex h-full w-[304px] shrink-0 flex-col border-l border-r border-[var(--color-border-default)] bg-[var(--color-background-default)]",
        className
      )}
    >
      <div className="flex items-center gap-[var(--spacing-8)] px-[var(--spacing-16)] py-[var(--spacing-14)]">
        <LmAisymbolIcon className="size-5 shrink-0 text-[var(--color-text-title)]" aria-hidden />
        <p className="text-title-sm text-[var(--color-text-title)]">{title}</p>
        <div className="min-w-px flex-1" />
        {onNewThread && (
          <button
            type="button"
            onClick={onNewThread}
            className="rounded-md bg-[var(--color-background-badge)] px-[var(--spacing-8)] py-[var(--spacing-4)] text-label-md text-[var(--color-text-link-subtle)]"
          >
            + Thread
          </button>
        )}
      </div>
      <div className="h-px w-full bg-[var(--color-border-default)]" />
      <div
        role="log"
        aria-label="Conversation"
        aria-live="polite"
        className="flex flex-1 flex-col gap-[var(--spacing-16)] overflow-y-auto p-[var(--spacing-16)]"
      >
        {messages.map((message, i) =>
          message.role === "user" ? (
            <div key={i} className="flex flex-col items-end">
              <div className="rounded-bl-xl rounded-br-xl rounded-tl-xl rounded-tr-sm bg-[var(--color-background-prompt)] px-[var(--spacing-12)] py-[var(--spacing-8)] text-body-sm text-neutral-white">
                {message.content}
              </div>
            </div>
          ) : (
            <div key={i} className="flex flex-col gap-[var(--spacing-8)] items-start">
              <div className="rounded-bl-xl rounded-br-xl rounded-tl-sm rounded-tr-xl border border-[var(--color-border-table)] bg-[var(--color-background-subtle)] px-[var(--spacing-12)] py-[var(--spacing-8)] text-body-sm text-[var(--color-text-title)]">
                {message.content}
              </div>
              {message.actions && <div className="flex items-center gap-[var(--spacing-8)]">{message.actions}</div>}
            </div>
          )
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-[var(--spacing-8)] p-[var(--spacing-12)]">
        <label className="sr-only" htmlFor="ai-panel-input">
          Message
        </label>
        <input
          id="ai-panel-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={inputPlaceholder}
          className="flex-1 rounded-lg border border-[var(--color-border-input)] bg-[var(--color-background-subtle)] px-[var(--spacing-12)] py-[var(--spacing-8)] text-body-sm text-[var(--color-text-secondary)] placeholder:text-[var(--color-text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="flex size-[var(--spacing-32)] shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-neutral-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-border-focus)]"
        >
          <span aria-hidden>↑</span>
        </button>
      </form>
    </div>
  );
}
