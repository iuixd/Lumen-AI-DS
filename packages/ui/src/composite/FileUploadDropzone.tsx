import { useRef, useState, type DragEvent } from "react";
import { cn } from "../lib/cn";
import { UploadIcon } from "../icons/generated/UploadIcon";

const pdfFileAsset = new URL("../assets/data-onboarding-file-pdf.svg", import.meta.url).href;
const imageFileAsset = new URL("../assets/data-onboarding-file-image.svg", import.meta.url).href;
const uploadArrowAsset = new URL("../assets/data-onboarding-upload-arrow.svg", import.meta.url).href;

export interface FileUploadDropzoneProps {
  heading?: string;
  subheading?: string;
  helperText?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  onFilesSelected?: (files: File[]) => void;
}

/**
 * FileUploadDropzone — the idle-state file-upload card: a gradient header
 * with an overlapping file-icon cluster, a heading/subheading, and a
 * dashed-border dropzone supporting both click-to-browse and native
 * drag-and-drop onto the dropzone itself.
 *
 * Sourced from Lumen-AI-Design-System node `1511:2701` ("01 - Upload
 * Component", "Upload Component" section), read via `get_design_context`
 * on 2026-07-30 — not the same Figma pipeline as this repo's usual Dev
 * Mode syncs (still the same file, but reached via a direct node URL the
 * user supplied for a new multi-screen workflow, not a `docs/changelog.md`
 * `[Unreleased]` entry — see that entry for the full scope note). The card
 * corner (`radius.xxxl`, 18px) and header gradient (`gradient.upload-
 * header`) are new tokens this sync added; every other value already
 * existed. The three overlapping file-type icons (`pdf-file`, `image-
 * file`, and a plain upload arrow this Figma file itself sourced from
 * svgrepo.com, named "file-upload-svgrepo-com 1") are committed as static
 * SVG assets — same treatment as `LumenLogo`/`ThemeToggle`'s icons, not
 * this repo's `currentColor` generated-icon set, since they're fixed
 * multi-part illustrations, not recolorable glyphs.
 *
 * The full-viewport "drop anywhere on the page" mask Figma shows as a
 * separate screen (node `1518:3718`) is deliberately NOT built into this
 * composite — that's a page-level concern (global `dragenter`/`drop`
 * listeners), not something a reusable card should own. See
 * `DataExtractionOnboardingPage` in `@lumen/patterns`, which layers that
 * behavior on top. This component only tracks drag state over its own
 * dropzone area.
 */
export function FileUploadDropzone({
  heading = "Start by uploading 20+ files",
  subheading = "to create a project for optimal results",
  helperText = "PDF, PNG, JPG or GIF (max. 3MB)",
  accept,
  multiple = true,
  disabled = false,
  className,
  onFilesSelected
}: FileUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    onFilesSelected?.(Array.from(fileList));
  }

  function handleDragEnter(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    dragCounter.current += 1;
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    // Stops here so a page-level drag-and-drop overlay (e.g.
    // DataExtractionOnboardingPage's full-viewport mask) that also listens
    // for `drop` on `window` doesn't double-handle a drop that landed
    // directly on this dropzone.
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div
      className={cn(
        "flex size-full flex-col items-center justify-center gap-[var(--spacing-32)] overflow-hidden rounded-[var(--radius-xxxl)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] pb-[var(--spacing-32)]",
        className
      )}
    >
      <div
        className="relative h-[150px] w-full shrink-0"
        style={{ background: "var(--gradient-upload-header)" }}
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-[20px] h-[130px] w-[107px] -translate-x-1/2">
          <div className="absolute left-0 top-[9px] h-[63px] w-[58px] rotate-[-19deg]">
            <img src={pdfFileAsset} alt="" className="size-full" />
          </div>
          <div className="absolute left-[47px] top-0 h-[64px] w-[61px] rotate-[23deg]">
            <img src={imageFileAsset} alt="" className="size-full" />
          </div>
          <div className="absolute left-[21px] top-[72px] size-[58px]">
            <img src={uploadArrowAsset} alt="" className="size-full" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-[var(--spacing-8)] text-center">
        <h2 className="m-0 font-editorial text-headline-md font-semibold text-[var(--color-text-title)]">
          {heading}
        </h2>
        <p className="m-0 text-body-md text-[var(--color-text-secondary)]">{subheading}</p>
      </div>

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex w-[436px] max-w-full cursor-pointer flex-col items-center gap-[var(--spacing-8)] rounded-[var(--radius-button)] border border-dashed px-[var(--spacing-16)] py-[var(--spacing-24)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]",
          isDragging
            ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500-a10)]"
            : "border-[var(--color-primary-200)]",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <UploadIcon className="size-8 text-[var(--color-text-secondary)]" aria-hidden="true" />
        <div className="flex items-center gap-[var(--spacing-4)] text-body-md font-medium">
          <span className="text-[var(--color-text-link)]">Click to upload</span>
          <span className="text-[var(--color-text-title)]">or drag and drop</span>
        </div>
        <p className="m-0 text-body-sm text-[var(--color-text-secondary)]">{helperText}</p>
      </div>
    </div>
  );
}
