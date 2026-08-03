# Lumen Quality Checklist

> Release-readiness and quality-assurance checklist for the **Lumen AI Design System**, covering Figma foundations, design tokens, components, accessibility, Storybook, code quality, testing, documentation, and publishing.

## Source

- **Figma file:** Lumen AI Design System
- **File key:** `GJBYRm6ySR7XIECFcHMgy2`
- **Design Tokens node:** `426:4395`
- **Dev Mode URL:** https://www.figma.com/design/GJBYRm6ySR7XIECFcHMgy2/Lumen-AI-Design-System?node-id=426-4395&m=dev
- **Local Storybook:** http://localhost:6006/?path=/docs/introduction--docs
- **Last reviewed:** 2026-07-15

## Related documents

```text
AGENTS.md
docs/figma-source.md
docs/design-tokens.md
docs/component-architecture.md
docs/component-specifications.md
docs/accessibility.md
docs/storybook-guidelines.md
docs/development-guidelines.md
docs/quality-checklist.md
docs/changelog.md
```

---

# 1. Purpose

Use this checklist before:

- approving a Figma foundation or component
- merging a pull request
- publishing Storybook
- releasing token or component packages
- marking a component Stable
- synchronizing Figma and code
- completing a Claude Code update

This checklist is a release gate, not a documentation exercise.

Critical or high-severity failures must block release.

---

# 2. Quality status

Use one of these statuses:

```text
Not Reviewed
In Review
Blocked
Approved with Conditions
Approved
Released
```

## Severity

| Severity | Meaning | Release impact |
|---|---|---|
| Critical | Core task, safety, accessibility, or architecture failure | Blocks release |
| High | Major defect with no reasonable workaround | Blocks release |
| Medium | Material issue with an available workaround | Requires owner and target date |
| Low | Minor inconsistency or documentation issue | May be deferred |
| Observation | Improvement opportunity | Does not block release |

---

# 3. Review record

Complete this section for each review.

```markdown
## Review record

- Change or release:
- Version:
- Reviewer:
- Date:
- Figma node:
- Pull request:
- Storybook URL:
- Affected tokens:
- Affected components:
- Status:
- Blocking issues:
- Follow-up owner:
- Follow-up date:
```

---

# 4. Scope control

- [ ] The requested change is documented under `[Unreleased]` in `changelog.md`.
- [ ] The exact Figma node or variable source is identified.
- [ ] Affected tokens are listed.
- [ ] Affected components are listed.
- [ ] Affected Storybook stories are listed.
- [ ] Affected tests are listed.
- [ ] Affected package exports are listed.
- [ ] No unrelated refactor is included.
- [ ] No unrelated dependency upgrade is included.
- [ ] No complete design-system regeneration was performed.
- [ ] Existing public APIs are preserved unless a breaking change is approved.
- [ ] Missing Figma information is reported rather than inferred.

---

# 5. Figma source quality

## File and source

- [ ] The correct Lumen Figma file is used.
- [ ] The exact node ID is recorded.
- [ ] The reviewed asset is Approved or Published.
- [ ] Draft or archived assets are not treated as production sources.
- [ ] The Dev Mode link opens the intended frame or component.
- [ ] The Figma source is not a detached or outdated duplicate.
- [ ] Component descriptions are current.
- [ ] Deprecation status is visible.

## Structure

- [ ] Pages and sections follow the agreed information architecture.
- [ ] Foundations, components, patterns, and templates are separated.
- [ ] Frames and layers use semantic names.
- [ ] No unexplained `Frame 123`, `Rectangle 4`, or `Group 8` names remain in production assets.
- [ ] Auto Layout is used where appropriate.
- [ ] Hug, Fill, and Fixed behavior is intentional.
- [ ] Minimum and maximum dimensions are defined where needed.
- [ ] Long text and localization expansion are tested.
- [ ] Responsive resizing behavior is verified.
- [ ] Hidden layers are intentional and documented.
- [ ] No orphaned or duplicate component sets remain.

---

# 6. Design-token architecture

## Layering

- [ ] Primitive tokens contain raw values only.
- [ ] Semantic tokens communicate purpose.
- [ ] Component tokens are scoped to a component contract.
- [ ] Semantic tokens alias primitives.
- [ ] Component tokens alias semantic or primitive tokens appropriately.
- [ ] Components do not consume primitive colors directly without an approved exception.
- [ ] Token descriptions explain intent and usage.
- [ ] Token scopes are correct in Figma.
- [ ] Token collections are logically separated.
- [ ] Modes are named consistently.

## Naming

- [ ] Figma tokens use slash-separated names.
- [ ] CSS custom properties use kebab-case, unprefixed (e.g. `--spacing-16`,
      `--color-button-primary-bg`) — matches this repo's actual generated
      output; a `--lumen-` prefix was listed here as a requirement in an
      earlier draft of this checklist but was never how tokens are actually
      named (see `docs/design-tokens.md` §9). Do not fail a review over a
      missing `--lumen-` prefix.
- [ ] Token names describe semantics, not visual appearance.
- [ ] Hex values do not appear in names.
- [ ] Temporary names such as `New Color` are removed.
- [ ] State names are consistent.
- [ ] Visual-role names are consistent.
- [ ] No duplicate tokens exist without distinct semantic intent.
- [ ] Deprecated tokens are clearly marked.

## Values and aliases

- [ ] Values match the approved Figma source or export.
- [ ] Aliases resolve without cycles.
- [ ] No unresolved aliases remain.
- [ ] Numeric values are not unintentionally rounded.
- [ ] Units are consistent.
- [ ] Light and Dark mode mappings are complete.
- [ ] Mode values are not mechanically inverted.
- [ ] Generated output preserves approved aliases where supported.
- [ ] Generated files were not manually edited.

---

# 7. Color quality

- [ ] Primitive color ramps are complete and consistently named.
- [ ] Semantic background roles are complete.
- [ ] Semantic text roles are complete.
- [ ] Semantic icon roles are complete.
- [ ] Semantic border roles are complete.
- [ ] Interactive state roles are complete.
- [ ] Status colors include Info, Success, Warning, and Danger.
- [ ] Focus-ring color is defined.
- [ ] Disabled colors remain understandable.
- [ ] Light mode contrast passes.
- [ ] Dark mode contrast passes.
- [ ] Hover contrast passes.
- [ ] Pressed contrast passes.
- [ ] Selected contrast passes.
- [ ] Focus contrast passes.
- [ ] Status is not communicated through color alone.
- [ ] Data-visualization colors are distinguishable.
- [ ] Color-vision deficiency checks are complete.
- [ ] No hardcoded hex, RGB, HSL, or named colors appear in token-backed components.

## Contrast targets

- [ ] Normal text meets at least 4.5:1.
- [ ] Large text meets at least 3:1.
- [ ] Essential boundaries and graphical objects meet at least 3:1.
- [ ] Focus indicators meet at least 3:1 against adjacent colors.
- [ ] Contrast was checked using actual semantic pairings, not isolated palette swatches.

---

# 8. Typography quality

- [ ] Font families match approved Figma styles.
- [ ] Required font files and weights are available in production.
- [ ] Heading hierarchy is complete.
- [ ] Body hierarchy is complete.
- [ ] Label hierarchy is complete.
- [ ] Utility and caption styles are complete.
- [ ] Code styles use an approved monospaced font.
- [ ] Font size and line height match Figma.
- [ ] Font weight matches Figma.
- [ ] Letter spacing matches Figma.
- [ ] Text case is intentional.
- [ ] Text decoration is intentional.
- [ ] Typography styles do not encode color.
- [ ] Body text remains readable at 200% text zoom.
- [ ] Text does not clip.
- [ ] Long labels wrap or resize correctly.
- [ ] Small typography is not used for long-form content.
- [ ] Heading order remains semantically valid in code.

---

# 9. Spacing, scale, and radius quality

## Spacing

- [ ] Only approved spacing tokens are used.
- [ ] Arbitrary spacing values are removed.
- [ ] Component padding is consistent.
- [ ] Gaps are consistent.
- [ ] Adjacent target spacing is adequate.
- [ ] Compact density remains usable.
- [ ] Comfortable density remains visually balanced.
- [ ] Layout rhythm is consistent across Storybook.
- [ ] Large page-level spacing is not used inside compact components.

## Scale

- [ ] Scale tokens have verified values.
- [ ] Scale tokens have documented usage.
- [ ] Semantic control sizes are used instead of generic scale values where appropriate.
- [ ] Icon sizes align with control sizes.
- [ ] Control heights are consistent.
- [ ] Scale choices work across desktop, tablet, and mobile layouts.

## Radius

- [ ] Only approved radius tokens are used.
- [ ] Radius hierarchy is consistent.
- [ ] Focus rings are not clipped.
- [ ] Content padding remains sufficient.
- [ ] Pill shapes are used intentionally.
- [ ] Interactive and non-interactive surfaces remain distinguishable.
- [ ] No arbitrary radius values appear in production components.

---

# 10. Enterprise token completeness

Verify that the following categories exist or are explicitly tracked as pending:

- [ ] Border widths
- [ ] Elevation
- [ ] Opacity
- [ ] Motion duration
- [ ] Motion easing
- [ ] Z-index
- [ ] Breakpoints
- [ ] Grid
- [ ] Container widths
- [ ] Control heights
- [ ] Icon sizes
- [ ] Focus-ring width
- [ ] Focus-ring offset
- [ ] Focus-ring radius
- [ ] Data-visualization colors
- [ ] Density
- [ ] High-contrast mode, when required

---

# 11. Component Figma quality

- [ ] Component purpose is documented.
- [ ] When-to-use guidance is documented.
- [ ] When-not-to-use guidance is documented.
- [ ] Anatomy is named.
- [ ] Variants are semantic.
- [ ] Sizes are consistent.
- [ ] States are complete.
- [ ] Unsupported combinations are not published.
- [ ] Component properties use appropriate types.
- [ ] Text properties are editable.
- [ ] Boolean visibility properties are used appropriately.
- [ ] Instance-swap properties are used for icons.
- [ ] Nested instances are intentional.
- [ ] Auto Layout supports content growth.
- [ ] Long text is demonstrated.
- [ ] Localization expansion is demonstrated.
- [ ] Responsive behavior is documented.
- [ ] Token bindings are complete.
- [ ] Accessibility annotations are present.
- [ ] Component maturity status is visible.
- [ ] Code mapping status is recorded.

---

# 12. Component code quality

## API

- [ ] Public props are fully typed.
- [ ] Native HTML attributes are supported where appropriate.
- [ ] Ref forwarding is implemented where needed.
- [ ] Display names are set for wrapped components.
- [ ] Variant values match approved semantic names.
- [ ] Size values match the shared size vocabulary.
- [ ] Controlled and uncontrolled behavior is clear.
- [ ] Defaults are documented and predictable.
- [ ] Public APIs remain minimal.
- [ ] Internal implementation props are not exposed.
- [ ] Arbitrary visual overrides are not exposed.
- [ ] Deprecated props include migration guidance.
- [ ] Package exports are intentional.

## Implementation

- [ ] Semantic HTML is used.
- [ ] Existing Lumen primitives are reused.
- [ ] Composition is preferred over duplication.
- [ ] Business logic is not embedded in foundational components.
- [ ] Token-backed styles are used.
- [ ] No inline hardcoded design values remain.
- [ ] No unnecessary dependency was introduced.
- [ ] Tree-shaking is preserved.
- [ ] Server and client boundaries are intentional where applicable.
- [ ] Error handling is predictable.
- [ ] Loading behavior prevents duplicate actions where appropriate.
- [ ] Component dimensions remain stable during loading.
- [ ] Dark mode is supported.
- [ ] RTL behavior is considered where applicable.

---

# 13. Accessibility quality

Lumen targets WCAG 2.2 AA.

## Semantics

- [ ] Native elements are used where possible.
- [ ] Role is correct.
- [ ] Accessible name is present.
- [ ] Visible labels and accessible names align.
- [ ] Descriptions are associated.
- [ ] ARIA is necessary and correctly applied.
- [ ] Interactive controls are not nested.
- [ ] Hidden content is not focusable.

## Keyboard

- [ ] All functionality is keyboard operable.
- [ ] Tab order is logical.
- [ ] Shift+Tab works.
- [ ] Enter behavior is correct.
- [ ] Space behavior is correct.
- [ ] Escape behavior is correct.
- [ ] Arrow-key behavior is correct for composite widgets.
- [ ] Home and End behavior is implemented where expected.
- [ ] No keyboard trap exists.
- [ ] Focus is restored after overlays close.
- [ ] Focus is preserved after dynamic updates.

## Focus

- [ ] Focus-visible styling is present.
- [ ] Focus indicator is not clipped.
- [ ] Focus indicator has sufficient contrast.
- [ ] Focus state is distinguishable from selection and error.
- [ ] Modal focus containment works.
- [ ] Focus returns to the correct trigger.

## Forms and status

- [ ] Labels are programmatically associated.
- [ ] Required status is communicated.
- [ ] Invalid state uses `aria-invalid`.
- [ ] Error messages use `aria-describedby`.
- [ ] Submission errors preserve user data.
- [ ] Status messages are announced appropriately.
- [ ] Live regions are not excessively verbose.
- [ ] Loading start and completion are announced where meaningful.

## Zoom, reflow, and targets

- [ ] Text works at 200% zoom.
- [ ] Layout works at 400% browser zoom where applicable.
- [ ] Layout reflows at 320 CSS px.
- [ ] Essential content is not clipped.
- [ ] Target size is at least 24 × 24 CSS px.
- [ ] Preferred touch target is 44 × 44 CSS px where practical.
- [ ] Drag-and-drop has a keyboard alternative.
- [ ] Hover-only content has a focus equivalent.

## Motion

- [ ] `prefers-reduced-motion` is respected.
- [ ] Motion is not the only status cue.
- [ ] No rapid flashing exists.
- [ ] Continuous animation can be reduced or stopped.
- [ ] AI streaming and loading states have reduced-motion behavior.

---

# 14. AI component quality

- [ ] AI-assisted behavior is disclosed.
- [ ] Generated content is identifiable.
- [ ] User-authored content is preserved.
- [ ] Generation status is visible and announced.
- [ ] Cancel is available for lengthy operations.
- [ ] Edit is available where appropriate.
- [ ] Accept and Reject are available where appropriate.
- [ ] Regenerate is available where appropriate.
- [ ] Undo is available where appropriate.
- [ ] Sources or citations are shown when available.
- [ ] Confidence is meaningful and calibrated.
- [ ] Confidence does not rely on color alone.
- [ ] Low-confidence guidance is provided.
- [ ] Error and partial-result states exist.
- [ ] Privacy and sensitive-data behavior are documented.
- [ ] High-impact outcomes require human review.
- [ ] AI status announcements are concise.
- [ ] Streaming output remains accessible.

---

# 15. Storybook quality

## Content

- [ ] Introduction page is current.
- [ ] Foundation pages are complete.
- [ ] Token pages are complete.
- [ ] Component overview is complete.
- [ ] Anatomy is documented.
- [ ] Variants are documented.
- [ ] Sizes are documented.
- [ ] States are documented.
- [ ] Accessibility is documented.
- [ ] Token dependencies are documented.
- [ ] Usage guidance is documented.
- [ ] Do and Don't examples are included where useful.
- [ ] Code examples use public APIs.
- [ ] Known limitations are listed.
- [ ] Figma links are current.
- [ ] Change history is current.

## Stories

- [ ] Default story exists.
- [ ] All stable variants are covered.
- [ ] All stable sizes are covered.
- [ ] All applicable states are covered.
- [ ] Loading is covered.
- [ ] Disabled is covered.
- [ ] Long content is covered.
- [ ] Localization is covered.
- [ ] Dark mode is covered.
- [ ] Keyboard focus is covered.
- [ ] Accessibility is covered.
- [ ] Edge cases are covered.
- [ ] Stories are deterministic.
- [ ] Stories do not depend on external networks.
- [ ] Controls expose only supported props.
- [ ] Stable stories are included in visual regression.

## Customized Storybook UI

- [ ] Lumen branding remains intact.
- [ ] Custom theme remains intact.
- [ ] Dark background usage remains consistent.
- [ ] Navigation structure remains intact.
- [ ] Typography hierarchy remains intact.
- [ ] Docs layouts remain intact.
- [ ] Custom manager configuration remains intact.
- [ ] No default Storybook styling unintentionally replaces Lumen styling.
- [ ] The customized shell remains compatible with the current Storybook version.
- [ ] The local introduction URL loads correctly:
  `http://localhost:6006/?path=/docs/introduction--docs`

---

# 16. Testing quality

## Unit

- [ ] Rendering tests pass.
- [ ] Prop behavior is tested.
- [ ] Events are tested.
- [ ] State transitions are tested.
- [ ] Controlled behavior is tested.
- [ ] Uncontrolled behavior is tested.
- [ ] Disabled behavior is tested.
- [ ] Loading behavior is tested.

## Accessibility

- [ ] Automated accessibility tests pass.
- [ ] Accessible names are tested.
- [ ] Keyboard behavior is tested.
- [ ] Focus behavior is tested.
- [ ] ARIA state changes are tested.
- [ ] Critical flows receive manual screen-reader review.

## Visual regression

- [ ] Approved baseline exists.
- [ ] Changed snapshots are reviewed.
- [ ] Light mode is covered.
- [ ] Dark mode is covered.
- [ ] Responsive states are covered.
- [ ] Density states are covered.
- [ ] Customized Storybook visuals are covered where appropriate.
- [ ] Snapshot changes correspond only to approved changes.

## Integration

- [ ] Dialog focus management is tested.
- [ ] Menu keyboard behavior is tested.
- [ ] Form validation is tested.
- [ ] Combobox behavior is tested.
- [ ] Data-grid interaction is tested.
- [ ] Upload behavior is tested.
- [ ] AI streaming and cancellation are tested where applicable.

---

# 17. Codebase quality

- [ ] Lint passes.
- [ ] Type checking passes.
- [ ] Unit tests pass.
- [ ] Accessibility tests pass.
- [ ] Production build passes.
- [ ] Storybook build passes.
- [ ] No new console errors exist.
- [ ] No new browser warnings exist.
- [ ] No circular dependencies were introduced.
- [ ] No duplicate package dependency was introduced.
- [ ] No mixed lockfiles exist.
- [ ] `pnpm` remains the configured package manager.
- [ ] Public package exports resolve correctly.
- [ ] Generated token files are current.
- [ ] Bundle impact is reviewed.
- [ ] Tree-shaking is preserved.
- [ ] No sensitive data is committed.

---

# 18. Documentation quality

- [ ] `figma-source.md` is current.
- [ ] `design-tokens.md` is current.
- [ ] `component-architecture.md` is current.
- [ ] `component-specifications.md` is current.
- [ ] `accessibility.md` is current.
- [ ] `storybook-guidelines.md` is current.
- [ ] `development-guidelines.md` is current.
- [ ] `quality-checklist.md` is current.
- [ ] `changelog.md` is current.
- [ ] Documentation uses consistent naming.
- [ ] Documentation does not contradict Figma or code.
- [ ] Examples are production-relevant.
- [ ] Broken links are removed.
- [ ] Deprecated guidance is clearly marked.
- [ ] Migration guidance exists for breaking changes.

---

# 19. Versioning and release quality

- [ ] Change type is identified as Patch, Minor, or Major.
- [ ] Package version is updated.
- [ ] Changelog release section is complete.
- [ ] Added items are documented.
- [ ] Changed items are documented.
- [ ] Deprecated items are documented.
- [ ] Removed items are documented.
- [ ] Fixed items are documented.
- [ ] Migration steps are documented.
- [ ] Release notes identify affected components.
- [ ] Breaking changes are approved.
- [ ] Deprecated APIs have a removal target.
- [ ] Generated artifacts are included.
- [ ] Published package contents are verified.
- [ ] Storybook deployment is verified.
- [ ] Rollback plan exists for high-risk releases.

---

# 20. Figma-to-code parity

- [ ] Figma variant names match code.
- [ ] Figma size names match code.
- [ ] Figma state names match code.
- [ ] Component anatomy matches.
- [ ] Typography matches.
- [ ] Spacing matches.
- [ ] Radius matches.
- [ ] Color roles match.
- [ ] Focus treatment matches.
- [ ] Loading treatment matches.
- [ ] Disabled treatment matches.
- [ ] Responsive behavior matches.
- [ ] Dark mode matches.
- [ ] Accessibility behavior is implemented even when not visually represented in Figma.
- [ ] Code Connect mapping is current where available.
- [ ] Known parity gaps are documented.
- [ ] No unapproved visual divergence remains.

---

# 21. Pull-request quality

- [ ] PR title is scoped.
- [ ] PR description explains the change.
- [ ] Figma URL is included.
- [ ] Changelog entry is included.
- [ ] Affected tokens are listed.
- [ ] Affected components are listed.
- [ ] Screenshots or Storybook references are included.
- [ ] Accessibility impact is described.
- [ ] Test results are included.
- [ ] Migration guidance is included where required.
- [ ] Known limitations are included.
- [ ] No unrelated files changed.
- [ ] Reviewer ownership is clear.
- [ ] Design review is complete.
- [ ] Engineering review is complete.
- [ ] Accessibility review is complete where required.

---

# 22. Claude Code quality protocol

Before reviewing or modifying Lumen, Claude Code must read:

```text
AGENTS.md
docs/figma-source.md
docs/design-tokens.md
docs/component-architecture.md
docs/component-specifications.md
docs/accessibility.md
docs/storybook-guidelines.md
docs/development-guidelines.md
docs/quality-checklist.md
docs/changelog.md
```

Then:

1. Read the current `[Unreleased]` scope.
2. Identify affected Figma nodes, tokens, components, stories, and tests.
3. Inspect the existing implementation before changing it.
4. Apply only the approved delta.
5. Run available checks.
6. Review the local Storybook.
7. Complete only applicable checklist sections.
8. Report failures by severity.
9. Do not mark checks as passed without evidence.
10. Never regenerate or refactor unrelated parts of the design system.

## Reusable Claude Code audit prompt

```markdown
Read:

- `docs/figma-source.md`
- `docs/design-tokens.md`
- `docs/component-architecture.md`
- `docs/component-specifications.md`
- `docs/accessibility.md`
- `docs/storybook-guidelines.md`
- `docs/development-guidelines.md`
- `docs/quality-checklist.md`
- `docs/changelog.md`

Audit only the changes listed under `[Unreleased]`.

Use the approved Figma node, token exports, current source, and local Storybook as evidence.

Do not modify files during the first audit pass.

Report:

1. passed checks
2. failed checks
3. severity of each failure
4. affected files and components
5. Figma-to-code differences
6. accessibility risks
7. missing tests
8. recommended minimal fixes

After the audit, apply only approved fixes.
Do not regenerate the design system.
Do not refactor unrelated files.
Do not mark a check as passed without evidence.

Run the available lint, type-check, test, build, Storybook-build, accessibility, and visual-regression commands.

Then provide a final release recommendation:

- Approved
- Approved with Conditions
- Blocked
```

---

# 23. Final release decision

Use this summary:

```markdown
## Final quality decision

- Status:
- Version:
- Approved by:
- Date:
- Critical issues:
- High issues:
- Medium issues:
- Low issues:
- Conditional approvals:
- Deferred items:
- Storybook verified:
- Figma parity verified:
- Accessibility verified:
- Build verified:
- Release recommendation:
```

A release can be marked **Approved** only when:

- all Critical and High issues are resolved
- required validation passes
- Figma-to-code parity is acceptable
- accessibility requirements pass
- Storybook is current
- documentation is current
- changelog and versioning are complete

---

# 24. Current verification note

The Figma connector was invoked for node `426:4395`, but the design-context request returned a selection-related error stating that no layer was selected.

The quality checklist is therefore grounded in:

- the known Lumen Design Tokens source structure
- the verified foundation categories
- previously retrieved Figma metadata
- the documented Lumen development and accessibility standards

The following must still be verified through direct Figma Variable exports or component-specific Dev Mode nodes:

- exact color values and aliases
- variable collections and modes
- font families and weights
- focus-token values
- component inventory
- component properties
- component-specific dimensions
- Code Connect mappings
- complete Light and Dark semantic mappings

Do not mark these checks as passed without direct evidence.