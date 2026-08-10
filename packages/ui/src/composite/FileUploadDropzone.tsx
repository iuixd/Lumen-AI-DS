import { useEffect, useRef, useState, type DragEvent } from "react";
import { cn } from "../lib/cn";
import { UploadIcon } from "../icons/generated/UploadIcon";

const defaultHeaderAsset = new URL("../assets/file-upload-header-default.svg", import.meta.url).href;
const hoverHeaderAsset = new URL("../assets/file-upload-header-hover.svg", import.meta.url).href;

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
 * Updated 2026-08-10 from Figma node `1874:392` and the two user-supplied
 * 500x150 header exports. The default SVG is always present; entering the
 * upload zone mounts the self-animated hover SVG and crossfades to it using
 * existing motion tokens. Leaving reverses the crossfade, then unmounts the
 * animated document so the next hover restarts at its authored first frame.
 * Reduced-motion mode keeps the default artwork and hides the animated SVG.
 * This supersedes the earlier `PileOfPapers` implementation documented below.
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
 * file`, and — as of 2026-08-03, two separate pieces, see below — an
 * upload-arrow glyph and its tray/bracket, this Figma file itself sourced
 * from svgrepo.com, originally named "file-upload-svgrepo-com 1") are
 * committed as static SVG assets — same treatment as `LumenLogo`/
 * `ThemeToggle`'s icons, not this repo's `currentColor` generated-icon
 * set, since they're fixed multi-part illustrations, not recolorable
 * glyphs.
 *
 * The full-viewport "drop anywhere on the page" mask Figma shows as a
 * separate screen (node `1518:3718`) is deliberately NOT built into this
 * composite — that's a page-level concern (global `dragenter`/`drop`
 * listeners), not something a reusable card should own. See
 * `DataExtractionOnboardingPage` in `@lumen/patterns`, which layers that
 * behavior on top. This component only tracks drag state over its own
 * dropzone area.
 *
 * Corrected 2026-08-03, against a reorganized Figma section (fileKey
 * `GJBYRm6ySR7XIECFcHMgy2`, node `1565:3097`), while redesigning this
 * flow's interaction design: the heading was using `headline-lg` (32/42,
 * Figma H4) with an invented `-1.5px` tracking; the real bound style is
 * `headline-md` (24/32, Figma H5) at `0px` tracking. Also fixed a real,
 * unrelated bug found in the same pass: the drag-over tint referenced
 * `--color-primary-500-a10`, a token that was renamed to `500-a8` in an
 * earlier session and never updated here — it had been resolving to
 * nothing (an unset CSS custom property) since that rename. Added a
 * hover response for the dashed dropzone (border deepens one step,
 * background gains the same `500-a8` tint the drag state already used,
 * the upload icon lifts 2px) — a real gap, since only the drag-over state
 * had any visual response before; `--duration-fast` (100ms) is reused for
 * both, the closest existing token to the spec's 150ms ask (no exact
 * 150ms token exists in this repo's motion scale).
 *
 * Fixed 2026-08-03, direct user bug report with a screenshot ("the entire
 * screen should transition to a violet drop-zone background and remain
 * visible until they either drop the files anywhere on the screen or
 * cancel the drag action"): `handleDragEnter` called `e.stopPropagation()`
 * while `handleDragLeave` never did — an asymmetry that broke the page-
 * level "drop anywhere" listener's enter/leave counter the instant the
 * cursor entered this card (the ancestor still saw the matching leave
 * event, but never the enter), hiding `DataExtractionOnboardingPage`'s
 * full-viewport mask right when it should have stayed visible. Removed the
 * stopPropagation from `handleDragEnter` only — `handleDrop` still needs
 * it, to keep a page-level listener from double-handling a drop that
 * lands directly on this card.
 *
 * **Superseded 2026-08-06** — the icon cluster's own hover transform
 * described in the next several paragraphs (arrow lift, file-icon push/
 * rotate) has been removed. The user supplied real Figma prototype URLs
 * for this exact interaction (Default `1813:2509`, Hover `1834:1167`) —
 * Figma's live `get_motion_context` data (165 animated nodes, verified
 * programmatically, not sampled) shows the icon cluster itself is NOT
 * animated at all; instead a separate, previously-hidden "Pile of Papers"
 * illustration (16 document sheets + 96 "data extraction" strip/particle
 * elements across two waves + 5 "detach" pieces that tumble away) fades in
 * on top of it and plays a 4-second looping sequence. See `PileOfPapers.tsx`
 * and `pile-of-papers-data.ts` for the full implementation and sourcing
 * record. The static icon-asset history below (why the arrow/tray are
 * separate committed SVGs, their exact coordinates) is still accurate and
 * still applies — only the icon cluster's *hover response* is gone; it
 * stays at its resting position/rotation now, matching Figma exactly.
 *
 * Added 2026-08-03, direct user request for a coordinated hover animation
 * on the header-graphic icon cluster when the dropzone below it is
 * hovered — zero Figma source for the animation itself (a new, code-side
 * interaction enhancement, same disclosed-addition convention as the
 * login hero's rotate/glimmer effect). Since the icon cluster and the
 * dropzone are siblings, not ancestor/descendant, Tailwind's `group`/
 * `peer` hover variants can't reach it (both rely on a CSS combinator
 * that only targets elements *after* the trigger in DOM order, and the
 * trigger here — the dropzone — comes after the cluster); driven instead
 * by `isDropzoneHovered` local state from the dropzone's own
 * `onMouseEnter`/`onMouseLeave`. Sequence: the upload arrow moves up 6px
 * immediately (`--duration-fast`, no delay); the two file images move up
 * 6px starting 50ms later, so they read as following the arrow rather
 * than moving in lockstep with it, each gaining a subtle 4deg rotation on
 * top of its existing static tilt — the right-side image file clockwise
 * (23deg to 27deg), the left-side PDF file anti-clockwise (-19deg to
 * -23deg), per direct user correction (the first pass had both rotating
 * clockwise). All three reverse the same way on mouse-leave.
 *
 * The arrow asset itself went through three iterations the same day,
 * chasing the request that only the arrow glyph move, not the tray/
 * bracket shape beneath it: (1) the original committed asset baked both
 * shapes into one `<img>`, opaque to the DOM — no way to transform one
 * part independently; (2) inlined as raw SVG with the one compound
 * `<path>` manually split at its `Z...M` boundary into two `<path>`s, a
 * reasonable-looking reverse-engineered guess that turned out visually
 * correct but clipped the arrow at the SVG's viewBox edge once it
 * translated upward (the original file's `overflow="visible"` attribute
 * was lost inlining it — first fixed by restoring that attribute); (3)
 * superseded once the user separated the arrow and tray as two distinct
 * layers directly in Figma and shared the updated node
 * (`GJBYRm6ySR7XIECFcHMgy2`, node `1565:3098` — its child frame `File
 * Upload Icon`, `1565:3100`, now has independent `Arrow` (`1650:1230`)
 * and `Vector`/tray (`1565:3106`) children) — re-synced from that
 * authoritative source instead of trusting the hand-split guess:
 * downloaded both as their own committed assets
 * (`data-onboarding-upload-arrow.svg`/`data-onboarding-upload-tray.svg`,
 * replacing the old single combined file), positioned at their real
 * Figma coordinates within the icon cluster (arrow 37.61,71.57,
 * 25.82×32.87; tray originally 21.18,111.74, 58.43×18.26). Back to plain
 * `<img>`s — no inline SVG, no `overflow="visible"` concern — since each
 * shape is now its own independently-transformable element by
 * construction.
 *
 * Corrected same-day, direct user report with a screenshot ("Move the
 * bottom vector graphic down by 1px to eliminate the visible gap between
 * the top colored header section and the bottom white section"): the
 * tray's Figma-sourced bottom edge (top 111.74 + height 18.26 = 130,
 * exactly the icon cluster's own height) landed at the header's exact
 * 150px bottom edge on paper, but rendered with a hairline gap showing
 * the gradient through underneath — likely subpixel rounding, not a
 * transcription error. Moved the tray's `top` down 1px (111.74 →
 * 112.74px); it now overlaps 1px into the white body section below the
 * header, invisibly, since the tray is itself white.
 *
 * Corrected same-day (direct user request, initially "move the upload
 * image 6px to the left and rotate it slightly counterclockwise, while
 * moving the PDF upload image 6px to the right and rotating it slightly
 * clockwise" — a first attempt applied this to the two file icons'
 * *resting* position, which the immediate follow-up ("Still not working
 * as expected. On hover: ...") clarified was wrong: the push and rotation
 * were meant as part of the *hover* animation, layered on top of the
 * existing 6px lift, not a change to rest at all). Rest position/rotation
 * are back to their original values (`image-file` left-47px/23deg,
 * `pdf-file` left-0/-19deg — no Figma/spec source either way, direct
 * instruction is the source here). On hover, each file icon now also
 * translates horizontally toward the other — `image-file` 6px further
 * right (`translate-x-1.5`), `pdf-file` 6px further left
 * (`-translate-x-1.5`) — combined with the existing 6px lift, and each
 * rotates 4deg back toward level (`image-file` 23deg → 19deg,
 * counterclockwise; `pdf-file` -19deg → -15deg, clockwise) rather than
 * tilting further as the very first hover pass did — the two cards
 * converge and overlap more, and straighten slightly, on hover.
 *
 * Flipped same-day, direct user follow-up ("Sorry slight change: ...
 * push -6px left-side... push -6px right-side..."): the horizontal push
 * direction from the previous pass was backwards — swapped so `image-file`
 * now pushes right (toward `pdf-file`) and `pdf-file` pushes left (toward
 * `image-file`) on hover, per above. Rotation direction/amount unchanged.
 *
 * Enhanced same-day, direct user report ("left and right rotation is not
 * visible please review and enhance it"): the 4deg rotation delta read as
 * imperceptible at `--duration-fast` (100ms), especially alongside the
 * simultaneous 6px translate. Increased to a 10deg delta (`image-file`
 * 23deg → 13deg, `pdf-file` -19deg → -9deg) and slowed/eased the whole
 * transform transition from `--duration-fast`/default ease to
 * `--duration-moderate` (200ms) with `--easing-enter`, so the rotation
 * has room to actually read during the hover response instead of
 * snapping through it.
 *
 * Corrected 2026-08-04, direct user report against a fresh `get_design_context`
 * pull on node `1511:2702` (fileKey `GJBYRm6ySR7XIECFcHMgy2`): two real,
 * verified token deviations. (1) The dropzone's `UploadIcon` was using
 * `--color-text-secondary` (`#626B6E`); Figma binds that glyph to the
 * `icon/secondary` variable, `--color-icon-secondary` (`#838F92`) — a
 * distinct token family this component was reaching past. (2) The header's
 * own top corners had no radius and relied entirely on the outer card's
 * `radius-xxxl` (18px) `overflow-hidden` clip; Figma explicitly rounds the
 * header itself at `radius/2xl` (16px, node `1511:2703`), a real if subtle
 * 2px difference at the top corners. Both fixed to the Figma-sourced tokens.
 *
 * Corrected same-day, direct user report with a screenshot surviving a hard
 * refresh (ruling out a first, incorrect "stale Storybook iframe" diagnosis):
 * the root container was `size-full` (forcing `height: 100%`) combined with
 * `justify-center`. Figma's frame hugs its content (auto height) — this had
 * no visible effect when a consumer's wrapper was itself auto-height (e.g.
 * `DataExtractionOnboardingPage`'s `w-full max-w-[500px]` div, where
 * percentage height on an auto-height parent computes as auto per spec, so
 * `justify-center` had no extra space to distribute), but the Storybook
 * Playground wrapper (`h-[560px]`) gives this component a real, definite
 * height taller than its content, so `justify-center` split the leftover
 * space into equal gaps above the header and below the dropzone. Changed to
 * `w-full` (dropping the forced height) with no `justify-*` — the card now
 * always hugs its content height regardless of the parent's height, matching
 * Figma, instead of stretching-then-centering whenever it's given more room
 * than it needs.
 *
 * Added 2026-08-04, direct user request for a subtle on-load animation —
 * zero Figma source for this (this file has none anywhere), same
 * disclosed-addition convention as this component's hover animations above.
 * Reuses `DataExtractionOnboardingPage`'s `StepTransition` mount pattern
 * verbatim for consistency across the flow: a `requestAnimationFrame`-gated
 * `entered` boolean fades/rises the whole card in on mount (12px,
 * `--duration-slow`/300ms, `--easing-enter`), `motion-reduce:transition-none`
 * per this repo's existing convention.
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
  const [isDropzoneHovered, setIsDropzoneHovered] = useState(false);
  const [isHoverAssetMounted, setIsHoverAssetMounted] = useState(false);
  const [isHoverAssetReady, setIsHoverAssetReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const dragCounter = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const hoverExitTimerRef = useRef<ReturnType<typeof setTimeout>>();
  // Skips mounting the 165-node Pile of Papers animation tree entirely for
  // reduced-motion users, rather than hiding it visually with CSS while its
  // JS-driven (motion.dev) animations keep running underneath — matching
  // this repo's "disable motion entirely" convention, applied at the mount
  // level since motion-reduce:* Tailwind classes can't stop WAAPI animation
  // execution the way they stop CSS transitions.

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => {
      cancelAnimationFrame(raf);
      if (hoverExitTimerRef.current !== undefined) clearTimeout(hoverExitTimerRef.current);
    };
  }, []);

  function handleDropzoneMouseEnter() {
    if (disabled) return;
    if (hoverExitTimerRef.current !== undefined) clearTimeout(hoverExitTimerRef.current);
    setIsHoverAssetMounted(true);
    setIsDropzoneHovered(true);
  }

  function handleDropzoneMouseLeave() {
    setIsDropzoneHovered(false);
    hoverExitTimerRef.current = setTimeout(() => {
      setIsHoverAssetMounted(false);
      setIsHoverAssetReady(false);
    }, 300);
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    onFilesSelected?.(Array.from(fileList));
  }

  function handleDragEnter(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    // Deliberately does NOT stopPropagation (unlike handleDrop below) — it
    // must bubble up to a page-level "drop anywhere" listener (e.g.
    // DataExtractionOnboardingPage's full-viewport mask), the same as
    // handleDragLeave already does. Stopping it here was a real bug: it
    // broke the page-level enter/leave counter's symmetry, so the moment
    // the cursor entered this card, the ancestor's counter saw a leave
    // (from the previously-hovered background) but never the matching
    // enter, hiding a full-page drag overlay the instant it should have
    // stayed visible.
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
        "flex w-full flex-col items-center gap-[var(--spacing-32)] overflow-hidden rounded-[var(--radius-xxxl)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] pb-[var(--spacing-32)] transition-all duration-[var(--duration-slow)] ease-[var(--easing-enter)] motion-reduce:transition-none",
        entered ? "translate-y-0 opacity-100" : "translate-y-[var(--spacing-12)] opacity-0",
        className
      )}
    >
      <div
        className="relative h-[150px] w-full shrink-0 rounded-t-[var(--radius-2xl)]"
        style={{ background: "var(--gradient-upload-header)" }}
        aria-hidden="true"
      >
        <img
          src={defaultHeaderAsset}
          alt=""
          data-testid="header-default-asset"
          className={cn(
            "absolute inset-0 size-full transition-opacity duration-[var(--duration-slow)] ease-[var(--easing-enter)] motion-reduce:transition-none",
            isDropzoneHovered && isHoverAssetReady
              ? "opacity-0 motion-reduce:opacity-100"
              : "opacity-100"
          )}
        />
        {isHoverAssetMounted && (
          <img
            src={hoverHeaderAsset}
            alt=""
            data-testid="header-hover-asset"
            onLoad={() => setIsHoverAssetReady(true)}
            className={cn(
              "absolute inset-0 size-full transition-opacity duration-[var(--duration-slow)] ease-[var(--easing-enter)] motion-reduce:hidden",
              isDropzoneHovered && isHoverAssetReady ? "opacity-100" : "opacity-0"
            )}
          />
        )}
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
        onMouseEnter={handleDropzoneMouseEnter}
        onMouseLeave={handleDropzoneMouseLeave}
        className={cn(
          "group flex w-[436px] max-w-full cursor-pointer flex-col items-center gap-[var(--spacing-8)] rounded-[var(--radius-button)] border border-dashed px-[var(--spacing-16)] py-[var(--spacing-24)] transition-colors duration-[var(--duration-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] motion-reduce:transition-none",
          isDragging
            ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500-a8)]"
            : disabled
              ? "border-[var(--color-primary-200)]"
              : "border-[var(--color-primary-200)] hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-500-a8)]",
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
        <UploadIcon
          className="size-8 text-[var(--color-icon-secondary)] transition-transform duration-[var(--duration-fast)] group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
          aria-hidden="true"
        />
        <div className="flex items-center gap-[var(--spacing-4)] text-body-md font-medium">
          <span className="text-[var(--color-text-link)]">Click to upload</span>
          <span className="text-[var(--color-text-title)]">or drag and drop</span>
        </div>
        <p className="m-0 text-body-sm text-[var(--color-text-secondary)]">{helperText}</p>
      </div>
    </div>
  );
}
