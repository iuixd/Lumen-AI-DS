import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { Button } from "../components/button/Button";
import { FileUploadDropzone, type FileUploadDropzoneProps } from "./FileUploadDropzone";
import { FileUploadProgressList, type FileUploadFile } from "./FileUploadProgressList";
import { FileDropOverlay, useWindowFileDrag } from "./FileDropOverlay";
import { Modal } from "./Modal";
import { ToastProvider, useToast } from "./Toast";

export type FileUploadFlowStep = "upload" | "progress";

export interface FileUploadFlowStepState {
  /** `true` while the drag overlay covers the page — pages fade their own chrome to match. */
  dimmed: boolean;
}

export interface FileUploadFlowProps {
  /** Called once every file has finished (simulated) uploading and "Create Project" is clicked. Given the real `File[]` that were dropped/selected. Rejecting the returned promise surfaces the "creation failed" recovery state. */
  onProjectCreated?: (files: File[]) => void | Promise<void>;
  /** Copy/accept options forwarded to the upload step's `FileUploadDropzone`. */
  dropzoneProps?: Pick<FileUploadDropzoneProps, "heading" | "subheading" | "helperText" | "accept" | "multiple">;
  /**
   * Wraps each step's card in page chrome (header, page background). The
   * card itself — the 500px dropzone or the bordered progress card — is
   * `content`. Defaults to rendering `content` alone, faded while dimmed.
   */
  renderStep?: (step: FileUploadFlowStep, content: ReactNode, state: FileUploadFlowStepState) => ReactNode;
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}b`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}kb`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}mb`;
}

function fileIdOf(file: File): string {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Floor on how long the "Creating your project" screen stays up. Without
 * it, an `onProjectCreated` that resolves near-instantly (or is omitted)
 * settles before the browser ever paints the loading state, so clicking
 * "Create Project" visibly does nothing. No Figma/spec source for the exact
 * value; picked to comfortably clear a single paint.
 */
const MIN_CREATING_DURATION_MS = 600;

/**
 * Fades and slides its children in whenever `stepKey` changes — 300ms/12px
 * up (`--duration-slow`, `--easing-enter`), per the interaction spec's
 * "ease-out only, no bounce" card-entrance ask.
 */
function StepTransition({ stepKey, children }: { stepKey: string; children: ReactNode }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    setEntered(false);
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [stepKey]);
  return (
    <div
      className={cn(
        "transition-all duration-[var(--duration-slow)] ease-[var(--easing-enter)] motion-reduce:transition-none",
        entered ? "translate-y-0 opacity-100" : "translate-y-[var(--spacing-12)] opacity-0"
      )}
    >
      {children}
    </div>
  );
}

function defaultRenderStep(_step: FileUploadFlowStep, content: ReactNode, { dimmed }: FileUploadFlowStepState) {
  return (
    <div
      className={cn(
        "flex w-full justify-center transition-opacity duration-[var(--duration-slow)] ease-[var(--easing-enter)] motion-reduce:transition-none",
        dimmed && "opacity-[0.15]"
      )}
    >
      {content}
    </div>
  );
}

function Flow({ onProjectCreated, dropzoneProps, renderStep = defaultRenderStep }: FileUploadFlowProps) {
  const [step, setStep] = useState<FileUploadFlowStep>("upload");
  const [files, setFiles] = useState<FileUploadFile[]>([]);
  const [createPhase, setCreatePhase] = useState<"idle" | "creating" | "created" | "failed">("idle");
  const [createError, setCreateError] = useState<string | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const selectedFilesRef = useRef<File[]>([]);
  const progressTimerRef = useRef<ReturnType<typeof setInterval>>();
  const toastedRef = useRef(false);
  const { push } = useToast();

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    if (newFiles.length === 0) return;
    selectedFilesRef.current = [...selectedFilesRef.current, ...newFiles];
    toastedRef.current = false;
    setFiles((prev) => [
      ...prev,
      ...newFiles.map(
        (file): FileUploadFile => ({
          id: fileIdOf(file),
          name: file.name,
          sizeLabel: formatFileSize(file.size),
          status: "uploading",
          progress: 0
        })
      )
    ]);
    setStep("progress");
  }, []);

  // Drag tracking lives here, not in the dropzone (`dropOverlay="none"`
  // below), so the overlay outlives the upload step: it plays its drop
  // pulse and scales out while the progress step transitions in.
  const pageDrag = useWindowFileDrag({ enabled: step === "upload", onDrop: handleFilesSelected });

  // Simulated upload progress — advances every unfinished file by a random
  // increment, so files finish at slightly different times rather than in
  // visible lockstep.
  useEffect(() => {
    if (step !== "progress") return;
    progressTimerRef.current = setInterval(() => {
      setFiles((prev) =>
        prev.map((file) =>
          file.status === "uploading"
            ? file.progress! + 12 + Math.random() * 18 >= 100
              ? { ...file, status: "uploaded" as const, progress: 100 }
              : { ...file, progress: file.progress! + 12 + Math.random() * 18 }
            : file
        )
      );
    }, 220);
    return () => clearInterval(progressTimerRef.current);
  }, [step]);

  const allUploaded = files.length > 0 && files.every((f) => f.status === "uploaded");
  const fileToRemove = files.find((f) => f.id === confirmRemoveId);

  useEffect(() => {
    if (allUploaded && !toastedRef.current) {
      toastedRef.current = true;
      push({ title: "Files uploaded!", tone: "celebration", variant: "solid" });
    }
  }, [allUploaded, push]);

  function resetToUpload() {
    setFiles([]);
    selectedFilesRef.current = [];
    setCreatePhase("idle");
    setCreateError(null);
    toastedRef.current = false;
    setStep("upload");
  }

  function handleConfirmRemoveFile() {
    if (!confirmRemoveId) return;
    const idToRemove = confirmRemoveId;
    setConfirmRemoveId(null);
    const remaining = files.filter((f) => f.id !== idToRemove);
    // Deleting the last file would leave an empty, action-less progress
    // card — go back to the upload step instead.
    if (remaining.length === 0) {
      resetToUpload();
      return;
    }
    setFiles(remaining);
    selectedFilesRef.current = selectedFilesRef.current.filter((file) => fileIdOf(file) !== idToRemove);
  }

  async function handleCreateProject() {
    setCreateError(null);
    setCreatePhase("creating");
    try {
      await Promise.all([onProjectCreated?.(selectedFilesRef.current), wait(MIN_CREATING_DURATION_MS)]);
      // Stays on "Creating your project" after success: there is no next
      // screen here to move to — the parent navigates away.
      setCreatePhase("created");
    } catch (err) {
      setCreatePhase("failed");
      setCreateError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  const content =
    step === "upload" ? (
      <div className="w-full max-w-[500px]">
        <FileUploadDropzone {...dropzoneProps} onFilesSelected={handleFilesSelected} dropOverlay="none" />
      </div>
    ) : (
      <div className="w-full max-w-[538px] rounded-[var(--radius-2xl)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] p-[var(--spacing-40)]">
        <FileUploadProgressList
          files={files}
          onRemoveFile={setConfirmRemoveId}
          onCancel={resetToUpload}
          primaryActionLoading={createPhase === "creating" || createPhase === "created"}
          primaryActionDisabled={!allUploaded}
          onPrimaryAction={handleCreateProject}
          primaryActionErrorMessage={createPhase === "failed" ? createError ?? undefined : undefined}
          primaryActionLabel={createPhase === "failed" ? "Try again" : undefined}
        />
      </div>
    );

  return (
    <>
      <StepTransition stepKey={step}>
        {renderStep(step, content, { dimmed: step === "upload" && pageDrag.isDragging })}
      </StepTransition>
      <FileDropOverlay visible={step === "upload" && pageDrag.isDragging} pulsing={pageDrag.isDropping} />
      <Modal
        open={fileToRemove !== undefined}
        onOpenChange={(open) => {
          if (!open) setConfirmRemoveId(null);
        }}
        title="Remove file?"
        description={
          <>
            Remove <strong>{fileToRemove?.name}</strong> from this upload? This can&apos;t be undone.
          </>
        }
        actions={
          <>
            {/* Not labeled "Cancel" — the progress card's own footer already
                has a "Cancel" button (cancels the whole upload) behind this
                dialog, and a duplicate accessible name would be ambiguous. */}
            <Button type="button" variant="ghost" onClick={() => setConfirmRemoveId(null)}>
              Keep file
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirmRemoveFile}>
              Remove file
            </Button>
          </>
        }
      />
    </>
  );
}

/**
 * FileUploadFlow — the working upload journey: `FileUploadDropzone` →
 * full-window `FileDropOverlay` while dragging → drop or browse →
 * `FileUploadProgressList` "Uploading files" with per-file progress →
 * "Files uploaded successfully" (with a "Files uploaded!" toast) → Create
 * Project, which stays disabled until every file has finished.
 *
 * Extracted 2026-09-23 from `DataExtractionOnboardingPage`'s private
 * `OnboardingFlow`, unchanged in behavior and appearance (direct user
 * request: the upload flow should work with the dropzone on its own, not
 * only inside the onboarding pattern). That pattern now renders this after
 * its login step, supplying its header/page background through
 * `renderStep`. Carries over the pattern's earlier corrections: remove asks
 * for confirmation, removing the last file returns to the dropzone, Cancel
 * resets everything, "Creating your project" holds for at least
 * `MIN_CREATING_DURATION_MS` and stays up after success, and a rejected
 * `onProjectCreated` shows an inline error with "Try again".
 *
 * Upload progress is simulated on a client-side timer — like the pattern it
 * came from, this demonstrates the flow, not a working uploader.
 * `onProjectCreated` is the integration point.
 *
 * Renders its own `ToastProvider` (bottom-center, as the pattern did) so it
 * works anywhere without setup; the "Files uploaded!" toast appears in that
 * region, not an app-level one.
 */
export function FileUploadFlow({ className, ...props }: FileUploadFlowProps) {
  return (
    <ToastProvider position="bottom-center">
      <div className={className}>
        <Flow {...props} />
      </div>
    </ToastProvider>
  );
}
