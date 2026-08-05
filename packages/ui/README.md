# @lumen/ui

React + TypeScript + Tailwind components built on `@lumen/tokens`. This is
Lumen's React reference implementation — see `docs/component-architecture.md`
§0: the tokens, framework-agnostic foundations, and component specifications
above it are the actual source of truth for the component contract, not
this package.

## Installation

```bash
pnpm add @lumen/ui @lumen/tokens react react-dom
```

```tsx
import "@lumen/tokens/css";
// shadcn-sourced components (see "shadcn-sourced components" below) also
// need this bridge stylesheet, which maps their generic classes onto
// real Lumen tokens:
import "@lumen/ui/shadcn.css";
import { Button } from "@lumen/ui";

function Example() {
  return <Button variant="default">Save changes</Button>;
}
```

Set `data-theme="dark"` on any ancestor element (typically your app's root)
to switch every component to dark mode — see `packages/tokens/README.md`.

## What's in this package

`src/index.ts` is the only supported import path (`@lumen/ui`) — internal
module paths may change without notice. Every component styles itself
exclusively with semantic tokens (CSS variables from `@lumen/tokens`); see
`docs/accessibility.md` and `CONTRIBUTING.md` at the repo root before adding
or changing a component.

### Primitives (`src/primitives/`)

AIButton, IconButton, CodeBlock, TextLink, Badge, FilterChip, ChoiceChip,
SegmentedControl (+ SegmentedControlOption), Radio, Icon, ThemeToggle,
KPICard, LumenLogo, plus the AI-capabilities helper module.

### Icons (`src/icons/generated/`)

A generated, `currentColor`-based icon set (import any icon by name, plus
the `IconName` type) — distinct from the fixed, non-recolorable brand/
illustration assets (`LumenLogo`, `FileUploadDropzone`'s file-type icons)
that ship as committed SVG files instead.

### shadcn-sourced components (`src/components/`)

The larger part of this package's surface: components adopted from
[shadcn/ui](https://ui.shadcn.com) and adapted onto Lumen's token system
(see `docs/shadcn-integration.md` for the adaptation conventions and
`docs/roadmap.md` Phase 15 for the rollout history). `components/internal/`
holds each one's generated, unbridged source; the public export is the
adapted version.

Button, ButtonGroup, Card, Tabs, Input, InputGroup, InputOTP, Pagination,
Avatar, Tooltip, Select, Switch, Checkbox, RadioGroup, Table, Calendar,
Chart, Dialog, Accordion, Alert, Separator, Skeleton, Progress,
AspectRatio, Kbd, Popover, DropdownMenu, Sheet, ScrollArea, HoverCard,
Slider, Textarea, Toggle, ToggleGroup, ContextMenu, Breadcrumb, Drawer,
Carousel, Item, Collapsible, Label, NavigationMenu, Form, Command, Menubar,
Resizable.

**Note on `Button`**: this is the canonical, current React `Button` contract
— `default | destructive | outline | secondary | ghost | link | neutral |
neutral-solid` variants, `default | sm | lg | icon` sizes, icons passed as
plain children (no `iconStart`/`iconEnd` props), native `disabled`.
`@lumen/web-components` and `@lumen/angular` have not yet been migrated to
match this contract (though both did pick up `neutral-solid` on 2026-08-04,
by direct request, ahead of the rest of the migration); see their READMEs
before assuming prop-for-parity elsewhere.

### Composite (`src/composite/`)

Modal, DataTable, FormField, EmptyState, ContentState, Toast, SplitButton,
PageHeader, AIPanel, AIResponseCard, FileUploadDropzone,
FileUploadProgressList.

### Layout (`src/layout/`)

Container, Stack, Grid, SideNav, AppShell, Footer.

### Utilities

`cn` (class-name merge helper, `@lumen/ui/lib/cn`) — the same conflict-
resolving utility every component in this package uses internally; reach
for it instead of plain string concatenation when composing your own
classes with a component's `className` prop.

## Cross-framework parity

`@lumen/web-components` and `@lumen/angular` implement the same component
specifications as a growing subset of this package (9 components as of this
writing — see `docs/component-architecture.md` §13 for the full mapping).
Most of this package's surface (everything shadcn-sourced, plus most
primitives/composite/layout components) has no non-React equivalent yet —
check the mapping table before assuming a given component is available
outside React.

## Storybook

`pnpm storybook` from the repo root runs the live showcase — one page per
component with controls and auto-generated usage code. See
`docs/storybook-guidelines.md`.
