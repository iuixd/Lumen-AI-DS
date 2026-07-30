import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  ToastProvider,
  useToast,
  LumenLogo,
  FileUploadDropzone,
  FileUploadProgressList,
  cn,
  type FileUploadGroupData,
  type FileUploadFile
} from "@lumen/ui";
import { EnterpriseLoginPage, type EnterpriseLoginPageProps } from "./EnterpriseLoginPage";

type Step = "login" | "upload" | "progress";

export interface DataExtractionOnboardingPageProps {
  /** Passed straight through to the login screen (everything except `onComplete`/`initialScreen`, which this pattern owns). */
  loginProps?: Omit<EnterpriseLoginPageProps, "onComplete" | "initialScreen">;
  /** Called once every selected file has finished (simulated) uploading and "Create Project" is clicked. Given the real `File[]` that were dropped/selected. */
  onProjectCreated?: (files: File[]) => void | Promise<void>;
  /** Where to categorize a file for the grouped progress view. Defaults to a simple Documents/Images/Other split by extension. */
  categorizeFile?: (file: File) => string;
  /** Preview/testing entry point — which step to render first. Defaults to `"login"`; a real integration should always start there. */
  initialStep?: Step;
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}b`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}kb`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}mb`;
}

function defaultCategorize(file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return "Images";
  if (["pdf", "doc", "docx", "txt", "md", "csv"].includes(ext)) return "Documents";
  return "Other files";
}

/** Fades and slides its children in whenever `stepKey` changes — the transition between onboarding steps. */
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
        "transition-all duration-[var(--duration-slow)] ease-[var(--easing-emphasized)] motion-reduce:transition-none",
        entered ? "translate-y-0 opacity-100" : "translate-y-[var(--spacing-8)] opacity-0"
      )}
    >
      {children}
    </div>
  );
}

/** Full-viewport "drop your files anywhere" overlay, shown while the user drags a file over the page during the upload step. */
function DragMask({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center gap-[var(--spacing-16)] bg-[var(--color-deep-purple-700)] px-[var(--spacing-32)] text-center transition-opacity duration-[var(--duration-moderate)] ease-[var(--easing-standard)] motion-reduce:transition-none",
        visible ? "pointer-events-none opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <p className="m-0 font-editorial text-display-sm font-semibold text-[var(--color-neutral-white)]">
        Drop your files like there's no limit!
      </p>
      <p className="m-0 text-body-lg font-medium text-[var(--color-deep-purple-200)]">
        Upload files and folders by dropping them in this window
      </p>
    </div>
  );
}

function OnboardingHeader({ logo }: { logo: ReactNode }) {
  return (
    <header className="flex items-center gap-[var(--spacing-10)] px-[var(--spacing-32)] py-[var(--spacing-24)]">
      {logo}
      <span className="font-brand text-title-md text-[var(--color-text-title)]">Lumen</span>
    </header>
  );
}

function UploadStep({
  onFilesSelected,
  logo
}: {
  onFilesSelected: (files: File[]) => void;
  logo: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background-subtle)]">
      <OnboardingHeader logo={logo} />
      <div className="flex flex-1 items-center justify-center px-[var(--spacing-32)] pb-[var(--spacing-32)]">
        <div className="w-full max-w-[500px]">
          <FileUploadDropzone onFilesSelected={onFilesSelected} />
        </div>
      </div>
    </div>
  );
}

function ProgressStep({
  groups,
  onRemoveFile,
  onCancel,
  primaryActionLoading,
  primaryActionDisabled,
  onPrimaryAction,
  logo
}: {
  groups: FileUploadGroupData[];
  onRemoveFile: (groupId: string, fileId: string) => void;
  onCancel: () => void;
  primaryActionLoading: boolean;
  primaryActionDisabled: boolean;
  onPrimaryAction: () => void;
  logo: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background-subtle)]">
      <OnboardingHeader logo={logo} />
      <div className="flex flex-1 items-start justify-center px-[var(--spacing-32)] pb-[var(--spacing-32)]">
        <div className="w-full max-w-[538px] rounded-[var(--radius-2xl)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] p-[var(--spacing-40)]">
          <FileUploadProgressList
            groups={groups}
            onRemoveFile={onRemoveFile}
            onCancel={onCancel}
            primaryActionLoading={primaryActionLoading}
            primaryActionDisabled={primaryActionDisabled}
            onPrimaryAction={onPrimaryAction}
          />
        </div>
      </div>
    </div>
  );
}

function OnboardingFlow({
  loginProps,
  onProjectCreated,
  categorizeFile = defaultCategorize,
  initialStep = "login"
}: Omit<DataExtractionOnboardingPageProps, "className">) {
  const [step, setStep] = useState<Step>(initialStep);
  const [groups, setGroups] = useState<FileUploadGroupData[]>([]);
  const [creatingProject, setCreatingProject] = useState(false);
  const [isDraggingPage, setIsDraggingPage] = useState(false);
  const pageDragCounter = useRef(0);
  const selectedFilesRef = useRef<File[]>([]);
  const progressTimerRef = useRef<ReturnType<typeof setInterval>>();
  const toastedRef = useRef(false);
  const { push } = useToast();

  const logo = <LumenLogo className="h-[22px] w-[22px] shrink-0" title="Lumen" />;

  const handleFilesSelected = useCallback(
    (files: File[]) => {
      if (files.length === 0) return;
      selectedFilesRef.current = [...selectedFilesRef.current, ...files];
      toastedRef.current = false;

      setGroups((prev) => {
        const byName = new Map(prev.map((g) => [g.name, g]));
        for (const file of files) {
          const category = categorizeFile(file);
          const existing = byName.get(category);
          const entry: FileUploadFile = {
            id: `${category}-${file.name}-${file.size}-${file.lastModified}`,
            name: file.name,
            sizeLabel: formatFileSize(file.size),
            status: "uploading",
            progress: 0
          };
          if (existing) {
            existing.files = [...existing.files, entry];
          } else {
            byName.set(category, { id: category, name: category, files: [entry] });
          }
        }
        return Array.from(byName.values());
      });

      setStep("progress");
    },
    [categorizeFile]
  );

  // Simulated upload progress — advances every file that isn't done yet by a
  // random increment, so files finish at slightly different times rather
  // than in visible lockstep.
  useEffect(() => {
    if (step !== "progress") return;
    progressTimerRef.current = setInterval(() => {
      setGroups((prev) =>
        prev.map((group) => ({
          ...group,
          files: group.files.map((file) =>
            file.status === "uploading"
              ? file.progress! + 12 + Math.random() * 18 >= 100
                ? { ...file, status: "uploaded" as const, progress: 100 }
                : { ...file, progress: file.progress! + 12 + Math.random() * 18 }
              : file
          )
        }))
      );
    }, 220);
    return () => clearInterval(progressTimerRef.current);
  }, [step]);

  const allUploaded = groups.length > 0 && groups.every((g) => g.files.every((f) => f.status === "uploaded"));

  useEffect(() => {
    if (allUploaded && !toastedRef.current) {
      toastedRef.current = true;
      push({ title: "Files uploaded!", tone: "celebration", variant: "solid" });
    }
  }, [allUploaded, push]);

  function handleRemoveFile(groupId: string, fileId: string) {
    setGroups((prev) =>
      prev
        .map((g) => (g.id === groupId ? { ...g, files: g.files.filter((f) => f.id !== fileId) } : g))
        .filter((g) => g.files.length > 0)
    );
  }

  async function handleCreateProject() {
    setCreatingProject(true);
    await onProjectCreated?.(selectedFilesRef.current);
    setCreatingProject(false);
  }

  function handleCancelUpload() {
    setGroups([]);
    selectedFilesRef.current = [];
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
          <UploadStep onFilesSelected={handleFilesSelected} logo={logo} />
        </StepTransition>
      )}
      {step === "progress" && (
        <StepTransition stepKey="progress">
          <ProgressStep
            groups={groups}
            onRemoveFile={handleRemoveFile}
            onCancel={handleCancelUpload}
            primaryActionLoading={creatingProject}
            primaryActionDisabled={!allUploaded}
            onPrimaryAction={handleCreateProject}
            logo={logo}
          />
        </StepTransition>
      )}
      <DragMask visible={step === "upload" && isDraggingPage} />
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
 */
export function DataExtractionOnboardingPage(props: DataExtractionOnboardingPageProps) {
  return (
    <ToastProvider>
      <div className={props.className}>
        <OnboardingFlow {...props} />
      </div>
    </ToastProvider>
  );
}
