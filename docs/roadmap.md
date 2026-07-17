# Lumen AI Design System Roadmap

> Strategic delivery roadmap for the **Lumen AI Design System**, covering design tokens, components, accessibility, Storybook, code integration, governance, release maturity, and AI-first enterprise capabilities.

## Source

- **Figma file:** Lumen AI Design System
- **File key:** `GJBYRm6ySR7XIECFcHMgy2`
- **Design Tokens node:** `426:4395`
- **Dev Mode URL:** https://www.figma.com/design/GJBYRm6ySR7XIECFcHMgy2/Lumen-AI-Design-System?node-id=426-4395&m=dev
- **Local Storybook:** http://localhost:6006/?path=/docs/introduction--docs
- **Roadmap horizon:** 2026–2027
- **Last reviewed:** 2026-07-15

## Related documents

```text
CLAUDE.md
AGENTS.md
docs/figma-source.md
docs/design-tokens.md
docs/component-architecture.md
docs/component-specifications.md
docs/accessibility.md
docs/storybook-guidelines.md
docs/development-guidelines.md
docs/quality-checklist.md
docs/design-review.md
docs/release-process.md
docs/roadmap.md
docs/changelog.md
```

---

# 1. Vision

Lumen will become an enterprise-grade, AI-first design system that enables product teams and AI coding agents to build consistent, accessible, scalable SaaS applications from a shared Figma and code foundation.

The system should support:

- large-scale enterprise products
- AI-assisted workflows
- Light and Dark themes
- responsive web applications
- compact and comfortable density
- accessibility by default
- consistent Figma-to-code delivery
- reusable Storybook documentation
- incremental releases without full regeneration
- reliable use by Claude Code and development teams

---

# 2. Strategic outcomes

The roadmap targets six outcomes.

## 2.1 Single source of truth

Figma, token exports, code, Storybook, and documentation remain synchronized.

## 2.2 Enterprise scalability

The system supports complex workflows, large datasets, permissions, review states, and multi-step tasks.

## 2.3 Accessibility by default

Stable foundations and components meet WCAG 2.2 AA.

## 2.4 AI-first interaction patterns

Lumen provides trusted patterns for generation, review, evidence, confidence, correction, and human control.

## 2.5 Developer adoption

Teams can discover, install, understand, and implement Lumen components efficiently.

## 2.6 Controlled evolution

Changes are versioned, reviewed, tested, documented, and released incrementally.

---

# 3. Current baseline

The supplied Figma Design Tokens source currently documents:

```text
01 Colors
02 Typography
03 Scale
04 Spacing
05 Radius
```

Verified foundation values include:

- visible typography sizes and line heights
- spacing tokens from 0 to 128px
- radius tokens from 0px to pill
- documented color and scale sections

Current supporting documentation includes:

```text
figma-source.md
design-tokens.md
component-architecture.md
component-specifications.md
accessibility.md
storybook-guidelines.md
development-guidelines.md
quality-checklist.md
design-review.md
release-process.md
changelog.md
roadmap.md
```

The Storybook interface has been customized for improved UX, Lumen branding, and visual consistency.

---

# 4. Roadmap principles

## 4.1 Foundations before breadth

Complete tokens, themes, accessibility, and component architecture before expanding the component inventory aggressively.

## 4.2 Primitives before composites

Build stable primitive components before enterprise composites and page patterns.

## 4.3 Evidence before automation

Do not automate Figma-to-code synchronization until token exports, naming, aliases, and release checks are reliable.

## 4.4 Adoption before volume

Measure component usage and developer success rather than only counting components.

## 4.5 Incremental delivery

Each phase should deliver usable value without requiring the entire system to be complete.

## 4.6 No full-system regeneration

Small updates must affect only relevant tokens, components, stories, tests, and documentation.

---

# 5. Maturity model

Use the following maturity levels.

| Level | Name | Definition |
|---:|---|---|
| 0 | Unstructured | Values and components are inconsistent or undocumented |
| 1 | Documented | Foundations and standards are recorded |
| 2 | Tokenized | Shared values are represented as managed tokens |
| 3 | Componentized | Stable reusable components exist in Figma and code |
| 4 | Governed | Review, testing, release, and deprecation processes operate consistently |
| 5 | Automated | Token generation, validation, parity checks, and release workflows are automated |
| 6 | Optimized | Adoption, quality, performance, and AI-assisted delivery are measured and improved |

Current estimated state:

```text
Foundations: Level 1–2
Components: Level 1–2
Accessibility: Level 1
Storybook: Level 2–3
Governance: Level 1–2
Automation: Level 0–1
```

These estimates require repository and Figma library verification.

---

# 6. Phase 0: Baseline and governance

## Objective

Establish the authoritative documentation, scope controls, ownership model, and review process.

## Status

```text
In Progress
```

## Deliverables

- [x] Define Figma source document.
- [x] Define design-token architecture.
- [x] Define component architecture.
- [x] Define component specification framework.
- [x] Define accessibility standards.
- [x] Define Storybook guidelines.
- [x] Define development standards.
- [x] Define quality checklist.
- [x] Define design-review process.
- [x] Define release process.
- [x] Define changelog structure.
- [x] Define roadmap.
- [ ] Confirm canonical Claude Code instruction file.
- [ ] Align `CLAUDE.md` and `AGENTS.md` responsibilities.
- [ ] Assign design-system owners.
- [ ] Define contribution and approval responsibilities.
- [ ] Establish release calendar.
- [ ] Confirm package names and repository structure.

## Exit criteria

- all governance documents are committed
- ownership is assigned
- release and review responsibilities are clear
- Claude Code reads the correct instruction hierarchy
- documentation does not contradict repository behavior

---

# 7. Phase 1: Foundation completion

## Objective

Complete and validate the full Lumen token foundation.

## Priority

```text
Critical
```

## Deliverables

### Color

- [ ] Export all primitive color variables.
- [ ] Confirm palette naming.
- [ ] Define semantic background tokens.
- [ ] Define semantic text tokens.
- [ ] Define semantic icon tokens.
- [ ] Define semantic border tokens.
- [ ] Define action-state tokens.
- [ ] Define status tokens.
- [ ] Define focus tokens.
- [ ] Define data-visualization palettes.
- [ ] Validate Light mode.
- [ ] Validate Dark mode.
- [ ] Validate contrast pairings.

### Typography

- [ ] Confirm primary font family.
- [ ] Confirm monospaced font family.
- [ ] Confirm weights.
- [ ] Confirm letter spacing.
- [ ] Publish text styles.
- [ ] Map typography to code.
- [ ] Validate localization and zoom.

### Scale and layout

- [ ] Confirm all general scale values.
- [ ] Define control-height tokens.
- [ ] Define icon-size tokens.
- [ ] Define breakpoint tokens.
- [ ] Define grid tokens.
- [ ] Define container-width tokens.
- [ ] Define density tokens.

### Additional foundations

- [ ] Border-width tokens
- [ ] Elevation tokens
- [ ] Opacity tokens
- [ ] Motion duration tokens
- [ ] Motion easing tokens
- [ ] Z-index tokens
- [ ] Focus-ring width and offset
- [ ] High-contrast tokens, when required

## Exit criteria

- all token categories have approved names and values
- Light and Dark modes resolve completely
- token aliases contain no cycles
- token export is machine-readable
- Storybook foundation pages are complete
- accessibility checks pass

---

# 8. Phase 2: Token pipeline and code integration

## Objective

Create a repeatable Figma-to-code token workflow.

## Deliverables

- [ ] Select or finalize token export method.
- [ ] Export primitive, semantic, and component tokens separately.
- [ ] Generate CSS custom properties.
- [ ] Generate TypeScript token exports.
- [ ] Generate type declarations.
- [ ] Map tokens to Tailwind where required.
- [ ] Add token validation.
- [ ] Add alias-cycle detection.
- [ ] Add missing-mode detection.
- [ ] Add duplicate-token detection.
- [ ] Add generated-file verification.
- [ ] Add clean-build verification.
- [ ] Document local and CI commands.

## Recommended outputs

```text
packages/tokens/src/primitives.json
packages/tokens/src/semantic.json
packages/tokens/src/components.json
packages/tokens/src/themes/light.json
packages/tokens/src/themes/dark.json
packages/tokens/dist/tokens.css
packages/tokens/dist/tokens.ts
packages/tokens/dist/tokens.d.ts
```

## Exit criteria

- token generation is reproducible
- generated files are not manually maintained
- CI detects token drift
- components consume token outputs
- token package can be installed independently

---

# 9. Phase 3: Primitive component library

## Objective

Build the stable interaction primitives required by most enterprise applications.

## Target

```text
40–50 primitive components
```

## Priority components

### Actions

- [ ] Button
- [ ] Icon Button
- [ ] Link
- [ ] Split Button
- [ ] Button Group

### Form controls

- [ ] Form Field
- [ ] Text Input
- [ ] Textarea
- [ ] Search Field
- [ ] Select
- [ ] Combobox
- [ ] Checkbox
- [ ] Radio Group
- [ ] Switch
- [ ] Slider
- [ ] Date Input
- [ ] File Upload

### Navigation

- [ ] Tabs
- [ ] Breadcrumb
- [ ] Pagination
- [ ] Menu
- [ ] Dropdown
- [ ] Navigation Item

### Feedback

- [ ] Alert
- [ ] Toast
- [ ] Tooltip
- [ ] Progress
- [ ] Spinner
- [ ] Skeleton
- [ ] Badge

### Overlays

- [ ] Dialog
- [ ] Alert Dialog
- [ ] Popover
- [ ] Drawer
- [ ] Sheet

### Data display

- [ ] Avatar
- [ ] Card
- [ ] Table
- [ ] List
- [ ] Empty State
- [ ] Divider
- [ ] Code Block

## Requirements for every Stable primitive

- approved Figma component
- token bindings
- typed API in its framework package (React today)
- semantic HTML
- keyboard behavior
- accessibility tests
- Storybook documentation
- visual-regression coverage
- Code Connect mapping where practical
- changelog entry

## Exit criteria

- priority primitives are Stable
- application teams can build common forms and navigation
- no component uses hardcoded token-backed values
- Storybook documents complete behavior

---

# 10. Phase 4: Composite component library

## Objective

Create reusable compositions for common enterprise product scenarios.

## Target

```text
80–100 composite components
```

## Candidate composites

- [ ] Search with filters
- [ ] Filter bar
- [ ] Advanced filter panel
- [ ] Bulk action toolbar
- [ ] Page header
- [ ] Section header
- [ ] Data table toolbar
- [ ] Pagination footer
- [ ] Form section
- [ ] Multi-field input group
- [ ] Date range picker
- [ ] File upload queue
- [ ] Notification center
- [ ] Activity feed
- [ ] Comment thread
- [ ] Status summary
- [ ] Metric card
- [ ] KPI group
- [ ] Empty results panel
- [ ] Error recovery panel
- [ ] Confirmation workflow
- [ ] Command palette
- [ ] Global search
- [ ] Side navigation
- [ ] Application header

## Exit criteria

- composites use only approved primitives
- APIs avoid product-specific business logic
- responsive and accessibility behavior is documented
- common enterprise workflows require less custom assembly

---

# 11. Phase 5: Enterprise components

## Objective

Support complex, data-heavy, role-based enterprise applications.

## Target

```text
30+ enterprise components
```

## Candidate components

- [ ] Data Grid
- [ ] Tree Grid
- [ ] Property Inspector
- [ ] Audit Log
- [ ] Timeline
- [ ] Workflow Stepper
- [ ] Approval Panel
- [ ] Review Queue
- [ ] Exception Queue
- [ ] Permission Matrix
- [ ] Role Assignment
- [ ] Policy Builder
- [ ] Rule Builder
- [ ] Query Builder
- [ ] Data Mapping
- [ ] Reconciliation Panel
- [ ] Compare View
- [ ] Diff Viewer
- [ ] Record Detail Panel
- [ ] Master-detail layout
- [ ] Batch Processing Status
- [ ] Import Validation
- [ ] Export Configuration
- [ ] Scheduling Panel
- [ ] Saved View Manager
- [ ] Column Manager
- [ ] Density Selector
- [ ] Notification Preferences
- [ ] Activity and History Panel
- [ ] Enterprise Search Results

## Exit criteria

- components support large datasets and complex states
- permissions and read-only behavior are explicit
- keyboard and screen-reader strategies are validated
- performance limits are documented
- enterprise examples exist in Storybook

---

# 12. Phase 6: AI-first component system

## Objective

Provide safe, consistent, human-in-the-loop patterns for AI-powered applications.

## Priority AI components

- [ ] AI Action Button
- [ ] AI Icon Button
- [ ] AI Response Panel
- [ ] AI Prompt Input
- [ ] AI Generation Status
- [ ] AI Confidence Indicator
- [ ] AI Citation List
- [ ] AI Evidence Panel
- [ ] AI Feedback Controls
- [ ] AI Compare Output
- [ ] AI Rewrite Controls
- [ ] AI Review Queue Item
- [ ] AI Suggested Action
- [ ] AI Field Extraction
- [ ] AI Correction Workflow
- [ ] AI Audit Trail
- [ ] AI Model Indicator
- [ ] AI Safety Notice
- [ ] AI Permission Notice
- [ ] AI Empty and Error States

## Required behavior

```text
Idle
Generating
Streaming
Complete
Needs Review
Low Confidence
Error
Cancelled
Unavailable
```

## Governance requirements

- disclose AI involvement
- preserve user-authored content
- support edit, accept, reject, cancel, regenerate, and undo
- provide sources where available
- communicate uncertainty honestly
- support human review for high-impact outcomes
- provide accessible status announcements
- document privacy and audit implications

## Exit criteria

- AI patterns are reusable across product teams
- status and review behavior is consistent
- accessibility is validated
- responsible AI guidance is included in Storybook
- applications do not invent inconsistent AI interaction patterns

---

# 13. Phase 7: Patterns and templates

## Objective

Provide reusable workflow patterns and page-level templates.

## Targets

```text
40+ workflow patterns
20–30 page templates
```

## Workflow patterns

- [ ] Search and filter
- [ ] Create and edit record
- [ ] Review and approve
- [ ] Bulk selection and action
- [ ] Import and validate
- [ ] Upload and process
- [ ] Error recovery
- [ ] Empty-state onboarding
- [ ] Multi-step configuration
- [ ] Permissions management
- [ ] Audit and history
- [ ] Reconciliation
- [ ] Exception resolution
- [ ] AI generation and review
- [ ] AI extraction and correction
- [ ] Progressive disclosure
- [ ] Save and resume
- [ ] Destructive confirmation
- [ ] Background processing
- [ ] Notification and follow-up

## Page templates

- [ ] Application shell
- [ ] Dashboard
- [ ] Data table page
- [ ] Record detail
- [ ] Master-detail
- [ ] Settings
- [ ] Form page
- [ ] Wizard
- [ ] Review queue
- [ ] Analytics
- [ ] Search results
- [ ] Empty first-use experience
- [ ] Upload center
- [ ] AI workspace
- [ ] Audit page
- [ ] Administration page

## Exit criteria

- templates use approved components only
- responsive behavior is documented
- patterns include accessibility and content guidance
- product teams can start from system-approved workflows

---

# 14. Phase 8: Storybook as a product

## Objective

Make Storybook the trusted implementation reference for Lumen.

## Deliverables

- [ ] Finalize navigation hierarchy.
- [ ] Preserve customized Lumen branding.
- [ ] Standardize Docs page templates.
- [ ] Add foundation pages.
- [ ] Add component status labels.
- [ ] Add Figma links.
- [ ] Add token references.
- [ ] Add accessibility sections.
- [ ] Add changelog links.
- [ ] Add migration notices.
- [ ] Add Light and Dark theme controls.
- [ ] Add density controls.
- [ ] Add RTL support where required.
- [ ] Add design-review examples.
- [ ] Add visual-regression coverage.
- [ ] Add search and discovery improvements.
- [ ] Publish Storybook from CI.

## Exit criteria

- every Stable component has complete documentation
- Storybook production build is reliable
- customized UI survives upgrades
- product teams can discover components without direct support
- documentation and implementation remain synchronized

---

# 15. Phase 9: Figma and code parity

## Objective

Create traceable mappings between design assets and production components.

## Deliverables

- [ ] Define component source manifest.
- [ ] Record Figma node IDs.
- [ ] Record code source paths.
- [ ] Record Storybook story paths.
- [ ] Add Code Connect mappings.
- [ ] Identify unmapped components.
- [ ] Add parity review to pull requests.
- [ ] Add changed-node review workflow.
- [ ] Document intentional differences.
- [ ] Track last synchronization date.

## Exit criteria

- Stable components have traceable Figma-to-code mappings
- design and code reviews use shared evidence
- parity gaps are visible and owned
- component-specific Figma URLs are used for implementation

---

# 16. Phase 10: Automation and CI

## Objective

Automate repeatable validation without removing human review.

## Deliverables

- [ ] Token schema validation
- [ ] Alias-cycle validation
- [ ] Missing-mode validation
- [ ] Duplicate-token validation
- [ ] Lint
- [ ] Type checking
- [ ] Unit tests
- [ ] Accessibility tests
- [ ] Storybook build
- [ ] Visual-regression tests
- [ ] Package build
- [ ] Package-size checks
- [ ] Broken-link checks
- [ ] Documentation checks
- [ ] Release artifact verification
- [ ] Prerelease automation
- [ ] Stable release approval gate

## Exit criteria

- every pull request runs mandatory checks
- release artifacts are reproducible
- failures identify affected scope clearly
- automation never silently approves inaccessible or ambiguous designs

---

# 17. Phase 11: Adoption and enablement

## Objective

Enable product teams to adopt Lumen efficiently.

## Deliverables

- [ ] Installation guide
- [ ] Quick-start guide
- [ ] Contribution guide
- [ ] Migration guide
- [ ] Component selection guide
- [ ] Design onboarding
- [ ] Engineering onboarding
- [ ] Accessibility training
- [ ] AI-pattern training
- [ ] Office hours
- [ ] Support channel
- [ ] Example application
- [ ] Adoption dashboard
- [ ] Feedback process

## Exit criteria

- teams can install and use Lumen independently
- adoption barriers are tracked
- common support questions are documented
- contribution requests follow governance

---

# 18. Phase 12: Measurement and optimization

## Objective

Use evidence to improve quality, adoption, and delivery speed.

## Suggested metrics

### Adoption

- percentage of product surfaces using Lumen
- number of active consuming applications
- component reuse rate
- duplicate component reduction
- token adoption rate

### Quality

- accessibility defects by severity
- visual-regression defect rate
- Figma-to-code parity issues
- broken Storybook stories
- release rollback rate
- escaped defects

### Delivery

- time from approved Figma change to release
- component implementation lead time
- review cycle time
- release frequency
- migration completion rate

### Developer experience

- component discovery time
- installation success rate
- documentation satisfaction
- support requests by category
- API usability feedback

### AI-assisted development

- percentage of AI-generated screens using Lumen correctly
- duplicate components introduced by AI agents
- token compliance of generated code
- accessibility pass rate of AI-generated implementations

## Exit criteria

- metrics are reviewed regularly
- roadmap priorities respond to evidence
- unused or low-quality components are improved or deprecated

---

# 19. Recommended delivery sequence

## Now

```text
Governance
Foundation verification
Token export
Light and Dark modes
Accessibility baseline
Storybook foundation pages
Button and form primitives
```

## Next

```text
Primitive library
Token build pipeline
Code Connect pilot
Visual regression
Composite components
AI action and response components
```

## Later

```text
Enterprise components
Workflow patterns
Page templates
Automated releases
Adoption analytics
Advanced AI governance patterns
First additional framework package (Web Components proof of concept)
Angular and Vue framework packages
```

---

# 20. Priority matrix

| Initiative | Impact | Effort | Priority |
|---|---|---|---|
| Complete semantic color tokens | High | Medium | P0 |
| Validate Light and Dark modes | High | Medium | P0 |
| Build token export pipeline | High | Medium | P0 |
| Stabilize Button and form controls | High | Medium | P0 |
| Accessibility baseline | High | Medium | P0 |
| Storybook foundation pages | High | Low | P0 |
| Primitive component library | High | High | P1 |
| Visual-regression workflow | High | Medium | P1 |
| Code Connect pilot | Medium | Medium | P1 |
| AI action components | High | Medium | P1 |
| Composite enterprise components | High | High | P2 |
| Page templates | Medium | High | P2 |
| Automated stable release | Medium | High | P2 |
| Adoption analytics | Medium | Medium | P3 |

---

# 21. Dependencies

## Foundation dependencies

```text
Color aliases
Typography styles
Spacing
Radius
Focus
Motion
Themes
```

must be stable before broad component release.

## Component dependencies

```text
Primitives
    ↓
Composites
    ↓
Enterprise components
    ↓
Patterns
    ↓
Templates
```

## Automation dependencies

Automation requires:

- stable naming
- machine-readable exports
- reproducible builds
- reliable tests
- release ownership

Do not automate unstable conventions.

---

# 22. Risks and mitigations

## Risk: Figma and code drift

Mitigation:

- component-specific node links
- changelog-controlled updates
- Code Connect
- visual regression
- parity review

## Risk: Token proliferation

Mitigation:

- layered token architecture
- semantic naming review
- duplicate-token checks
- approval requirements

## Risk: Component overgrowth

Mitigation:

- composition-first design
- maturity states
- deprecation process
- usage analytics

## Risk: Storybook customization breaks during upgrade

Mitigation:

- isolate theme configuration
- test production Storybook builds
- document custom manager and Docs changes
- review upgrades separately

## Risk: Accessibility added too late

Mitigation:

- accessibility acceptance criteria
- automated checks
- manual keyboard and screen-reader review
- release-blocking severity model

## Risk: AI agents generate inconsistent code

Mitigation:

- `CLAUDE.md`
- explicit documentation hierarchy
- Storybook as implementation reference
- token and API validation
- no-regeneration rules

---

# 23. Roadmap governance

Review the roadmap:

```text
Monthly for delivery status
Quarterly for strategic priorities
Before every Major release
After major adoption or quality findings
```

## Status values

```text
Planned
Ready
In Progress
Blocked
At Risk
Completed
Deferred
Cancelled
```

## Initiative record

```markdown
## Initiative

- Name:
- Status:
- Priority:
- Owner:
- Target:
- Dependencies:
- Deliverables:
- Success metrics:
- Risks:
- Decision:
```

---

# 24. Quarterly planning template

```markdown
# Lumen Quarterly Plan

## Quarter

## Strategic outcomes

## P0 initiatives

## P1 initiatives

## Deferred initiatives

## Dependencies

## Risks

## Metrics

## Required decisions

## Release targets
```

---

# 25. Roadmap update process

When roadmap priorities change:

1. Record the reason.
2. Identify affected phases and deliverables.
3. Update owners and target periods.
4. Update dependencies.
5. Update release expectations.
6. Record the change in `changelog.md` when it affects committed delivery scope.
7. Communicate the change to design and engineering teams.

Do not silently remove committed accessibility, quality, or migration work.

---

# 26. Claude Code roadmap protocol

Before planning or implementing roadmap work, Claude Code must read:

```text
CLAUDE.md
AGENTS.md
docs/figma-source.md
docs/design-tokens.md
docs/component-architecture.md
docs/component-specifications.md
docs/accessibility.md
docs/storybook-guidelines.md
docs/development-guidelines.md
docs/quality-checklist.md
docs/design-review.md
docs/release-process.md
docs/roadmap.md
docs/changelog.md
```

## Planning pass

Claude Code must:

1. Identify the requested roadmap initiative.
2. Confirm its phase and dependencies.
3. Inspect the current repository and Storybook.
4. Identify missing prerequisites.
5. Propose the smallest executable milestone.
6. Avoid implementing unrelated roadmap items.
7. Report risks and validation requirements.

## Reusable prompt

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
- `docs/design-review.md`
- `docs/release-process.md`
- `docs/roadmap.md`
- `docs/changelog.md`

Plan only the requested Lumen roadmap initiative.

First report:
1. current maturity
2. prerequisites
3. affected tokens
4. affected components
5. affected packages
6. Storybook impact
7. accessibility impact
8. testing requirements
9. release impact
10. smallest executable milestone

Do not implement unrelated roadmap items.
Do not regenerate the design system.
Do not infer missing Figma values.
Use component-specific Figma nodes for implementation work.
```

---

# 27. Current verification status

The Figma plugin was invoked for node `426:4395`, but `get_design_context` returned a selection-related error indicating that no layer was selected.

The roadmap is therefore grounded in:

- the supplied Figma file and node
- previously retrieved Figma metadata
- verified foundation sections
- the current Lumen documentation set
- the customized local Storybook context

The following require direct Figma Variable exports, repository inspection, or component-specific Dev Mode links before their roadmap status can be marked complete:

- exact color values and aliases
- variable collection names and modes
- font families and weights
- complete scale values
- component inventory
- component maturity
- Code Connect coverage
- token pipeline implementation
- CI validation coverage
- package release configuration
- Storybook deployment status

Do not mark roadmap deliverables complete without evidence.

---

# 28. Phase 13: Multi-framework expansion

## Objective

Support React, Angular, Vue, and future frameworks without treating any single framework's components as the source of truth. Lumen is structured as a framework-agnostic design-system core (tokens, framework-agnostic foundations, component specifications) with separate framework packages implementing that shared contract — see `docs/component-architecture.md` §0 for the full layer diagram.

## Status

```text
In progress — Web Components proof of concept shipped (Button only) 2026-07-12.
Docs/implementation discrepancy reconciled the same day (see Findings below).
Angular proof of concept (Button only) shipped 2026-07-12 as @lumen/angular,
targeting Angular 20 LTS (not latest 22 — see package README for the
TypeScript-version reason). Vue framework package not yet started.
```

## Sequencing

This phase depends on Phases 0–8 (governance, foundations, primitive/composite libraries, Storybook) reaching a stable state in the React reference implementation first. Adding framework packages before the contract itself is stable multiplies the cost of every subsequent Figma-sourced change. The Web Components proof of concept was built ahead of that sequencing being fully satisfied, deliberately scoped to one component (Button) to keep the exception small.

## Deliverables

- [x] Decouple `docs/component-architecture.md` and `docs/component-specifications.md` from React so the component contract is framework-neutral and React is documented as the current reference implementation, not the definition.
- [x] Build one additional framework package as a proof of concept: Web Components (chosen over Angular/Vue first because custom elements are natively consumable from both, reducing the total number of adapters ultimately needed, and validate the contract without committing to one framework's idioms). Shipped as `@lumen/web-components`, Button only, built with Lit. See `packages/web-components/README.md`.
- [x] Attempt to validate that the Web Components package can implement the existing Button specification (§5 of `docs/component-specifications.md`) without requiring spec changes — **result: it could not**, because the spec itself doesn't match the real React implementation. See Findings below.
- [ ] Decide Storybook strategy for multiple frameworks (separate Storybook instance per framework package vs. one canonical live-example framework with contract-only docs for the rest). Deliberately deferred — out of scope for a one-component proof of concept.
- [ ] Update `docs/versioning-and-releases.md` so each framework package versions against a shared contract version rather than independently.
- [x] Build the Angular framework package (Button only, proof of concept). Shipped as `@lumen/angular`, standalone components, Angular 20 LTS. See `packages/angular/README.md` — including a documented JIT/Vitest testing constraint that shaped an implementation choice (classic `@Input()` decorators, not signal `input()`).
- [ ] Build the Vue framework package.
- [ ] Add a "Framework" column/section to every component specification's Code mapping once more than one framework package exists.
- [x] Reconcile `docs/component-specifications.md` §5 (Button) and `docs/component-architecture.md` §7 against the real `Button.tsx`/`Button.stories.tsx`/`Button.test.tsx` — done 2026-07-12, see Findings.

## Findings

Building the Web Components Button surfaced that `docs/component-specifications.md` §5 did not match what `@lumen/ui`'s `Button.tsx` actually ships:

- Docs listed variants `primary | secondary | tertiary | ghost | link | danger | ai`. The real component ships `primary | raised | secondary | tertiary | link` — no `ghost`/`danger`/`ai`, and has `raised` instead.
- Docs listed a `fullWidth` property that the real component doesn't implement.
- Docs named icon props `leadingIcon`/`trailingIcon`; the real component uses `iconStart`/`iconEnd`, plus undocumented `iconOnly` and `pill` modifiers.
- Docs listed sizes `sm | md | lg`; the real component also has `xs`.
- Docs listed `Selected`/`Success`/`Error` as optional states; none are implemented or in the cited Figma source.

`@lumen/web-components`'s Button was built to match the real React implementation, not the docs, since matching neither would have defeated the point of a cross-framework consistency check. `docs/component-specifications.md` §5 and `docs/component-architecture.md` §7 (which duplicated the same variant/property list) were then reconciled against `Button.tsx` directly — both now match the real, shipped, Figma-cited implementation.

Building `@lumen/angular` surfaced a separate, tooling-level finding (not a spec discrepancy): Angular's JIT compiler cannot recognize signal-based `input()`/`output()` fields when components are transformed by plain esbuild (what Vitest uses) instead of a real Angular/TypeScript compiler pipeline — see `packages/angular/README.md` for the full explanation and `angular/angular#54013`. The fix (classic `@Input()` decorators instead of signal inputs) kept this package's tooling as light as `@lumen/ui` and `@lumen/web-components`, avoiding a dependency on `@angular/build`/`@analogjs/vite-plugin-angular`. Apply the same check before building the Vue package: verify Vue's Vitest/testing story doesn't have an equivalent gap before assuming the same lightweight approach works there too.

## Exit criteria

- [x] at least one non-React framework package ships a component that conforms to an existing, unmodified component specification — met; both `@lumen/web-components` and `@lumen/angular` now ship a Button matching the reconciled spec
- [x] the component contract in `docs/component-specifications.md` requires no React-specific language to be understood or implemented by a new framework package, and its content matches the real shipped component
- [ ] Storybook (or its documented equivalent) covers every shipped framework package — deferred, see Deliverables
- [ ] release process versions framework packages against the shared contract without silent drift — not yet addressed

The Vue framework package may now be started against an accurate Button specification. Apply the same real-source verification (Figma node + actual component/test/story files, not assumed prior docs) to each additional component before or as it's ported to a new framework — the Button discrepancy is exactly the failure mode this phase exists to catch early. Also check Vue's Vitest testing story for an equivalent JIT/compiler gap before assuming the Angular package's approach transfers directly.

---

# 29. Phase 14: Product scaffolding

## Objective

Let a product application be developed alongside the design system itself, in this same repository, without the pinned-Git-dependency overhead the "Use Lumen in a product application" model requires — so day-to-day component and token changes are visible in a real consuming app immediately, with no publish, tag, or link step.

## Status

```text
Shipped 2026-07-17 as @lumen/create-app, a CLI scaffolder (pnpm create:react)
generating a React + TypeScript + Vite + Tailwind app under apps/<name>, wired
to @lumen/tokens, @lumen/ui, and (optionally) @lumen/patterns via workspace:*
dependencies. This phase was not planned ahead of time on this roadmap — it is
recorded here retroactively for tracking, per this document's own governance
requirement that shipped work be discoverable here.
```

## Deliverables

- [x] A non-interactive and interactive CLI (`packages/create-app`) that scaffolds a workspace-member React app under `apps/<name>`, prompting for (or accepting flags for) project name, whether to include `@lumen/patterns`, and whether to install dependencies immediately.
- [x] Generated app wired to the local `@lumen/tokens`/`@lumen/ui`/`@lumen/patterns` sources via pnpm `workspace:*` symlinks — no build or reinstall step needed to see package changes reflected.
- [x] `apps/*` added to `pnpm-workspace.yaml`; root `typecheck`/`test` rescoped to `./packages/**` and `.eslintrc.cjs` updated so generated scaffolds never leak into the repository's own quality gates.
- [x] CI coverage (`.github/workflows/react-starter.yml`) proving a generated app installs, type-checks, and builds from a clean, frozen-then-workspace install — not just that the scaffolder's own unit tests pass.
- [x] `README.md` documentation of the flow ("Create a React application").
- [ ] Decide whether `@lumen/create-app` should offer a Vue or framework-agnostic template once a corresponding framework package exists (see Phase 13) — not yet addressed, no demand identified.

## Exit criteria

- [x] `pnpm create:react` produces an app that installs, type-checks, and builds without manual intervention, verified both in CI and via a local end-to-end run
- [x] the generated app requires no Git-dependency pinning or publish step to consume `@lumen/tokens`/`@lumen/ui`/`@lumen/patterns`
- [x] generated scaffolds are excluded from the repository's own lint/typecheck/test runs by construction, not by convention