import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ContentState } from "./ContentState";
import { Button } from "../components/button/Button";
import { PlusIcon } from "../icons/generated";

/**
 * ContentState is what a content region shows *instead of* its content:
 * nothing yet, still loading, or failed to load. Sourced from
 * Lumen-AI-Design-System node `1174:1355`.
 */
const meta = {
  title: "Composite/ContentState",
  component: ContentState,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: [
          "Sourced from Lumen-AI-Design-System node `1174:1355` (variants `1073:4486` Empty, `1073:4484` Loading, `1073:4483` Error).",
          "",
          "**Not the same thing as `Composite/EmptyState`.** `EmptyState` is an *inline* treatment — a dashed box or a bordered card that sits inside a surface. `ContentState` replaces a whole content region, sits on the app canvas (`--color-content-state-bg`), and owns the loading and error cases too. Reach for `EmptyState` inside a card or table; reach for `ContentState` for a page or panel body.",
          "",
          "**Design tokens consumed.** Surface: `background.app` (new), `background.raised`, `background.nav-active`. Border: `border.table` (skeleton bars), `border.subtle` (skeleton cards/rows). Text: `text.body` (heading), `text.tertiary` (new — empty description), `text.secondary` (error description). Status: `status.error-subtle` / `status.error` (error badge). Typography: `content-state-title` (new — Source Serif Pro 24/32 Regular). Motion: `duration.skeleton-pulse`, `easing.skeleton-pulse`, `opacity.skeleton-pulse-*`, `stagger.skeleton-step-*` (all new — see `motion.json`). Geometry: `--content-state-*` (see `content-state.json`).",
          "",
          "**Two recorded Figma-to-code differences.** (1) Figma frames this at a fixed 600x400; the component is fluid with a 400px min-height, since the set publishes one frame and no breakpoint evidence. (2) Figma binds the Empty variant's CTA fill to a raw `--lumen-dark/default` rather than to any `btn/*` variable, unlike the Error variant's properly-bound destructive CTA — treated as a Figma authoring gap, so use the standard `Button` in the `action` slot.",
          "",
          "**Dark mode is provisional.** This set publishes Light only; the dark values are ramp mirrors, not Figma-authored."
        ].join("\n")
      }
    }
  },
  args: {
    state: "empty",
    title: "No projects yet",
    description: (
      <>
        <p>Create your first project to get started with</p>
        <p>tracking renewals and managing accounts.</p>
      </>
    ),
    action: (
      <Button>
        <PlusIcon />
        New project
      </Button>
    )
  },
  render: (args: ComponentProps<typeof ContentState>) => <ContentState {...args} />
} satisfies Meta<typeof ContentState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default state — matches Figma variant `1073:4486`. */
export const Default: Story = {};

/** Every prop wired to a control. Switch `state` to compare all three. */
export const Playground: Story = {};

export const Empty: Story = {
  name: "State: Empty",
  args: { state: "empty" }
};

export const Loading: Story = {
  name: "State: Loading",
  args: { state: "loading", loadingLabel: "Loading projects" },
  parameters: {
    docs: {
      description: {
        story:
          "Figma variant `1073:4484`. The 2s pulse, its 0.4 dim stop, and each bar's stagger offset are read from the node's own keyframe data via `get_motion_context` — not from Tailwind's `animate-pulse`, whose 0.5 stop is close but wrong. Every bar is `aria-hidden`; the only thing announced is `loadingLabel`, through a polite `role=\"status\"` live region. The animation stops entirely under `prefers-reduced-motion: reduce`."
      }
    }
  }
};

export const Error: Story = {
  name: "State: Error",
  args: {
    state: "error",
    title: "Something went wrong",
    description: (
      <>
        <p>We couldn&apos;t load this page. Please try again</p>
        <p>or contact support if the problem persists.</p>
      </>
    ),
    action: <Button variant="destructive">Try again</Button>
  },
  parameters: {
    docs: {
      description: {
        story:
          "Figma variant `1073:4483`. Uses `role=\"alert\"` rather than the empty state's silence — a load failure is an unrequested change the user needs to hear about. The CTA is the standard `Button variant=\"destructive\"`, whose colors already match this node's `btn/destructive/default/*` bindings exactly."
      }
    }
  }
};

/**
 * All three states together — the fastest way to check token and spacing
 * parity against the Figma frame, and to sanity-check dark mode via the
 * toolbar theme toggle.
 */
export const VariantCollection: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "All three variants side by side, mirroring Figma's own component-set layout. Toggle the toolbar theme to check dark mode — remember its values are provisional ramp mirrors, not Figma-authored."
      }
    }
  },
  render: () => (
    <div className="grid gap-[var(--spacing-16)] lg:grid-cols-3">
      <ContentState
        title="No projects yet"
        description={
          <>
            <p>Create your first project to get started with</p>
            <p>tracking renewals and managing accounts.</p>
          </>
        }
        action={
          <Button>
            <PlusIcon />
            New project
          </Button>
        }
      />
      <ContentState state="loading" loadingLabel="Loading projects" />
      <ContentState
        state="error"
        title="Something went wrong"
        description={
          <>
            <p>We couldn&apos;t load this page. Please try again</p>
            <p>or contact support if the problem persists.</p>
          </>
        }
        action={<Button variant="destructive">Try again</Button>}
      />
    </div>
  )
};

/**
 * The component fills its container rather than Figma's fixed 600px, so it
 * works in a narrow panel and a full page alike.
 */
export const Responsive: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Same component at panel width and full width. Figma publishes a single fixed 600x400 frame; the fluid width is an intentional code-side decision recorded in `docs/figma-sync.md`."
      }
    }
  },
  render: () => (
    <div className="flex flex-col gap-[var(--spacing-24)]">
      <div className="w-[360px] border border-[var(--color-border-subtle)]">
        <ContentState state="loading" loadingLabel="Loading projects" />
      </div>
      <div className="w-full border border-[var(--color-border-subtle)]">
        <ContentState state="loading" loadingLabel="Loading projects" />
      </div>
    </div>
  )
};

/**
 * A caller-supplied skeleton, for when the real content's shape doesn't match
 * the default cards-and-rows layout.
 */
export const CustomSkeleton: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ContentState
      state="loading"
      loadingLabel="Loading conversation"
      skeleton={
        <div className="flex w-full flex-col gap-[var(--spacing-12)]">
          <div className="h-[var(--spacing-40)] w-full animate-pulse rounded-[var(--radius-chat-bubble)] bg-[var(--color-content-state-skeleton-bar-bg)]" />
          <div className="h-[var(--spacing-40)] w-3/4 animate-pulse rounded-[var(--radius-chat-bubble)] bg-[var(--color-content-state-skeleton-bar-bg)]" />
        </div>
      }
    />
  )
};

export const DoAndDont: Story = {
  name: "Do / Don't",
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: [
          "**Do** give the loading state a specific `loadingLabel` — \"Loading projects\" tells a screen-reader user what they're waiting for; the default \"Loading content\" doesn't.",
          "",
          "**Do** pair the error state with a real recovery action. An error with no way out is a dead end.",
          "",
          "**Don't** use `ContentState` inside a card or table cell — that's `EmptyState`'s job. `ContentState` paints the app canvas background and will look wrong on a raised surface.",
          "",
          "**Don't** put an interactive control inside `skeleton`. The whole region is `aria-busy` and every bar is `aria-hidden`; anything focusable in there is unreachable in the accessibility tree but still tabbable.",
          "",
          "**Don't** swap `state` on every keystroke of a filter. The polite live region will re-announce each time. Debounce, or keep the previous content visible."
        ].join("\n")
      }
    }
  },
  render: () => (
    <div className="grid gap-[var(--spacing-16)] lg:grid-cols-2">
      <div className="flex flex-col gap-[var(--spacing-8)]">
        <p className="text-label-lg text-[var(--color-status-success-text)]">Do — specific label, real recovery action</p>
        <ContentState
          state="error"
          title="Something went wrong"
          description={<p>We couldn&apos;t load your projects.</p>}
          action={<Button variant="destructive">Try again</Button>}
        />
      </div>
      <div className="flex flex-col gap-[var(--spacing-8)]">
        <p className="text-label-lg text-[var(--color-status-error-text)]">Don&apos;t — no action, no way forward</p>
        <ContentState state="error" title="Error" />
      </div>
    </div>
  )
};
