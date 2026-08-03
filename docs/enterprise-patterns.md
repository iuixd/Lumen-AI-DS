# Enterprise Patterns

Patterns in `@lumen/patterns` are composed reference screens, not new components.
They exist so that every product team builds the same shape of CRUD page,
settings page, auth flow, and dashboard instead of re-deriving layout and
state-handling decisions per feature. When Claude Code (or a developer) needs
one of these screens, it should import and adapt the pattern rather than
generate new markup.

## Available patterns

**CrudListPage** — search/filter header, `DataTable`, pagination, empty state,
and a primary "create" action. Use for any "list of records" screen: users,
invoices, projects, tickets, audit logs.

**SettingsPage** — tabbed section shell (Profile / Team / Billing / Security...).
Add a new settings area by appending a `SettingsSection`, not by building a new
page shell.

**AuthForm** — sign-in / sign-up card with `FormField` + `Input` + `Button`.
Centers itself on `--color-background-subtle`.

**DashboardPage** — KPI card grid (`Grid` of `Card`) plus a slot for charts or
activity feed.

**EnterpriseLoginPage** — multi-step enterprise sign-in flow: a marketing
hero panel alongside SSO/passkey/email sign-in, MFA code entry, and a
"Signed in" confirmation screen. Use for a B2B product's primary
authentication entry point where SSO/passkey options and an org-detection
hint (recognizing a work-email domain) matter; for a simple single-form
sign-in/sign-up, use `AuthForm` instead. Fires `onComplete` when its
internal state machine reaches "Signed in" — the integration point for
routing into the rest of your app.

**DataExtractionOnboardingPage** — a full, functional, click-through
onboarding journey composing `EnterpriseLoginPage` with a file-upload
dropzone, animated per-file upload progress, and a "Create Project" action,
each step transitioning into the next. Use as the entry flow for any
product where a user signs in and then uploads a batch of files before
their workspace/project exists yet. `onProjectCreated` is the integration
point (called with the real `File[]` once every file finishes and "Create
Project" is clicked) — like every pattern in this package, upload progress
itself is client-side-simulated, not a real network call.

## Required states for every list/detail screen

Every screen that renders a collection or awaits a network response must
explicitly handle:

1. **Loading** — render skeleton placeholders sized to the real content (do not
   show a blank screen or a single centered spinner for full-page loads).
2. **Empty** — use `EmptyState` with an action that resolves the empty state
   (e.g. "Create your first project"), not just a "No data" string.
3. **Error** — surface a retry action; do not swallow errors into an empty
   state.
4. **Populated** — the normal case, shown above.

## Adding a new pattern

1. Compose it entirely from `@lumen/ui` exports. If you find yourself writing
   raw Tailwind classes for spacing/color/type, that's a signal the primitive
   or composite you need doesn't exist yet — add it to `@lumen/ui` first.
2. Add it to `packages/patterns/src/index.ts`.
3. Document it here with a one-paragraph "when to use this" note.
4. Add a Changeset (`pnpm changeset`) describing the addition.
