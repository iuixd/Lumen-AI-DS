import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  ToastProvider,
  useToast,
  LumenLogo,
  FileUploadDropzone,
  FileUploadProgressList,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  cn,
  type FileUploadFile
} from "@lumen/ui";
import { EnterpriseLoginPage, type EnterpriseLoginPageProps } from "./EnterpriseLoginPage";

type Step = "login" | "upload" | "progress";
type CreateProjectPhase = "idle" | "creating" | "created" | "failed";

export interface DataExtractionOnboardingPageProps {
  /** Passed straight through to the login screen (everything except `onComplete`/`initialScreen`, which this pattern owns). */
  loginProps?: Omit<EnterpriseLoginPageProps, "onComplete" | "initialScreen">;
  /** Called once every selected file has finished (simulated) uploading and "Create Project" is clicked. Given the real `File[]` that were dropped/selected. Rejecting the returned promise surfaces the "creation failed" recovery state. */
  onProjectCreated?: (files: File[]) => void | Promise<void>;
  /** Preview/testing entry point — which step to render first. Defaults to `"login"`; a real integration should always start there. */
  initialStep?: Step;
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
 * it, an `onProjectCreated` that resolves near-instantly (or is omitted
 * entirely, e.g. while wiring this pattern up before a real backend
 * exists) settles within the same microtask flush as the click — before
 * the browser ever paints the loading state, so clicking "Create Project"
 * visibly does nothing. `Promise.all` still waits for the real duration if
 * `onProjectCreated` takes longer than this floor. No Figma/spec source
 * for the exact value; picked to comfortably clear a single paint.
 */
const MIN_CREATING_DURATION_MS = 600;

/**
 * Fades and slides its children in whenever `stepKey` changes — the
 * transition between onboarding steps. 300ms/12px-up matches the
 * interaction spec's card-entrance ask exactly (`--duration-slow`).
 * Switched from `--easing-emphasized` (provisional, no Figma source) to
 * `--easing-enter` (a real, Figma-evidenced ease-out curve) 2026-08-03,
 * since the spec explicitly asks for "ease-out only, no bounce" — this
 * affects all three step transitions (login→upload, upload→progress,
 * and re-entering upload on Cancel), not just new work.
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

/**
 * Full-viewport "drop your files anywhere" overlay, shown while the user
 * drags a file over the page during the upload step. Copy/color/no-icon
 * are exact Figma matches (node `1565:3375`) — Figma has no icon in this
 * state at all, so none is added here, even though the interaction spec
 * asks for one; adding Figma-unsourced visual content would contradict
 * the "match Figma exactly" instruction this redesign is built around.
 *
 * Reworked 2026-08-03 from a flat opacity crossfade into a scale-from-
 * center reveal (`--duration-slow`/`--easing-enter`, ~300ms, within the
 * spec's 250-350ms band) with its own inner text scale+fade (96%→100%,
 * `--duration-moderate`=200ms, 50ms delay) — a simplified equivalent of
 * "expand from the upload area," since a literal position-tracked/circular
 * reveal has no existing primitive in this codebase to build on and would
 * be a materially larger, separately-scoped engineering effort.
 * `pulsing` briefly brightens the surface on drop, before the step
 * transition takes over — the "drop confirmation" cue from the spec.
 */
function DragMask({ visible, pulsing }: { visible: boolean; pulsing?: boolean }) {
  return (
    <div
      aria-hidden={!visible}
      data-testid="drag-mask"
      className="pointer-events-none fixed inset-0 z-50"
    >
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center gap-[var(--spacing-16)] bg-[var(--color-deep-purple-700)] px-[var(--spacing-32)] text-center transition-[transform,filter] duration-[var(--duration-slow)] ease-[var(--easing-enter)] motion-reduce:transition-none",
          visible ? "scale-100" : "scale-0",
          pulsing && "brightness-125"
        )}
        style={{ transformOrigin: "center" }}
      >
        <div
          className={cn(
            "flex flex-col items-center gap-[var(--spacing-16)] transition-all delay-[50ms] duration-[var(--duration-moderate)] ease-[var(--easing-enter)] motion-reduce:transition-none motion-reduce:delay-0",
            visible ? "scale-100 opacity-100" : "scale-[0.96] opacity-0"
          )}
        >
          <p className="m-0 font-editorial text-display-sm font-semibold text-[var(--color-neutral-white)]">
            Drop your files like there's no limit!
          </p>
          <p className="m-0 text-body-lg font-medium text-[var(--color-deep-purple-200)]">
            Upload files and folders by dropping them in this window
          </p>
        </div>
      </div>
    </div>
  );
}

function OnboardingHeader({ logo, userName }: { logo: ReactNode; userName?: string }) {
  const initial = (userName?.trim()?.[0] ?? "U").toUpperCase();
  return (
    <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-[var(--color-border-default)] bg-[var(--color-background-default)] px-[var(--spacing-16)]">
      <span className="flex items-center gap-[var(--spacing-8)]">
        {logo}
        <span className="font-brand text-[16px] font-semibold leading-[24px] text-[var(--color-text-primary)]">
          Lumen AI
        </span>
      </span>
      <span
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-full bg-[var(--color-text-muted)] text-label-md font-semibold text-[var(--color-text-inverse)]"
      >
        {initial}
      </span>
    </header>
  );
}

function UploadStep({
  onFilesSelected,
  logo,
  userName,
  dimmed
}: {
  onFilesSelected: (files: File[]) => void;
  logo: ReactNode;
  userName?: string;
  /** Fades the page content to 15% while `DragMask` is visible on top — the spec's "fade existing interface" cue. */
  dimmed?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col bg-[var(--color-background-app)] transition-opacity duration-[var(--duration-slow)] ease-[var(--easing-enter)] motion-reduce:transition-none",
        dimmed && "opacity-[0.15]"
      )}
    >
      <OnboardingHeader logo={logo} userName={userName} />
      <div className="flex flex-1 items-center justify-center px-[var(--spacing-32)] pb-[var(--spacing-32)]">
        <div className="w-full max-w-[500px]">
          <FileUploadDropzone onFilesSelected={onFilesSelected} />
        </div>
      </div>
    </div>
  );
}

function ProgressStep({
  files,
  onRemoveFile,
  onCancel,
  primaryActionLoading,
  primaryActionDisabled,
  onPrimaryAction,
  logo,
  userName,
  createError
}: {
  files: FileUploadFile[];
  onRemoveFile: (fileId: string) => void;
  onCancel: () => void;
  primaryActionLoading: boolean;
  primaryActionDisabled: boolean;
  onPrimaryAction: () => void;
  logo: ReactNode;
  userName?: string;
  createError?: string | null;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background-app)]">
      <OnboardingHeader logo={logo} userName={userName} />
      <div className="flex flex-1 items-center justify-center px-[var(--spacing-32)] pb-[var(--spacing-32)]">
        <div className="w-full max-w-[538px] rounded-[var(--radius-2xl)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] p-[var(--spacing-40)]">
          <FileUploadProgressList
            files={files}
            onRemoveFile={onRemoveFile}
            onCancel={onCancel}
            primaryActionLoading={primaryActionLoading}
            primaryActionDisabled={primaryActionDisabled}
            onPrimaryAction={onPrimaryAction}
            primaryActionErrorMessage={createError ?? undefined}
            primaryActionLabel={createError ? "Try again" : undefined}
          />
        </div>
      </div>
    </div>
  );
}

function OnboardingFlow({
  loginProps,
  onProjectCreated,
  initialStep = "login"
}: Omit<DataExtractionOnboardingPageProps, "className">) {
  const [step, setStep] = useState<Step>(initialStep);
  const [files, setFiles] = useState<FileUploadFile[]>([]);
  const [createPhase, setCreatePhase] = useState<CreateProjectPhase>("idle");
  const [createError, setCreateError] = useState<string | null>(null);
  const [isDraggingPage, setIsDraggingPage] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const pageDragCounter = useRef(0);
  const selectedFilesRef = useRef<File[]>([]);
  const progressTimerRef = useRef<ReturnType<typeof setInterval>>();
  const toastedRef = useRef(false);
  const { push } = useToast();

  const logo = <LumenLogo className="h-[22px] w-[22px] shrink-0" title="Lumen" />;

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

  // Simulated upload progress — advances every file that isn't done yet by a
  // random increment, so files finish at slightly different times rather
  // than in visible lockstep.
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

  function handleRequestRemoveFile(fileId: string) {
    setConfirmRemoveId(fileId);
  }

  function handleCancelRemoveFile() {
    setConfirmRemoveId(null);
  }

  function handleConfirmRemoveFile() {
    if (!confirmRemoveId) return;
    const idToRemove = confirmRemoveId;
    setConfirmRemoveId(null);

    const remaining = files.filter((f) => f.id !== idToRemove);
    setFiles(remaining);
    selectedFilesRef.current = selectedFilesRef.current.filter(
      (file) => fileIdOf(file) !== idToRemove
    );

    // Deleting the last file leaves an empty, action-less progress card —
    // send the user back to the upload step instead, per direct user bug
    // report ("when user deletes the final file to make empty should take
    // user back to the upload screen").
    if (remaining.length === 0) {
      setCreatePhase("idle");
      setCreateError(null);
      toastedRef.current = false;
      setStep("upload");
    }
  }

  async function handleCreateProject() {
    setCreateError(null);
    setCreatePhase("creating");
    try {
      await Promise.all([
        onProjectCreated?.(selectedFilesRef.current),
        wait(MIN_CREATING_DURATION_MS)
      ]);
      setCreatePhase("created");
    } catch (err) {
      setCreatePhase("failed");
      setCreateError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  function handleCancelUpload() {
    setFiles([]);
    selectedFilesRef.current = [];
    setCreatePhase("idle");
    setCreateError(null);
    setStep("upload");
  }

  useEffect(() => {
    if (step !== "upload") {
      setIsDraggingPage(false);
      pageDragCounter.current = 0;
      return;
    }
    function hasFiles(e: DragEvent) {
      return Array.from(e.dataTransfer?.types ?? []).includes("Files");
    }
    function onDragEnter(e: DragEvent) {
      if (!hasFiles(e)) return;
      e.preventDefault();
      pageDragCounter.current += 1;
      setIsDraggingPage(true);
    }
    function onDragOver(e: DragEvent) {
      if (hasFiles(e)) e.preventDefault();
    }
    function onDragLeave(e: DragEvent) {
      if (!hasFiles(e)) return;
      e.preventDefault();
      pageDragCounter.current = Math.max(pageDragCounter.current - 1, 0);
      if (pageDragCounter.current === 0) setIsDraggingPage(false);
    }
    function onDrop(e: DragEvent) {
      if (!hasFiles(e)) return;
      e.preventDefault();
      pageDragCounter.current = 0;
      // Brief "drop acknowledged" pulse (spec: 150ms) before the mask
      // reverses and StepTransition crossfades in the progress card.
      setIsDropping(true);
      setTimeout(() => setIsDropping(false), 150);
      setIsDraggingPage(false);
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) handleFilesSelected(Array.from(files));
    }
    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, [step, handleFilesSelected]);

  return (
    <>
      {step === "login" && (
        <StepTransition stepKey="login">
          <EnterpriseLoginPage {...loginProps} onComplete={() => setStep("upload")} />
        </StepTransition>
      )}
      {step === "upload" && (
        <StepTransition stepKey="upload">
          <UploadStep
            onFilesSelected={handleFilesSelected}
            logo={logo}
            userName={loginProps?.userName}
            dimmed={isDraggingPage}
          />
        </StepTransition>
      )}
      {step === "progress" && (
        <StepTransition stepKey="progress">
          <ProgressStep
            files={files}
            onRemoveFile={handleRequestRemoveFile}
            onCancel={handleCancelUpload}
            primaryActionLoading={createPhase === "creating" || createPhase === "created"}
            primaryActionDisabled={!allUploaded}
            onPrimaryAction={handleCreateProject}
            logo={logo}
            userName={loginProps?.userName}
            createError={createPhase === "failed" ? createError : null}
          />
        </StepTransition>
      )}
      <DragMask visible={step === "upload" && isDraggingPage} pulsing={isDropping} />
      <Dialog
        open={fileToRemove !== undefined}
        onOpenChange={(open) => {
          if (!open) handleCancelRemoveFile();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove file?</DialogTitle>
            <DialogDescription>
              Remove <strong>{fileToRemove?.name}</strong> from this upload? This can&apos;t be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {/* Not labeled "Cancel" — the progress step's own footer already has
                a "Cancel" button (cancels the whole upload) mounted behind this
                dialog, and a duplicate accessible name would be ambiguous for
                screen-reader users navigating by name, not just in tests. */}
            <Button type="button" variant="ghost" onClick={handleCancelRemoveFile}>
              Keep file
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirmRemoveFile}>
              Remove file
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * DataExtractionOnboardingPage — the full, functional, click-through
 * onboarding journey for Lumen's data-extraction product: enterprise
 * login, a file-upload dropzone (supporting drop-anywhere-on-the-page as
 * well as click-to-browse), simulated per-file upload progress grouped by
 * document type, and a "Create Project" action — each step animating into
 * the next rather than hard-cutting.
 *
 * Sourced from the "Upload Component" Figma section (Lumen-AI-Design-
 * System, node `1524:4201`, reached via a direct node URL the user
 * supplied, not this repo's usual Dev Mode `[Unreleased]`-scoped sync —
 * see `docs/changelog.md` for the full scope note), at direct user request
 * ("starts from login page -> file upload -> animated uploaded feedback ->
 * Once Uploaded Create a Project... All screens should be functional and
 * interactive and take user to the next screen"). Composes three
 * screens/composites that are independently documented and reusable on
 * their own: `EnterpriseLoginPage`, `FileUploadDropzone`, and
 * `FileUploadProgressList` — this component's only real estate is the
 * step state machine, the file-grouping/simulated-progress logic, the
 * full-viewport drag mask, and the animated transitions between steps.
 *
 * "Simulated" is doing real work in that last paragraph: like every other
 * pattern in this repo, this component does not talk to a real upload
 * backend. `onProjectCreated` is the integration point — wire it to a real
 * API call in the product repo. The per-file progress bars advance on a
 * client-side timer alone, which is why this component's docs call it a
 * demonstration of the *flow*, not a working uploader.
 *
 * Corrected 2026-08-03 (direct user bug report: removing an uploaded file
 * had no confirmation, and deleting the last remaining file left the
 * progress card empty with no way back to the upload step): removing a
 * file now asks for confirmation first — no Figma source exists for this
 * dialog (the interaction spec covers removal only as a raw "remove"
 * affordance, never a confirmation step). Confirming removal that empties
 * the list now also resets `createPhase`/`createError`/the toast-shown
 * flag and returns `step` to `"upload"`, the same reset `handleCancelUpload`
 * already performs.
 *
 * Corrected again same-day (direct user report: "the modal overlay should
 * use a black backdrop with a blur effect... users must not be able to
 * interact with or scroll the content behind the overlay"): this
 * confirmation dialog was first built on `@lumen/ui`'s lightweight `Modal`
 * composite, which its own docblock already flags as "focus-trap-free... swap
 * in Radix Dialog if strict focus trapping / portal behavior is required" —
 * exactly this request. Rather than hand-rolling scroll-lock and focus-trap
 * logic into `Modal` (duplicating what Radix already solves correctly, and
 * what this repo's `Drawer`/`Sheet` already rely on for the same reason),
 * switched to the already-existing, Radix-backed `Dialog` — its `modal`
 * default (`true`) locks body scroll and traps focus/marks the rest of the
 * page inert while open, for free. `Modal` itself is unchanged and still
 * exported (had zero other consumers in this repo either way); the overlay
 * color/blur fix lives in `Dialog`'s own `DialogOverlay`
 * (`components/internal/dialog.tsx`), so it also applies to `CommandDialog`,
 * `Dialog`'s only other consumer.
 *
 * Corrected again same-day (direct user report, with a reference
 * screenshot of the intended "Creating your project" screen: "Clicking on
 * Create Project should take user to the Creating Project screen"):
 * `handleCreateProject` awaited `onProjectCreated` directly, so a call that
 * resolves near-instantly (or is omitted, e.g. while wiring this pattern up
 * before a real backend exists — the likely case behind this report) let
 * `createPhase` flip `"creating"` -> `"created"` within the same microtask
 * flush as the click, before the browser ever painted the loading screen —
 * clicking "Create Project" visibly did nothing. See `MIN_CREATING_DURATION_MS`
 * for the fix (a floor on how long "creating" stays up, via `Promise.all`).
 *
 * Corrected again same-day (direct user request: "Once user click the
 * Create Project stay on that screen please"): `primaryActionLoading` was
 * `createPhase === "creating"` only, so once `onProjectCreated` resolved
 * and `createPhase` became `"created"`, the button re-enabled and the
 * heading reverted to "Files uploaded successfully" — since this pattern
 * has no next project-details/overview screen to move to (an explicit,
 * already-documented scope boundary — `onProjectCreated` is the
 * integration point, the parent app navigates away), reverting just read
 * as the click having failed/undone itself. Now `primaryActionLoading` is
 * true for both `"creating"` and `"created"`, so the flow stays on
 * "Creating your project" once clicked, until the parent either navigates
 * away (unmounting this component) or `onProjectCreated` rejects (the
 * existing `"failed"` recovery path is unaffected).
 *
 * Corrected 2026-07-31 (direct user request to standardize this pattern's
 * tokens alongside `EnterpriseLoginPage`'s own extensive same-day
 * correction pass — see that component's docblock for the full trail this
 * one reuses): the upload/progress steps' full-page background
 * (`UploadStep`/`ProgressStep`) used `--color-background-subtle`
 * (`#EFEFEF`); a fresh `get_variable_defs` pull on this same "Upload
 * Component" Figma section's own dropzone frame (`1511:2701`) shows it
 * binds `bg/app` (`#f6f8f8`) instead — the exact same token
 * `EnterpriseLoginPage`'s outer wrapper was just corrected to. Both steps'
 * root now use `--color-background-app`, matching the login step exactly
 * rather than a different, coincidentally-similar gray. `OnboardingHeader`
 * was also re-verified against this section's own shared `Header`
 * component instance (node `1511:3675`): its brand text is "Lumen AI" (not
 * this component's previous "Lumen" — the same drift `EnterpriseLoginPage`
 * had already been corrected for), on a bordered white bar
 * (`bg/surface`/`stroke/default`, 52px tall) rather than this component's
 * previous bare, unstyled, undersized header — and it carries a user
 * avatar on its right edge that this component had never rendered at all.
 * Corrected the brand text and header chrome to match, and added the
 * avatar: since this pattern has no dedicated "current user" concept of
 * its own, its initial is derived from `loginProps.userName`'s first
 * character (falling back to "U") — reusing data this component already
 * receives rather than adding a new required prop for one badge.
 */
export function DataExtractionOnboardingPage(props: DataExtractionOnboardingPageProps) {
  return (
    <ToastProvider position="bottom-center">
      <div className={props.className}>
        <OnboardingFlow {...props} />
      </div>
    </ToastProvider>
  );
}
