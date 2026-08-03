---
"@lumen/tokens": minor
"@lumen/ui": minor
"@lumen/patterns": minor
---

Redesign `DataExtractionOnboardingPage`'s interaction and motion design to match a reorganized
Figma section 100% (fileKey `GJBYRm6ySR7XIECFcHMgy2`, node `1565:3096` and its 5 child state
frames), at direct, highly-detailed user instruction. Visual design (color/type/spacing/copy) is
unchanged except where it was already wrong against Figma; only interaction/motion and structure
were redesigned.

**Breaking `@lumen/ui` changes**: `FileUploadProgressList`'s `groups: FileUploadGroupData[]` prop
is now `files: FileUploadFile[]` — the grouped/accordion-by-category layout (Documents/Images/
Other) never matched Figma, which shows one flat, ungrouped list in every state; `FileUploadGroupData`
is removed entirely. `onRemoveFile` is now `(fileId: string) => void`, not `(groupId, fileId)`.

**Breaking `@lumen/patterns` change**: `DataExtractionOnboardingPageProps.categorizeFile` is
removed — there's nothing left to categorize into.

New in `FileUploadProgressList`: computed per-state heading/subheading (uploading / all-uploaded
with a live file count / creating-project), a success checkmark, Figma-accurate disabled-row
dimming while a project is being created (also disabling each row's remove control, a new
"disable siblings during a primary async action" pattern for this codebase), row mount stagger-in,
a completion highlight on each file finishing upload, primary-action button press/activation
feedback and a real icon crossfade (plus/spinner) instead of an instant swap, and — flagged as
having no Figma source, built from the user's spec only — 8 error/recovery states (unsupported
type, size limit, duplicate, corrupted, password-protected, network, cancelled, validation) with
retry, plus a partial-success banner and project-creation-failure recovery with an inline
`role="alert"` and "Try again".

`Toast` gained real mount/unmount animation (previously an instant array push/filter) and an
optional `position` prop (`"bottom-right"` default, `"bottom-center"` — this flow's Figma
position).

Bug fix: removing an uploaded file in `DataExtractionOnboardingPage` now asks for confirmation
first (via `@lumen/ui`'s existing `Modal` + `Button`), and confirming removal of the last
remaining file returns the flow to the upload step instead of leaving an empty progress card
stranded with no way forward.

Bug fix: `FileUploadDropzone`'s full-page "drop anywhere" drag mask now stays visible for the
whole drag, including while the cursor is directly over the dropzone card — a `stopPropagation()`
asymmetry between its drag-enter and drag-leave handlers previously broke the page-level
enter/leave counter the instant the cursor entered the card, hiding the mask right when it should
have stayed up.

Two direct user-reported visual tweaks: the progress/uploaded card is now vertically centered on
the page (was top-aligned, unlike the upload step's own card) and the file-row filename text is
13px (was 11px, the shared `app-caption` tier's size — bumped locally, not by changing the token).

The "Remove file?" confirmation now runs on `@lumen/ui`'s Radix-backed `Dialog` instead of the
lightweight `Modal` (Modal's own docblock flags exactly this swap for when strict focus-trapping
is needed), at direct user request that background content be unscrollable and non-interactive
while the dialog is open — Radix's default `modal` behavior provides real scroll-lock and focus
trapping for free. `Dialog`'s overlay (`DialogOverlay`, `@lumen/ui`'s existing overlay component)
is now `bg-black/40 backdrop-blur-sm` (was `bg-black/80`, no blur) — also picked up by
`CommandDialog`, `Dialog`'s only other consumer.

Bug fix: clicking "Create Project" now reliably shows the "Creating your project" screen. An
`onProjectCreated` that resolves near-instantly (or is omitted, e.g. while wiring this pattern up
before a real backend exists) previously let the loading phase settle within the same microtask
flush as the click, before the browser ever painted it — visibly nothing happened. A 600ms minimum
duration (via `Promise.all`) now guarantees the loading screen is actually visible, without adding
delay beyond the real `onProjectCreated` duration when it's slower than that floor. The flow also
now stays on "Creating your project" after `onProjectCreated` resolves, rather than reverting to
the pre-click state — this pattern has no next screen to move to (`onProjectCreated` is the
integration point; the parent app navigates away), so reverting read as the click having silently
failed.

Pixel-fidelity fixes to `FileUploadProgressList`, verified via `get_variable_defs` against Figma
(not inferred from a screenshot): the footer buttons ("Cancel"/"Create Project") now match Figma's
real 34px height, 14px horizontal padding, and 14px/22px/weight-500 label (`size="sm"` previously
gave 32px/12px/11px, none Figma-evidenced); file-row filenames are 14px active / 12px while dimmed
during project creation (both weight 500 — new `body-sm-medium`/`body-xs-medium` `@lumen/tokens`
typography tiers, replacing an earlier flat 13px guess); file-row status text ("100kb · Uploaded")
is 12px/20px (the existing `body-xs` tier, was the unrelated 11px `app-caption` tier); and a
previously-missing 1px separator now sits between the file list and the footer actions, with the
surrounding gaps corrected to Figma's 32px/16px.

Added a coordinated hover animation to `FileUploadDropzone`'s header-graphic icon cluster, at
direct user request (no Figma source for the animation itself): hovering the "Click to upload"
zone lifts the upload arrow 6px immediately, then 50ms later the two file icons lift 6px and gain
a subtle rotation (right-side image file clockwise, left-side PDF file anti-clockwise), all
reversing on mouse-leave. The upload arrow's tray/bracket shape stays fixed — the user separated
it from the arrow glyph as two distinct Figma layers mid-session (fileKey
`GJBYRm6ySR7XIECFcHMgy2`, node `1565:3098`'s `Arrow`/`Vector` children), re-synced as two new
committed SVG assets (replacing the old single combined one) so each half is independently
transformable. Nudged the tray 1px down afterward to close a hairline rendering gap against the
header's gradient background.

The two file icons' hover animation now also pulls them toward each other horizontally and eases
their rotation back toward level, rather than tilting them further: the image icon (right) pushes
6px further right and rotates 10deg counterclockwise on hover, the PDF icon (left) pushes 6px
further left and rotates 10deg clockwise — layered on top of the existing 6px lift, over a slower,
eased `--duration-moderate` transition so the rotation actually reads, so the two cards converge
and overlap more on hover. Rest position/rotation are unchanged from the original Figma-sourced
values (an earlier attempt applied the push to the rest state instead of hover, in the opposite
horizontal direction, and at a rotation delta too small to notice; all corrected per direct user
follow-up).

`Toast`'s `solid` variant (the "Files uploaded!" celebration toast) now matches its Figma source
(node `1519:6185`) pixel-for-pixel instead of reusing the `card` variant's box model re-colored:
`px-24 py-12` (was `px-32 py-24`), a single flex row with `gap-32` between the icon+title group
and the inline close button (was an absolutely-positioned close button with compensating right
padding), `gap-8` between icon and title (was `gap-16`), a 24px icon (was the shared 28px
`--toast-icon-size` token — scoped locally, `card` still uses the shared token correctly), and
14px/26px/weight-600 title text (was 16px/26px/weight-700). Its accent color now resolves through
the real semantic token Figma names (`--color-background-toaster-systeminfo-bg`) instead of the
primitive it happened to alias, making it theme-reactive. `card` variant is untouched — it has its
own, already-correct Figma source.

Follow-up: `solid`'s width now hugs its content (`w-fit`, capped at the existing `--toast-width`
as a ceiling) instead of stretching to that same 450px as a fixed size — Figma's own node is
`w-full` inside a "hug contents" frame, not a fixed pixel width; that fixed width genuinely
belongs to `card`'s own, differently-sized Figma frame.

See `docs/changelog.md` for the full node references, every flagged judgment call (checkmark-draw
simplified to a scale pop-in, no 150ms duration token so `--duration-fast` is reused, etc.), and
validation results.
