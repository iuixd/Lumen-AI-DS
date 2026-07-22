import { useState, type FormEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { ArrowUpIcon, LmAiOutlineIcon } from "../icons/generated";
import { Button } from "../primitives/Button";
import { Input } from "../primitives/Input";

export interface AIPanelMessage {
  role: "user" | "assistant";
  content: ReactNode;
  /** Actions rendered below an assistant message. Use the standard secondary Button. */
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
 * existing component. The header uses the exact `lm-ai-outline` asset from
 * the approved composition.
 */
export function AIPanel({
  title = "Assistant",
  messages,
  inputPlaceholder,
  onSend,
  onNewThread,
  className
}: AIPanelProps) {
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
        "flex h-full w-[var(--spacing-304)] shrink-0 flex-col border-l border-r border-[var(--color-app-shell-border-default)] bg-[var(--color-app-shell-surface)] font-interface",
        className
      )}
    >
      <div className="flex items-center gap-[var(--spacing-8)] px-[var(--spacing-16)] py-[var(--spacing-8)]">
        <span className="flex size-[var(--spacing-32)] shrink-0 items-center justify-center rounded-full bg-[var(--color-app-shell-assistant-icon-bg)] text-[var(--color-app-shell-assistant-icon)]">
          <LmAiOutlineIcon className="size-[var(--spacing-20)]" aria-hidden />
        </span>
        <p className="text-app-table-heading text-[var(--color-app-shell-text-primary)]">{title}</p>
        <div className="min-w-px flex-1" />
        {onNewThread && (
          <button
            type="button"
            onClick={onNewThread}
            className="rounded-md bg-[var(--color-badge-default-bg)] px-[var(--spacing-8)] py-[var(--spacing-4)] text-app-label text-[var(--color-badge-default-text)]"
          >
            + Thread
          </button>
        )}
      </div>
      <div className="h-px w-full bg-[var(--color-app-shell-border-default)]" />
      <div
        role="log"
        aria-label="Conversation"
        aria-live="polite"
        className="flex flex-1 flex-col gap-[var(--spacing-16)] overflow-y-auto p-[var(--spacing-16)]"
      >
        {messages.map((message, i) =>
          message.role === "user" ? (
            <div key={i} className="flex flex-col items-end">
              <div className="max-w-[var(--spacing-240)] rounded-bl-xl rounded-br-xl rounded-tl-xl rounded-tr-sm bg-[var(--color-app-shell-prompt-bg)] px-[var(--spacing-12)] py-[var(--spacing-8)] text-app-body text-[var(--color-app-shell-text-on-brand)]">
                {message.content}
              </div>
            </div>
          ) : (
            <div key={i} className="flex flex-col gap-[var(--spacing-8)] items-start">
              <div className="max-w-[var(--spacing-240)] rounded-bl-xl rounded-br-xl rounded-tl-sm rounded-tr-xl border border-[var(--color-app-shell-border-table)] bg-[var(--color-app-shell-surface)] px-[var(--spacing-12)] py-[var(--spacing-8)] text-app-body text-[var(--color-app-shell-text-heading)]">
                {message.content}
              </div>
              {message.actions && (
                <div className="flex items-center gap-[var(--spacing-8)]">{message.actions}</div>
              )}
            </div>
          )
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-[var(--spacing-8)] p-[var(--spacing-12)] [&>span]:min-w-0 [&>span]:flex-1"
      >
        <label className="sr-only" htmlFor="ai-panel-input">
          Message
        </label>
        <Input
          id="ai-panel-input"
          type="text"
          size="sm"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={inputPlaceholder}
        />
        <Button
          type="submit"
          variant="accent"
          aria-label="Send message"
          className="size-[var(--spacing-32)] shrink-0 px-0 py-0"
        >
          <ArrowUpIcon className="size-[var(--spacing-14)]" aria-hidden />
        </Button>
      </form>
    </div>
  );
}
