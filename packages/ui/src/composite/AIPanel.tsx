import { useState, type FormEvent, type ReactNode } from "react";
import { cn } from "../lib/cn";
import {
  ArrowUpwardFilledIcon,
  CopyFilledIcon,
  LmAiOutlineIcon,
  LmBotStaticIcon,
  ThumbsDownFilledIcon,
  ThumbsUpFilledIcon
} from "../icons/generated";
import { Button } from "../components/button/Button";
import { Input } from "../components/input/Input";

/**
 * Structured feedback/utility row rendered directly beneath an assistant
 * bubble — thumbs up/down, copy, a branch/version label, and an "edited"
 * flag. Sourced from the "AI Conversation Components" Figma frame (node
 * 1412:3030, "Response Bubble Actions"). `branch` is display-only (e.g.
 * "2/2") — that frame shows no interactive prev/next affordance, so none is
 * invented here.
 */
export interface AIPanelResponseActions {
  onThumbsUp?: () => void;
  onThumbsDown?: () => void;
  onCopy?: () => void;
  branch?: string;
  edited?: boolean;
}

/**
 * A single suggested follow-up prompt, rendered as a full-width pill-shaped
 * Button inside the assistant bubble. `variant` matches the two treatments
 * evidenced on the canonical AIPanel component (node 1079:3141): `outline`
 * (a bordered pill, e.g. "Review draft") and `link` (no border/background,
 * e.g. "Show sources"). Defaults to `outline`.
 */
export interface AIPanelFollowUp {
  label: string;
  variant?: "outline" | "link";
  onSelect?: (label: string) => void;
}

export interface AIPanelMessage {
  role: "user" | "assistant";
  content: ReactNode;
  /** Renders a centered timestamp divider (e.g. "Today - 2:40 PM") above this message. */
  timestamp?: string;
  /** Thumbs up/down, copy, branch, and edited-flag row beneath an assistant message. */
  responseActions?: AIPanelResponseActions;
  /** Full-width follow-up prompt buttons rendered inside an assistant message's bubble, below its content. */
  followUps?: AIPanelFollowUp[];
  /**
   * A labeled "Suggested follow-ups" section rendered below `responseActions`,
   * outside the bubble — secondary-style pill buttons in a wrapped row.
   * Distinct from `followUps` (which renders inside the bubble with no
   * label): this is the separate anatomy evidenced on the "AI Conversation
   * Components" Figma frame (node 1412:3030) alongside `responseActions`,
   * not a variant of the in-bubble pattern.
   */
  suggestedFollowUps?: { label: string; onSelect?: (label: string) => void }[];
  /**
   * Free-form actions rendered below an assistant message. Use the standard
   * secondary Button. Prefer `responseActions`/`followUps` for the anatomy
   * modeled on Figma; this remains for content that doesn't fit either.
   */
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
 * Sourced from the canonical AIPanel component, Lumen-AI-Design-System node
 * `1079:3141` (re-verified 2026-07-26 via `get_design_context`/
 * `get_variable_defs` after the user updated it in Figma) — a 304px
 * right-side assistant chat panel: header (icon + "Assistant" title +
 * optional "+Thread", not part of this component's own anatomy), a
 * scrollable message list, and a text input + send button. The header uses
 * the exact `lm-ai-outline` asset from the approved composition.
 *
 * 2026-07-26 resync against this canonical node (superseding an earlier
 * pass against the separate "AI Conversation Components" documentation
 * frame, node 1412:3030, which turned out to model some anatomy — a
 * labeled "Suggested follow-ups" section, a response-actions feedback row —
 * differently than the real component, or not at all):
 * - both bubbles' rounded corners are the new `radius.chat-bubble` token
 *   (18px — no existing step matched) instead of Tailwind's stock `xl`
 *   (12px); the "sharp" corner (user: bottom-right, bot: top-left) is now
 *   fully square (0), not the previous `sm` (4px)
 * - the assistant bubble now renders a 24px `BotIcon` avatar to its left
 *   (missing entirely before)
 * - `followUps` no longer renders as a separate labeled section below the
 *   bubble — this component renders them full-width and stacked *inside*
 *   the bubble, with two distinct treatments (`outline`/`link`, see
 *   `AIPanelFollowUp`), matching what's actually authored
 * - the send button is not `Button`'s default (primary) variant — real
 *   evidence: solid black background, white icon, 34px (not 32px), and
 *   `radius.lg` (8px, not the default `rounded-md`/6px). No hover state is
 *   evidenced, so hover is pinned to the same black rather than inheriting
 *   `default`'s pink hover. The icon is the exact `ArrowUpwardFilledIcon`
 *   asset, not the previously-used `ArrowUpIcon`.
 * - `Button`'s shared `link` variant color was synced from this same node
 *   (the "Show sources" follow-up button) — see `internal/button.tsx`
 *
 * `responseActions` (thumbs up/down, copy, a display-only branch label, an
 * edited flag) isn't part of this canonical component's own anatomy, but
 * remains supported on `AIPanelMessage` as a documented, optional extra —
 * it's real Figma anatomy from node 1412:3030, just not used by this
 * particular instance. `timestamp` (a centered divider) is unchanged from
 * the previous sync; both frames agree on it. The pre-existing free-form
 * `actions` slot is unchanged.
 *
 * 2026-07-27 fixes, found by re-checking node 1412:3030 directly (the user
 * reported the icon, buttons, and section spacing didn't match):
 * - the assistant bubble's bot avatar now uses `LmBotStaticIcon` (confirmed
 *   byte-for-byte identical source geometry to this frame's own Bot Icon
 *   asset), not the generic pre-existing `BotIcon` used before
 * - `responseActions`' thumbs up/down/copy now use new dedicated
 *   `ThumbsUpFilledIcon`/`ThumbsDownFilledIcon`/`CopyFilledIcon` icons,
 *   downloaded and added to the icon set from this exact frame's assets —
 *   the previously-used generic `ThumbsUpIcon`/`ThumbsDownIcon`/`CopyIcon`
 *   are stroke-outline icons; Figma's are a visually distinct filled style
 * - added `suggestedFollowUps`, a genuinely separate anatomy this frame has
 *   that the earlier resync against node 1079:3141 had dropped entirely:
 *   a "Suggested follow-ups" labeled section (new `chat-label` typography
 *   tier, re-added after being briefly removed as apparently-unused) below
 *   `responseActions`, with uniform `secondary`-variant pill buttons in a
 *   wrapped row — distinct from the in-bubble `followUps`' per-button
 *   `outline`/`link` treatment
 * - the gap between `responseActions` and `suggestedFollowUps` totals 40px
 *   (the parent's uniform `gap-[--spacing-8]` plus the follow-ups section's
 *   own `pt-[--spacing-32]`), matching this frame's exact composition: those
 *   two pieces are top-level siblings with their own 32px gap there, plus
 *   the follow-ups section's own additional 8px top padding — rather than
 *   the tighter 8px used between the bubble row and `responseActions`,
 *   which are grouped inside one shared inner container in Figma
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
        {messages.map((message, i) => (
          <div key={i} className="flex flex-col gap-[var(--spacing-16)]">
            {message.timestamp && (
              <div className="flex items-center gap-[var(--spacing-12)]">
                <div className="h-px flex-1 bg-[var(--color-app-shell-border-default)]" />
                <p className="shrink-0 font-mono text-chat-caption text-[var(--color-app-shell-text-tertiary)]">
                  {message.timestamp}
                </p>
                <div className="h-px flex-1 bg-[var(--color-app-shell-border-default)]" />
              </div>
            )}
            {message.role === "user" ? (
              <div className="flex flex-col items-end">
                <div className="max-w-[var(--spacing-240)] rounded-[var(--radius-chat-bubble)] rounded-br-none bg-[var(--color-app-shell-prompt-bg)] p-[var(--spacing-16)] text-chat-message text-[var(--color-app-shell-text-on-brand)]">
                  {message.content}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-[var(--spacing-8)] items-start">
                <div className="flex w-full items-start gap-[var(--spacing-8)]">
                  <LmBotStaticIcon className="size-[var(--spacing-24)] shrink-0" aria-hidden />
                  <div className="flex max-w-[var(--spacing-240)] flex-1 flex-col gap-[var(--spacing-12)] rounded-[var(--radius-chat-bubble)] rounded-tl-none bg-[var(--color-app-shell-chat-response-bg)] p-[var(--spacing-16)]">
                    <p className="text-chat-message text-[var(--color-app-shell-text-primary)]">{message.content}</p>
                    {message.followUps && message.followUps.length > 0 && (
                      <div className="flex w-full flex-col gap-[var(--spacing-8)]">
                        {message.followUps.map((followUp, followUpIndex) => (
                          <Button
                            key={followUpIndex}
                            variant={followUp.variant === "link" ? "link" : "outline"}
                            className="h-[var(--spacing-30)] w-full rounded-full px-[var(--spacing-14)] py-[var(--spacing-7)] text-button-sm"
                            onClick={() => followUp.onSelect?.(followUp.label)}
                          >
                            {followUp.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {message.responseActions && (
                  <div className="flex items-center gap-[var(--spacing-16)] px-[var(--spacing-12)] text-[var(--color-app-shell-text-tertiary)]">
                    <button
                      type="button"
                      aria-label="Good response"
                      onClick={message.responseActions.onThumbsUp}
                      className="hover:text-[var(--color-app-shell-text-primary)]"
                    >
                      <ThumbsUpFilledIcon className="size-[var(--spacing-16)]" />
                    </button>
                    <button
                      type="button"
                      aria-label="Bad response"
                      onClick={message.responseActions.onThumbsDown}
                      className="hover:text-[var(--color-app-shell-text-primary)]"
                    >
                      <ThumbsDownFilledIcon className="size-[var(--spacing-16)]" />
                    </button>
                    <button
                      type="button"
                      aria-label="Copy response"
                      onClick={message.responseActions.onCopy}
                      className="hover:text-[var(--color-app-shell-text-primary)]"
                    >
                      <CopyFilledIcon className="size-[var(--spacing-16)]" />
                    </button>
                    {message.responseActions.branch && (
                      <span className="font-mono text-chat-caption">{message.responseActions.branch}</span>
                    )}
                    {message.responseActions.edited && (
                      <>
                        <span aria-hidden className="size-[var(--spacing-4)] rounded-full bg-current" />
                        <span className="font-mono text-chat-caption">edited</span>
                      </>
                    )}
                  </div>
                )}
                {message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
                  <div className="flex w-full flex-col gap-[var(--spacing-8)] px-[var(--spacing-12)] pt-[var(--spacing-32)]">
                    <p className="text-chat-label text-[var(--color-app-shell-text-tertiary)]">
                      Suggested follow-ups
                    </p>
                    <div className="flex flex-wrap items-start gap-[var(--spacing-8)]">
                      {message.suggestedFollowUps.map((followUp, followUpIndex) => (
                        <Button
                          key={followUpIndex}
                          variant="secondary"
                          className="h-[var(--spacing-30)] rounded-full px-[var(--spacing-14)] py-[var(--spacing-7)] text-button-sm"
                          onClick={() => followUp.onSelect?.(followUp.label)}
                        >
                          {followUp.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                {message.actions && (
                  <div className="flex items-center gap-[var(--spacing-8)]">{message.actions}</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-[var(--spacing-8)] p-[var(--spacing-12)]"
      >
        <label className="sr-only" htmlFor="ai-panel-input">
          Message
        </label>
        <Input
          id="ai-panel-input"
          type="text"
          className="min-w-0 flex-1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={inputPlaceholder}
        />
        <Button
          type="submit"
          aria-label="Send message"
          className="size-[var(--spacing-34)] shrink-0 rounded-lg bg-[var(--color-neutral-black)] px-0 py-0 text-[var(--color-neutral-white)] hover:bg-[var(--color-neutral-black)]"
        >
          <ArrowUpwardFilledIcon className="size-[var(--spacing-14)]" aria-hidden />
        </Button>
      </form>
    </div>
  );
}
