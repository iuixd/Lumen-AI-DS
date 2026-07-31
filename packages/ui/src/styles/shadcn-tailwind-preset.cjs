// Tailwind preset for shadcn-sourced components (packages/ui/src/components/internal/**).
// Extends whichever Lumen preset is already loaded with the small, fixed set
// of color/radius keys shadcn-generated markup expects (bg-popover,
// text-accent-foreground, rounded-lg, ...). Every key here resolves through
// a CSS variable defined once in shadcn-lumen-bridge.css, which in turn
// points at a real @lumen/tokens semantic variable — no new colors or radii
// are introduced by this file itself.
//
// Consumed by both packages/ui/tailwind.config.cjs and
// packages/storybook/tailwind.config.cjs (Storybook renders @lumen/ui's
// source directly, so it needs the same extension to render these
// components correctly) — kept as one shared file so the two configs can't
// drift apart.
//
// `aria.invalid` added 2026-07-31 (direct user report, on both `Input` and
// `Checkbox`: their error-state red border was silently never rendering).
// Root cause: Tailwind's built-in `aria-*` variant shorthand only expands
// names present in `theme.aria` — the framework's own default list is
// `checked`/`disabled`/`expanded`/`hidden`/`pressed`/`readonly`/`required`/
// `selected`, which does NOT include `invalid`. Every `aria-invalid:*`
// class already written across this codebase's shadcn-sourced components
// (Input, Checkbox, and any other consumer following the same convention)
// had been silently compiling to nothing since it was first written — not
// a regression from any single change, a pre-existing gap in this preset.
// Adding `invalid` here retroactively fixes every existing `aria-invalid:`
// usage repo-wide with one change, rather than rewriting each component to
// the bracket form (`aria-[invalid=true]:`), which needs no config but
// would mean touching every call site individually.
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      aria: {
        invalid: 'invalid="true"'
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)"
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)"
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)"
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)"
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)"
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)"
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)"
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      }
    }
  }
};
