import { useEffect, useRef, useState } from "react";
import { Button } from "../components/button/Button";
import { UploadIcon } from "../icons/generated/UploadIcon";
import { CloseFilledIcon } from "../icons/generated/CloseFilledIcon";
import { CircleCheckIcon } from "../icons/generated/CircleCheckIcon";
import { WarningAmberOutlinedIcon } from "../icons/generated/WarningAmberOutlinedIcon";
import { PlusIcon } from "../icons/generated/PlusIcon";
import { cn } from "../lib/cn";

export type FileUploadErrorType =
  | "unsupported-type"
  | "size-limit"
  | "duplicate"
  | "corrupted"
  | "password-protected"
  | "network"
  | "cancelled"
  | "validation";

const errorMessageByType: Record<FileUploadErrorType, string> = {
  "unsupported-type": "Unsupported file type",
  "size-limit": "File exceeds 3MB limit",
  duplicate: "Already added",
  corrupted: "File appears to be corrupted",
  "password-protected": "Password-protected PDFs aren't supported",
  network: "Upload interrupted — check your connection",
  cancelled: "Upload cancelled",
  validation: "Couldn't validate this file"
};

export interface FileUploadFile {
  id: string;
  name: string;
  /** Preformatted, e.g. `"100kb"`. */
  sizeLabel: string;
  status: "uploading" | "uploaded" | "error";
  /** 0-100. Only rendered while `status === "uploading"`. */
  progress?: number;
  /** Only meaningful when `status === "error"`. Selects the default message in `errorMessageByType`. */
  errorType?: FileUploadErrorType;
  /** Overrides the default message for `errorType`. */
  errorMessage?: string;
  /** Presence alone renders a "Retry" affordance next to the remove control. */
  onRetry?: () => void;
}

export interface FileUploadProgressListProps {
  /** Overrides the computed per-state heading (see the component docblock). */
  heading?: string;
  /** Overrides the computed per-state subheading. */
  subheading?: string;
  files: FileUploadFile[];
  onRemoveFile?: (fileId: string) => void;
  cancelLabel?: string;
  onCancel?: () => void;
  primaryActionLabel?: string;
  primaryActionLoading?: boolean;
  primaryActionDisabled?: boolean;
  onPrimaryAction?: () => void;
  /** Shown as an inline `role="alert"` banner above the action row — e.g. project-creation failure. Presence alone (regardless of `primaryActionLabel`) renders the banner. */
  primaryActionErrorMessage?: string;
  className?: string;
}

/**
 * A single file row. Handles three pieces of Phase-B motion locally:
 * 1. Stagger-in on mount (`staggerIndex` sets a per-row `transitionDelay`,
 *    40-60ms band per the spec — no existing one-shot list-stagger
 *    primitive in this repo to reuse, the only stagger token
 *    (`--duration-stagger-skeleton-*`) is loop-coupled to the skeleton
 *    pulse, a different shape).
 * 2. A brief highlight + icon pop-in when `status` flips
 *    `"uploading"` → `"uploaded"` (tracked via a ref comparing the
 *    previous render's status, not a prop — this repo has no
 *    stroke-dashoffset checkmark-draw mechanism anywhere, so the "draw"
 *    the spec asks for is a scale/opacity pop-in on `CircleCheckIcon`
 *    instead, a deliberate technique substitution).
 * 3. The status text ("Loading"→"Uploaded") fades via the same
 *    highlight window rather than a separate crossfade mechanism.
 */
function FileRow({
  file,
  disabled,
  staggerIndex,
  onRemove
}: {
  file: FileUploadFile;
  disabled?: boolean;
  staggerIndex: number;
  onRemove?: () => void;
}) {
  const isError = file.status === "error";
  const statusText = isError
    ? (file.errorMessage ?? (file.errorType ? errorMessageByType[file.errorType] : "Upload failed"))
    : file.status === "uploaded"
      ? "Uploaded"
      : "Loading";

  const [entered, setEntered] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [iconEntered, setIconEntered] = useState(true);
  const prevStatusRef = useRef(file.status);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
    // Mount-only: this row's own stagger-in, not re-run on status changes.
  }, []);

  useEffect(() => {
    if (prevStatusRef.current === "uploading" && file.status === "uploaded") {
      setJustCompleted(true);
      setIconEntered(false);
      const popRaf = requestAnimationFrame(() => setIconEntered(true));
      const timer = setTimeout(() => setJustCompleted(false), 300);
      prevStatusRef.current = file.status;
      return () => {
        cancelAnimationFrame(popRaf);
        clearTimeout(timer);
      };
    }
    prevStatusRef.current = file.status;
  }, [file.status]);

  const showCheckIcon = file.status === "uploaded";

  return (
    <div
      style={{ transitionDelay: entered ? "0ms" : `${staggerIndex * 50}ms` }}
      className={cn(
        "flex items-center gap-[var(--spacing-8)] rounded-[var(--radius-sm)] py-[var(--spacing-4)] pl-[var(--spacing-40)] pr-[var(--spacing-16)]",
        "transition-[opacity,transform,background-color] duration-[var(--duration-moderate)] ease-[var(--easing-enter)] motion-reduce:transition-none motion-reduce:delay-0",
        entered ? "translate-y-0 opacity-100" : "translate-y-[var(--spacing-8)] opacity-0",
        justCompleted && "bg-[var(--color-status-success-subtle)]"
      )}
    >
      {isError ? (
        <WarningAmberOutlinedIcon
          className="size-4 shrink-0 text-[var(--color-status-error)]"
          aria-hidden="true"
        />
      ) : showCheckIcon ? (
        <CircleCheckIcon
          className={cn(
            "size-4 shrink-0 text-[var(--color-icon-success-icon)] transition-transform duration-[var(--duration-moderate)] ease-[var(--easing-enter)] motion-reduce:transition-none motion-reduce:scale-100",
            iconEntered ? "scale-100" : "scale-[0.85]"
          )}
          aria-hidden="true"
        />
      ) : (
        <UploadIcon
          className={cn(
            "size-4 shrink-0",
            disabled ? "text-[#bfbfbf]" : "text-[var(--color-text-secondary)]"
          )}
          aria-hidden="true"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-4)]">
        <p
          className={cn(
            // Corrected 2026-08-03 against a direct get_variable_defs pull
            // (Figma nodes 1565:3298/1565:3337): the active-row filename is
            // "Body/Small Medium" (14/22/500) and the disabled-row filename
            // is one step smaller, "Body/XSmall Medium" (12/20/500) —
            // confirmed identically across every row in both states, not a
            // one-off. Supersedes an earlier flat "+2px" (13px) guess made
            // before this pull existed.
            "m-0 truncate",
            disabled ? "text-body-xs-medium" : "text-body-sm-w500",
            disabled ? "text-[#bfbfbf]" : "text-[var(--color-text-title)]"
          )}
        >
          {file.name}
        </p>
        <div
          className={cn(
            // Corrected 2026-08-03: was `text-app-caption` (11/16/400), an
            // unrelated tier — the real bound style, unchanged between
            // active and disabled rows, is "Body/XSmall Regular" (12/20/400
            // = the existing `body-xs` tier).
            "flex items-center gap-[var(--spacing-8)] text-body-xs transition-opacity duration-[var(--duration-fast)] motion-reduce:transition-none",
            isError
              ? "text-[var(--color-status-error)]"
              : disabled
                ? "text-[#bfbfbf]"
                : "text-[var(--color-text-secondary)]"
          )}
        >
          <span>{file.sizeLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{statusText}</span>
        </div>
        {file.status === "uploading" && (
          <span className="h-[2px] w-[200px] max-w-full overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-deep-purple-200)] bg-opacity-60">
            <span
              className="block h-full rounded-[var(--radius-sm)] bg-[var(--color-deep-purple-600)] transition-[width] duration-[var(--duration-moderate)] ease-[var(--easing-standard)]"
              style={{ width: `${file.progress ?? 0}%` }}
            />
          </span>
        )}
      </div>
      {isError && file.onRetry && (
        <button
          type="button"
          onClick={file.onRetry}
          aria-label={`Retry ${file.name}`}
          className="shrink-0 text-app-caption font-medium text-[var(--color-status-error)] hover:underline"
        >
          Retry
        </button>
      )}
      <button
        type="button"
        aria-label={`Remove ${file.name}`}
        onClick={onRemove}
        disabled={disabled}
        aria-disabled={disabled}
        className={cn(
          "flex size-4 shrink-0 items-center justify-center",
          disabled
            ? "cursor-not-allowed text-[#bfbfbf]"
            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-title)]"
        )}
      >
        <CloseFilledIcon className="size-full" />
      </button>
    </div>
  );
}

/**
 * FileUploadProgressList — the flat, per-file upload progress view that
 * follows `FileUploadDropzone` once files are selected.
 *
 * Redesigned 2026-08-03 against a reorganized Figma section (Lumen-AI-
 * Design-System, fileKey `GJBYRm6ySR7XIECFcHMgy2`, nodes `1565:3140`/
 * `1565:3298`/`1565:3337` — "Uploading files"/"Files uploaded successfully"/
 * "Creating your project"), read via `get_design_context`, at direct user
 * request to redesign this pattern's interaction design while matching
 * Figma's visual design exactly. Two real structural changes from the
 * previous version:
 *
 * 1. **Flat list, not grouped.** The previous version grouped files into
 *    collapsible `Accordion` sections by category (Documents/Images/Other),
 *    each with its own folder icon, file count, and aggregate progress bar.
 *    All three Figma states show a single flat list with none of that —
 *    confirmed directly, not assumed. `FileUploadGroupData` and the
 *    grouped `onRemoveFile(groupId, fileId)` signature are gone; this is a
 *    breaking `@lumen/ui` API change, approved by the user alongside this
 *    redesign.
 * 2. **Heading/subheading are computed per state, not a static default.**
 *    Figma defines three distinct pairs — "Uploading files"/"Track each
 *    file as the upload moves forward.", "Files uploaded successfully"/a
 *    *dynamic* `` `Review uploaded ${n} files before creating project.` ``
 *    (Figma's own "20" is a placeholder instance value, not a literal
 *    string), and "Creating your project"/"Please wait while your project
 *    is being created." The previous version never varied this at all
 *    (always the Figma-unrelated "Group files by document type"). `heading`/
 *    `subheading` remain optional override props for callers who need
 *    custom copy; the computed default only applies when they're omitted.
 *
 * Row status text is exact Figma copy: "Loading" (not a percentage) and
 * "Uploaded" — do not "improve" this to a percentage label without new
 * Figma evidence, since a live percentage label was explicitly considered
 * and rejected in favor of Figma's literal copy during this redesign.
 *
 * The 32px success checkmark (state "uploaded") uses
 * `--color-icon-success-icon` (green.500) — this repo's existing
 * icon-role-success token — since Figma's own asset pull for this glyph
 * didn't resolve a bound color variable; flagged as a reasonable default,
 * not a literal Figma-confirmed value.
 *
 * **Disabled-row dimming during "Creating your project"** (state 5): Figma
 * confirms every row dims to `#bfbfbf` — this is `neutral.200`, distinct
 * from this repo's existing shared `text.disabled` token (`neutral.300`,
 * `#9F9F9F`), which has unrelated consumers elsewhere never independently
 * re-verified against this exact Figma value. Deliberately NOT repointing
 * the shared token — using a locally-scoped `#bfbfbf` literal instead,
 * flagged here rather than silently touching a wider-blast-radius token.
 * This state also introduces a genuinely new pattern for this codebase:
 * the remove control on every row becomes a real, not just cosmetic,
 * `disabled` button while `primaryActionLoading` is true (no existing
 * "disable siblings while a primary action is in flight" precedent exists
 * anywhere else in this repo — if a second consumer needs the same
 * pattern, consider extracting it then, not preemptively now).
 *
 * Error rows (`status: "error"`) are new: `errorType`/`errorMessage`/
 * `onRetry` on `FileUploadFile` back a Retry affordance next to the
 * existing remove control, using this repo's existing `status.error`
 * token and `WarningAmberOutlinedIcon` (already used by `Toast.tsx`) —
 * entirely code-side, zero Figma source for any error state, explicitly
 * flagged per the same "document code-side content" convention already
 * used elsewhere in this repo (e.g. `Toast`'s non-Figma-sourced 6s
 * auto-dismiss).
 *
 * Corrected 2026-08-03 for pixel fidelity, from a direct user report with
 * screenshots ("button height, button label font size, and separator line
 * are not matching the Figma design"), verified via `get_variable_defs`
 * on nodes `1565:3298`/`1565:3337` (not inferred from the screenshot):
 * - Footer buttons ("Cancel"/"Create Project") were `size="sm"` on the
 *   shared `Button` (32px height, 12px horizontal padding, the 11px
 *   `label-sm` tier) — none Figma-evidenced here. Real bound values: 34px
 *   height, 14px horizontal padding (`--spacing-34`/`--spacing-14`), and
 *   "Body/Small Medium" (14/22/weight 500) for the label — overridden
 *   locally via `className`, not by changing `Button`'s shared `sm` preset
 *   (which has other consumers across the app this fix isn't scoped to).
 * - File-row filenames were a flat, guessed 13px (an earlier "+2px over
 *   the wrong 11px tier" fix made before this exact pull existed). Real
 *   values: "Body/Small Medium" (14/22/500) while active, one step
 *   smaller at "Body/XSmall Medium" (12/20/500) while a row is dimmed
 *   during "Creating your project" — confirmed identically across every
 *   row in both source nodes, not a one-off. Added `body-sm-medium`/
 *   `body-xs-medium` to `packages/tokens/src/typography.json` (same
 *   size/line-height as the existing `body-sm`/`body-xs` tiers, weight
 *   bumped to 500 — this file's own established `<tier>`/`<tier>-medium`
 *   naming, e.g. `app-caption`/`app-caption-medium`) rather than another
 *   one-off literal. `body-sm-medium` renamed to `body-sm-w500` 2026-08-04
 *   (numeric weight suffix, direct user request, made when `Button` became
 *   a second consumer) — `body-xs-medium` was left as-is, this rename
 *   didn't extend to it.
 * - File-row status text ("100kb · Uploaded") was `text-app-caption`
 *   (11/16/400, an unrelated AppShell-scoped tier) — real value is
 *   "Body/XSmall Regular" (12/20/400), unchanged between active/disabled
 *   rows, which is exactly this repo's existing `body-xs` tier.
 * - The separator between the file list and the footer actions didn't
 *   exist at all (only a margin gap, no visible line) — Figma's own
 *   divider ("<Divider> | Horizontal", a MUI `Divider`) is a hairline in
 *   `stroke/separator`, added as a real 1px `bg-[var(--color-border-
 *   separator)]` line, with the surrounding gaps corrected to Figma's
 *   32px (was 24px) above the list and above the footer, 16px (new)
 *   between the list and the divider.
 */
export function FileUploadProgressList({
  heading,
  subheading,
  files,
  onRemoveFile,
  cancelLabel = "Cancel",
  onCancel,
  primaryActionLabel = "Create Project",
  primaryActionLoading = false,
  primaryActionDisabled = false,
  onPrimaryAction,
  primaryActionErrorMessage,
  className
}: FileUploadProgressListProps) {
  const allUploaded = files.length > 0 && files.every((f) => f.status === "uploaded");
  const hasErrors = files.some((f) => f.status === "error");
  const uploadedCount = files.filter((f) => f.status === "uploaded").length;

  // Activation pop: 98% -> 100% scale when the primary action flips from
  // disabled to enabled (the spec's "button activation" cue). Tracked via a
  // ref rather than derived from props directly since it must only apply to
  // the transition itself, not to every render where the button happens to
  // be enabled.
  const [justActivated, setJustActivated] = useState(false);
  const prevDisabledRef = useRef(primaryActionDisabled || primaryActionLoading);
  useEffect(() => {
    const isEnabled = !(primaryActionDisabled || primaryActionLoading);
    if (prevDisabledRef.current && isEnabled) {
      setJustActivated(true);
      const timer = setTimeout(() => setJustActivated(false), 250);
      prevDisabledRef.current = !isEnabled;
      return () => clearTimeout(timer);
    }
    prevDisabledRef.current = !isEnabled;
  }, [primaryActionDisabled, primaryActionLoading]);

  let computedHeading: string;
  let computedSubheading: string;
  if (primaryActionLoading) {
    computedHeading = "Creating your project";
    computedSubheading = "Please wait while your project is being created.";
  } else if (allUploaded) {
    computedHeading = "Files uploaded successfully";
    computedSubheading = `Review uploaded ${files.length} files before creating project.`;
  } else {
    computedHeading = "Uploading files";
    computedSubheading = "Track each file as the upload moves forward.";
  }

  const statusLabel = primaryActionLoading
    ? "Creating your project"
    : allUploaded
      ? "Files uploaded, ready to create project"
      : "Uploading files";

  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-[var(--spacing-8)] px-[var(--spacing-8)] text-center">
        {allUploaded && !primaryActionLoading && (
          <CircleCheckIcon
            className="size-8 text-[var(--color-icon-success-icon)]"
            aria-hidden="true"
          />
        )}
        <h2 className="m-0 font-editorial text-headline-md font-semibold text-[var(--color-text-title)]">
          {heading ?? computedHeading}
        </h2>
        <p className="m-0 text-body-md text-[var(--color-text-secondary)]">
          {subheading ?? computedSubheading}
        </p>
      </div>

      {hasErrors && uploadedCount > 0 && uploadedCount < files.length && (
        <p
          role="status"
          className="m-0 mt-[var(--spacing-16)] flex items-center gap-[var(--spacing-8)] rounded-[var(--radius-sm)] bg-[var(--color-status-warning-subtle)] px-[var(--spacing-16)] py-[var(--spacing-8)] text-app-caption text-[var(--color-status-warning-text)]"
        >
          <WarningAmberOutlinedIcon className="size-4 shrink-0" aria-hidden="true" />
          {uploadedCount} files are ready. {files.length - uploadedCount} files need attention.
        </p>
      )}

      <div
        role="status"
        aria-live="polite"
        aria-busy={!allUploaded}
        className="mt-[var(--spacing-32)] flex flex-col gap-[var(--spacing-4)]"
      >
        <span className="sr-only">{statusLabel}</span>
        {files.map((file, index) => (
          <FileRow
            key={file.id}
            file={file}
            disabled={primaryActionLoading}
            staggerIndex={index}
            onRemove={() => onRemoveFile?.(file.id)}
          />
        ))}
      </div>

      {/* 1px separator between the file list and the footer actions — was
          missing entirely (only a margin gap, no visible line). Figma's own
          divider ("<Divider> | Horizontal", MUI Divider) resolves to a
          hairline in `stroke/separator`, this repo's existing
          `border.separator` semantic token. */}
      <div
        aria-hidden="true"
        className="mt-[var(--spacing-16)] h-px w-full bg-[var(--color-border-separator)]"
      />

      {primaryActionErrorMessage && (
        <p
          role="alert"
          className="m-0 mt-[var(--spacing-16)] flex items-center gap-[var(--spacing-8)] rounded-[var(--radius-sm)] bg-[var(--color-status-error-subtle)] px-[var(--spacing-16)] py-[var(--spacing-8)] text-app-caption text-[var(--color-status-error-text)]"
        >
          <WarningAmberOutlinedIcon className="size-4 shrink-0" aria-hidden="true" />
          {primaryActionErrorMessage}
        </p>
      )}

      <div className="mt-[var(--spacing-32)] flex items-center justify-end gap-[var(--spacing-16)]">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          // Corrected 2026-08-03 against get_variable_defs on Figma nodes
          // 1565:3298/1565:3337: `size="sm"` gives this shared Button a
          // 32px height, 12px horizontal padding, and the 11px `label-sm`
          // tier — none Figma-evidenced for this footer. The real bound
          // values are h-34/px-14 (`--spacing-34`/`--spacing-14`) and
          // "Body/Small Medium" (14/22/500 = `body-sm-w500`, renamed from
          // `body-sm-medium` 2026-08-04), overridden locally since neither existing Button size
          // preset matches and this is one footer, not every `size="sm"`
          // Button in the app.
          className="h-[var(--spacing-34)] px-[var(--spacing-14)] text-body-sm-w500 text-[var(--color-text-title)]"
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={primaryActionDisabled || primaryActionLoading}
          onClick={onPrimaryAction}
          className={cn(
            "h-[var(--spacing-34)] px-[var(--spacing-14)] text-body-sm-w500",
            "transition-transform duration-[var(--duration-fast)] ease-[var(--easing-enter)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100",
            justActivated && "scale-[0.98]"
          )}
        >
          <span className="relative inline-flex size-3.5 shrink-0 items-center justify-center">
            <span
              aria-hidden="true"
              className={cn(
                "absolute inline-flex size-3.5 animate-spin rounded-full border-2 border-[var(--color-button-disabled-text)] border-t-transparent transition-opacity duration-[var(--duration-fast)] motion-reduce:transition-none",
                primaryActionLoading ? "opacity-100" : "opacity-0"
              )}
            />
            <PlusIcon
              className={cn(
                "absolute size-3.5 transition-opacity duration-[var(--duration-fast)] motion-reduce:transition-none",
                primaryActionLoading ? "opacity-0" : "opacity-100"
              )}
              aria-hidden="true"
            />
          </span>
          {primaryActionLoading ? "Creating Project…" : primaryActionLabel}
        </Button>
      </div>
    </div>
  );
}
