import { Button } from "../components/button/Button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/accordion/Accordion";
import { UploadIcon } from "../icons/generated/UploadIcon";
import { CloseFilledIcon } from "../icons/generated/CloseFilledIcon";
import { FolderIcon } from "../icons/generated/FolderIcon";
import { PlusIcon } from "../icons/generated/PlusIcon";

export interface FileUploadFile {
  id: string;
  name: string;
  /** Preformatted, e.g. `"100kb"`. */
  sizeLabel: string;
  status: "uploading" | "uploaded" | "error";
  /** 0-100. Only rendered while `status === "uploading"`. */
  progress?: number;
}

export interface FileUploadGroupData {
  id: string;
  name: string;
  files: FileUploadFile[];
}

export interface FileUploadProgressListProps {
  heading?: string;
  subheading?: string;
  groups: FileUploadGroupData[];
  onRemoveFile?: (groupId: string, fileId: string) => void;
  cancelLabel?: string;
  onCancel?: () => void;
  primaryActionLabel?: string;
  primaryActionLoading?: boolean;
  primaryActionDisabled?: boolean;
  onPrimaryAction?: () => void;
  className?: string;
}

function groupProgress(group: FileUploadGroupData): number | null {
  if (group.files.length === 0) return null;
  if (group.files.every((f) => f.status !== "uploading")) return null;
  const total = group.files.reduce((sum, f) => sum + (f.status === "uploaded" ? 100 : (f.progress ?? 0)), 0);
  return Math.round(total / group.files.length);
}

function FileRow({
  file,
  onRemove
}: {
  file: FileUploadFile;
  onRemove?: () => void;
}) {
  return (
    <div className="flex items-center gap-[var(--spacing-8)] rounded-[var(--radius-sm)] py-[var(--spacing-4)] pl-[var(--spacing-40)] pr-[var(--spacing-16)]">
      <UploadIcon className="size-4 shrink-0 text-[var(--color-text-secondary)]" aria-hidden="true" />
      <div className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-4)]">
        <p className="m-0 truncate text-app-caption font-medium text-[var(--color-text-title)]">{file.name}</p>
        <div className="flex items-center gap-[var(--spacing-8)] text-app-caption text-[var(--color-text-secondary)]">
          <span>{file.sizeLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{file.status === "uploaded" ? "Uploaded" : file.status === "error" ? "Failed" : "Loading"}</span>
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
      <button
        type="button"
        aria-label={`Remove ${file.name}`}
        onClick={onRemove}
        className="flex size-4 shrink-0 items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-title)]"
      >
        <CloseFilledIcon className="size-full" />
      </button>
    </div>
  );
}

/**
 * FileUploadProgressList — the accordion-grouped, per-file upload progress
 * view that follows `FileUploadDropzone` once files are selected.
 *
 * Sourced from Lumen-AI-Design-System node `1518:3766`/`1518:5832`/
 * `1518:6065` ("03/04/05 - Upload Component", "Upload Component" section),
 * read via `get_design_context` on 2026-07-30 (same non-Dev-Mode-sync
 * pipeline noted on `FileUploadDropzone`). Reuses the existing `Accordion`
 * (Radix, shadcn-sourced) rather than a bespoke expand/collapse — matches
 * hard rule 2 (extend, don't duplicate). Deliberately NOT changed as part
 * of this sync: `Accordion`'s expand/collapse is instant, a pre-existing,
 * already-documented gap (see `components/internal/accordion.tsx`'s own
 * docblock) — fixing it is a cross-cutting change to a shared primitive,
 * out of scope for this one composite.
 *
 * Per-file progress bar colors (`deep-purple.600` fill on a 60%-opacity
 * `deep-purple.200` track) are an exact match to the Figma source with no
 * new tokens needed. The per-group header's own aggregate bar
 * (`groupProgress`) is a derived average, not independently Figma-sourced
 * (that frame's group-header progress bar has no bound data — this is a
 *
 * Corrected 2026-07-30 (same day, direct user report of a Figma mismatch)
 * after a dedicated `get_design_context` pull on the card's own root node
 * (`1518:4035`), not just its file-row/button sub-nodes as in the first
 * pass: heading was `headline-sm` (20/28), the real Figma H4 style is
 * `headline-lg` (32/42, matching `FileUploadDropzone`'s own heading) with
 * `-1.5px` tracking; subheading was `body-sm` (14/22), real value is
 * `body-md` (16/26); the "Create Project" button was missing its leading
 * `+` icon (`PlusIcon`), present in every non-loading Figma instance of
 * this button; "Cancel" was rendering `Button`'s default `ghost` on-action
 * color (primary.500 crimson, correct for `Button` generally per its own
 * sync) where this specific instance's bound color is `text.title`
 * (near-black) — overridden locally via `className`, not by changing
 * `Button` itself. Also corrected the wrapping card's own radius: this
 * component was floated at `radius.xxxl` (18px, `FileUploadDropzone`'s
 * card value) by copy-paste rather than verified independently — the real
 * bound value on this node is a plain 16px, i.e. the existing
 * `radius.2xl`, no new token involved.
 * reasonable generalization of the same visual language).
 */
export function FileUploadProgressList({
  heading = "Group files by document type",
  subheading = "to organizing and managing your data extraction tasks",
  groups,
  onRemoveFile,
  cancelLabel = "Cancel",
  onCancel,
  primaryActionLabel = "Create Project",
  primaryActionLoading = false,
  primaryActionDisabled = false,
  onPrimaryAction,
  className
}: FileUploadProgressListProps) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-[var(--spacing-8)] px-[var(--spacing-8)] text-center">
        <h2 className="m-0 font-editorial text-headline-lg font-semibold tracking-[-1.5px] text-[var(--color-text-title)]">
          {heading}
        </h2>
        <p className="m-0 text-body-md text-[var(--color-text-secondary)]">{subheading}</p>
      </div>

      <Accordion type="multiple" defaultValue={groups.map((g) => g.id)} className="mt-[var(--spacing-24)]">
        {groups.map((group) => {
          const progress = groupProgress(group);
          return (
            <AccordionItem key={group.id} value={group.id}>
              <AccordionTrigger className="py-[var(--spacing-8)] pl-[var(--spacing-16)] pr-0 hover:no-underline">
                <span className="flex flex-1 flex-col gap-[var(--spacing-4)]">
                  <span className="text-app-caption-medium text-[var(--color-text-title)]">{group.name}</span>
                  <span className="flex items-center gap-[var(--spacing-4)] text-app-caption text-[var(--color-text-secondary)]">
                    <FolderIcon className="size-4" aria-hidden="true" />
                    <span>Folder</span>
                    <span aria-hidden="true">·</span>
                    <span>{group.files.length} Files</span>
                  </span>
                  {progress !== null && (
                    <span className="h-[2px] w-[200px] max-w-full overflow-hidden rounded-[var(--radius-sm)] bg-[var(--color-background-subtle)]">
                      <span
                        className="block h-full rounded-[var(--radius-sm)] bg-[var(--color-deep-purple-600)] transition-[width] duration-[var(--duration-moderate)] ease-[var(--easing-standard)]"
                        style={{ width: `${progress}%` }}
                      />
                    </span>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-[var(--spacing-4)] pb-[var(--spacing-16)] pt-[var(--spacing-8)]">
                {group.files.map((file) => (
                  <FileRow key={file.id} file={file} onRemove={() => onRemoveFile?.(group.id, file.id)} />
                ))}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <div className="mt-[var(--spacing-24)] flex items-center justify-end gap-[var(--spacing-16)]">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-[var(--color-text-title)]"
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={primaryActionDisabled || primaryActionLoading}
          onClick={onPrimaryAction}
        >
          {primaryActionLoading ? (
            <span
              aria-hidden="true"
              className="size-3.5 animate-spin rounded-full border-2 border-[var(--color-button-disabled-text)] border-t-transparent"
            />
          ) : (
            <PlusIcon className="size-3.5" aria-hidden="true" />
          )}
          {primaryActionLoading ? "Creating Project…" : primaryActionLabel}
        </Button>
      </div>
    </div>
  );
}
