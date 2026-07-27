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
  /**
   * Overrides the default bot avatar (`LmBotStaticIcon`) for this assistant
   * message only — e.g. a temporary "thinking" placeholder using an animated
   * icon. Rendered in the exact same position/size slot as the default icon;
   * the caller supplies its own sizing/color classes (matching the default's
   * `size-[--spacing-24] text-[--color-app-shell-bot-icon]` is recommended
   * for visual consistency with real messages).
   */
  avatarIcon?: ReactNode;
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
 *
 * 2026-07-26 fixes, from a direct re-check of node 1412:3030 via
 * `get_design_context`/`get_variable_defs` after the user reported the icon,
 * buttons, and spacing still didn't match following the pass above:
 * - `responseActions`' `ThumbsUpFilledIcon`/`ThumbsDownFilledIcon`/
 *   `CopyFilledIcon` had correct geometry and color already, but rendered at
 *   roughly 60% of Figma's visual size: their source SVGs centered the
 *   ~14.6px glyph at native size inside the icon pipeline's fixed 24×24
 *   viewBox, instead of scaling it up to fill the box the way Figma's own
 *   16px icon instances do (each glyph fills ~91% of its container there,
 *   confirmed from the frame's own inset percentages). Rescaled each source
 *   SVG's transform (`scale(1.5)` plus a recomputed centering translate) so
 *   the compiled icon matches Figma's fill ratio; this repo's other filled/
 *   stroke icons already follow this full-bleed convention, so these three
 *   were the outliers, not the rule
 * - the bot avatar had no explicit text color (silently inheriting the
 *   ambient/default color) instead of this frame's exact `#424849` fill,
 *   which is the existing `--color-app-shell-text-body` token
 *   (`lumen-gray.800`) — added explicitly rather than left to inherit
 * - the response-actions row's horizontal padding was `spacing-12`; Figma's
 *   own `ResponseBubbleActions` node uses `px-[40px]` exactly — corrected to
 *   `spacing-40` (no new token needed, already existed)
 * - the `suggestedFollowUps` section's padding was `px-[--spacing-12]
 *   pt-[--spacing-32]`, an incorrect earlier estimate; Figma's actual
 *   wrapping `prompt-actions` node uses `pl-[32px] pt-[16px]` only (no
 *   right/bottom padding) — the parent's own `gap-[--spacing-8]` supplies
 *   the rest, for a real total top gap of 24px, not the 40px claimed above.
 *   Corrected to `pl-[--spacing-32] pt-[--spacing-16]`
 * - the three response-action icon buttons (`<button>`) had no layout class
 *   of their own, so each icon sat at its default inline vertical position
 *   inside its button's box rather than centered — added
 *   `flex items-center justify-center` to each so the icon centers exactly,
 *   matching Figma's icon-in-a-block-container treatment (`overflow-clip
 *   relative size-[16px]`, not an inline element)
 * - `Button`'s shared `secondary` variant's text color
 *   (`--color-button-secondary-on-action`) was `primary.600`; re-querying
 *   this frame's own Suggested-follow-ups buttons directly returned
 *   `btn/secondary/on-action` = `#BE003C` (`primary.500`) exactly — the same
 *   value already found and used for `button.link-on-action` (see
 *   `internal/button.tsx`). This is the third independent Figma confirmation
 *   of the same drift (previously flagged twice and deliberately left
 *   standing pending a decision, given its system-wide blast radius as a
 *   shared token) — user-approved 2026-07-26 to correct the shared token
 *   rather than defer again or override it locally; see
 *   `packages/tokens/src/semantic/color.json`'s `_aiConversationComment`
 *
 * 2026-07-26 follow-up: the user separately reported the AIPanel embedded
 * live in AppShell (node 1174:1357) didn't match either. Metadata on that
 * frame's `Breakpoint=Desktop, Theme=Light` symbol (1127:4196) resolves to
 * an actual `AIPanel` component instance (1119:3351) — the real, canonical,
 * in-context source, distinct from both frames cited above. Diffing it
 * against the current implementation found:
 * - both bubbles used a flat `max-w-[--spacing-240]`, an estimate from the
 *   much wider "AI Conversation Components" documentation canvas (1412:3030,
 *   374px wide). This canonical instance's actual technique, at the real
 *   304px panel width: the assistant bubble has no width cap at all (plain
 *   `flex-1`, filling all space next to the 24px avatar+gap) and only the
 *   user bubble reserves a gutter — via a fixed 24px leading spacer in its
 *   row, not a flat token. Replaced the assistant bubble's cap with nothing
 *   and the user bubble's with `max-w-[calc(100%-var(--spacing-24))]`,
 *   which reproduces that reserved-gutter technique without an extra spacer
 *   element and generalizes correctly if the panel's width ever changes
 * - in-bubble `followUps`' `outline` treatment ("Review draft") used the
 *   same `text-button-sm` (12/20) as the `link` treatment ("Show sources");
 *   this instance shows outline pills in `button-md` (14/22, "Body/Small
 *   Medium") and link pills in `button-sm` (12/20, "Body/XSmall Medium") —
 *   two genuinely different sizes, not one shared size. Also gave `outline`
 *   pills here their own `border-[1.5px]` (this instance's evidenced width),
 *   distinct from the shared `Button` outline variant's default 1px border
 *
 * 2026-07-26 correction (user report: "icon-only button should be a secondary
 * button, not black"), from a fresh re-fetch of node `1119:3351` — Figma had
 * changed since the read above: the send button is no longer a solid-black
 * custom treatment; it's now named "Icon Only - light" and matches `Button`'s
 * own `secondary` variant exactly (`btn/secondary/bg`/`border`/`on-action`,
 * confirmed via the arrow icon's own downloaded asset: `fill="#BE003C"` =
 * `primary.500`, this component's `secondary-on-action` value). Switched from
 * a hardcoded black/white treatment to `variant="secondary"` with local
 * `size-34`/`rounded-lg`/`border-[1.5px]` overrides (1.5px matching this same
 * node's other pill buttons). The same re-fetch also found the in-bubble
 * `outline` follow-up pill's height changed from 30px to 34px (the `link`
 * pill stays 30px) — updated to a per-variant height rather than the shared
 * height both previously used. `AppShell.stories.tsx` needed no separate fix
 * — it renders this same `AIPanel` component, so both corrections apply there
 * automatically.
 *
 * 2026-07-27 correction (user report: prompt input color styles didn't
 * match): the message input had no color/border/radius overrides at all, so
 * it rendered with the shared `Input` component's generic defaults
 * (`bg-transparent`, a generic `border-input` bridge color, `rounded-md`/6px)
 * instead of this node's actual `input/primary/bg` (white), `input/primary/
 * border` (`--color-input-primary-border`), and 8px radius — all three
 * already-correct existing tokens, just never applied here. Also see the
 * dark-theme token corrections in `packages/tokens/src/semantic/color.json`
 * (`_appShellComment`/`_inputComment`) from this same user report — this
 * input's dark-mode border color was one of them.
 *
 * 2026-07-27 follow-up (same day, user report: "Robo icon color in dark mode
 * is incorrect" / "check all font size"): the bot avatar's color binding
 * (`--color-app-shell-text-body`) only coincidentally matched light mode's
 * asset color; downloading the dark Bot Icon asset directly confirmed its
 * real fill is `#A8939F`, not `text-body`'s dark value (`#F9F3F7`, near-
 * white). Switched to the new, correctly-scoped `--color-app-shell-bot-icon`
 * token (see `packages/tokens/src/semantic/color.json`). Separately, message-
 * bubble text (`chat-message`) is now the first theme-varying typography
 * token in this system — the dark AIPanel instance renders it at 14/16
 * ("Body/Small") vs. light's 16/18 ("Body/Medium"); user-directed to treat
 * this as a real per-theme difference rather than stale Figma drift between
 * two instances, so `typography.json`'s `chat-message` entry now carries a
 * `dark` override and `--text-chat-message-size/-line-height` swap by
 * `[data-theme]` like every color token already does (see `build.mjs`).
 *
 * 2026-07-27 addition (user-supplied animated bot SVG, for the AppShell demo's
 * "thinking" state): added `AIPanelMessage.avatarIcon` so a consumer can swap
 * the bot avatar for one specific message (e.g. a temporary placeholder)
 * without affecting any other message or requiring a new prop on `AIPanel`
 * itself. Backward compatible — omitting it renders the existing default
 * `LmBotStaticIcon` exactly as before. See `LmBotAnimatedIcon` (new,
 * generated from `icons/svg/lm-bot-animated.svg`) and `AppShell.stories.tsx`'s
 * `AssistantDemo` for the actual usage this was added for.
 *
 * 2026-07-27 addition (making the AppShell demo's assistant panel
 * drag-resizable): the root's width changed from a hardcoded
 * `w-[var(--spacing-304)]` to `w-full` — `AIPanel` now tracks whatever width
 * its parent container gives it instead of forcing its own, so it can shrink/
 * grow inside a `ResizablePanel`. `AIPanel`'s own Storybook stories, which
 * previously got their 304px appearance for free from this hardcoded width,
 * now supply it explicitly via a wrapping `w-[var(--spacing-304)]` div (see
 * `AIPanel.stories.tsx`).
 *
 * 2026-07-27 correction (user report: "Chat bubble text font size is bigger
 * in light mode, not aligned with the actual design"): the "first
 * theme-varying typography token" claim two entries above was wrong. Its
 * light value (16/18) was never actually read from the canonical AIPanel
 * instance — it came from a separate documentation frame. Re-checked the
 * real canonical instance (node 1079:3141) directly: both themes render
 * bubble text at 14/16 ("Body/Small"). `chat-message` is back to a single
 * fixed value; see `typography.json`'s own comment for the full correction.
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
        "flex h-full w-full flex-col border-l border-r border-[var(--color-app-shell-border-default)] bg-[var(--color-app-shell-surface)] font-interface",
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
                <div className="max-w-[calc(100%-var(--spacing-24))] rounded-[var(--radius-chat-bubble)] rounded-br-none bg-[var(--color-app-shell-prompt-bg)] p-[var(--spacing-16)] text-chat-message text-[var(--color-app-shell-text-on-brand)]">
                  {message.content}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-[var(--spacing-8)] items-start">
                <div className="flex w-full items-start gap-[var(--spacing-8)]">
                  {message.avatarIcon ?? (
                    <LmBotStaticIcon
                      className="size-[var(--spacing-24)] shrink-0 text-[var(--color-app-shell-bot-icon)]"
                      aria-hidden
                    />
                  )}
                  <div className="flex flex-1 flex-col gap-[var(--spacing-12)] rounded-[var(--radius-chat-bubble)] rounded-tl-none bg-[var(--color-app-shell-chat-response-bg)] p-[var(--spacing-16)]">
                    <p className="text-chat-message text-[var(--color-app-shell-text-primary)]">{message.content}</p>
                    {message.followUps && message.followUps.length > 0 && (
                      <div className="flex w-full flex-col gap-[var(--spacing-8)]">
                        {message.followUps.map((followUp, followUpIndex) => (
                          <Button
                            key={followUpIndex}
                            variant={followUp.variant === "link" ? "link" : "outline"}
                            className={cn(
                              "w-full rounded-full px-[var(--spacing-14)] py-[var(--spacing-7)]",
                              followUp.variant === "link"
                                ? "h-[var(--spacing-30)] text-button-sm"
                                : "h-[var(--spacing-34)] border-[1.5px] text-button-md"
                            )}
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
                  <div className="flex items-center gap-[var(--spacing-16)] px-[var(--spacing-40)] text-[var(--color-app-shell-text-tertiary)]">
                    <button
                      type="button"
                      aria-label="Good response"
                      onClick={message.responseActions.onThumbsUp}
                      className="flex items-center justify-center hover:text-[var(--color-app-shell-text-primary)]"
                    >
                      <ThumbsUpFilledIcon className="size-[var(--spacing-16)]" />
                    </button>
                    <button
                      type="button"
                      aria-label="Bad response"
                      onClick={message.responseActions.onThumbsDown}
                      className="flex items-center justify-center hover:text-[var(--color-app-shell-text-primary)]"
                    >
                      <ThumbsDownFilledIcon className="size-[var(--spacing-16)]" />
                    </button>
                    <button
                      type="button"
                      aria-label="Copy response"
                      onClick={message.responseActions.onCopy}
                      className="flex items-center justify-center hover:text-[var(--color-app-shell-text-primary)]"
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
                  <div className="flex w-full flex-col gap-[var(--spacing-8)] pl-[var(--spacing-32)] pt-[var(--spacing-16)]">
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
          className="min-w-0 flex-1 rounded-[var(--radius-lg)] border-[var(--color-input-primary-border)] bg-[var(--color-input-primary-bg)] px-[var(--spacing-10)] py-[var(--spacing-7)]"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={inputPlaceholder}
        />
        <Button
          type="submit"
          variant="secondary"
          aria-label="Send message"
          className="size-[var(--spacing-34)] shrink-0 rounded-lg border-[1.5px] px-0 py-0"
        >
          <ArrowUpwardFilledIcon className="size-[var(--spacing-14)]" aria-hidden />
        </Button>
      </form>
    </div>
  );
}
