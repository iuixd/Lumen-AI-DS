import { useEffect, useState, type ReactNode } from "react";
import { LumenLogo, FileUploadFlow, cn } from "@lumen/ui";
import { EnterpriseLoginPage, type EnterpriseLoginPageProps } from "./EnterpriseLoginPage";

type Step = "login" | "upload" | "progress";

export interface DataExtractionOnboardingPageProps {
  /** Passed straight through to the login screen (everything except `onComplete`/`initialScreen`, which this pattern owns). */
  loginProps?: Omit<EnterpriseLoginPageProps, "onComplete" | "initialScreen">;
  /** Called once every selected file has finished (simulated) uploading and "Create Project" is clicked. Given the real `File[]` that were dropped/selected. Rejecting the returned promise surfaces the "creation failed" recovery state. */
  onProjectCreated?: (files: File[]) => void | Promise<void>;
  /** Preview/testing entry point — which step to render first. Defaults to `"login"`; a real integration should always start there. `"progress"` has no files to show on its own, so it starts at the upload step, same as `"upload"`. */
  initialStep?: Step;
  className?: string;
}

/**
 * Fades and slides the login step in — 300ms/12px up (`--duration-slow`,
 * `--easing-enter`). The upload→progress transitions happen inside
 * `FileUploadFlow`, which uses the same motion.
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

function OnboardingFlow({
  loginProps,
  onProjectCreated,
  initialStep = "login"
}: Omit<DataExtractionOnboardingPageProps, "className">) {
  const [signedIn, setSignedIn] = useState(initialStep !== "login");
  const logo = <LumenLogo className="h-[22px] w-[22px] shrink-0" title="Lumen" />;

  if (!signedIn) {
    return (
      <StepTransition stepKey="login">
        <EnterpriseLoginPage {...loginProps} onComplete={() => setSignedIn(true)} />
      </StepTransition>
    );
  }

  return (
    <FileUploadFlow
      onProjectCreated={onProjectCreated}
      renderStep={(_step, content, { dimmed }) => (
        // Page chrome around the flow's card. `dimmed` fades it to 15% while
        // the drag overlay is up — the spec's "fade existing interface" cue.
        <div
          className={cn(
            "flex min-h-screen flex-col bg-[var(--color-background-app)] transition-opacity duration-[var(--duration-slow)] ease-[var(--easing-enter)] motion-reduce:transition-none",
            dimmed && "opacity-[0.15]"
          )}
        >
          <OnboardingHeader logo={logo} userName={loginProps?.userName} />
          <div className="flex flex-1 items-center justify-center px-[var(--spacing-32)] pb-[var(--spacing-32)]">
            {content}
          </div>
        </div>
      )}
    />
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
 * **Refactored 2026-09-23** (direct user request to make the upload flow
 * work with `FileUploadDropzone` on its own): everything after login — the
 * upload/progress state machine, simulated progress, drag overlay,
 * remove-file confirmation, Cancel, Create Project phases, and the "Files
 * uploaded!" toast — moved unchanged into `@lumen/ui`'s new
 * `FileUploadFlow`. This pattern now owns only the login step and the page
 * chrome (header, page background, dim-on-drag), passed in through
 * `FileUploadFlow`'s `renderStep`. The correction notes below describe
 * behavior that now lives in `FileUploadFlow`. The `ToastProvider` wrapper
 * this pattern used to add is gone too, because `FileUploadFlow` brings its
 * own.
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
 * page inert while open, for free. The unrelated, zero-consumer `Modal`
 * composite that existed at the time was left unchanged; the overlay
 * color/blur fix lives in `Dialog`'s own `DialogOverlay`
 * (`components/internal/dialog.tsx`), so it also applies to `CommandDialog`,
 * `Dialog`'s only other consumer.
 *
 * Migrated 2026-08-05 from raw `Dialog` primitives to a new `Modal`
 * composite (direct user request, following a `Dialog` Figma-fidelity
 * correction against Figma's canonical "Modal" component) — this dialog's
 * exact content turned out to be Figma's own example content for that
 * component. The prior zero-consumer `Modal` was retired the same day and
 * this migration makes the new one's first real consumer.
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
    <div className={props.className}>
      <OnboardingFlow {...props} />
    </div>
  );
}
