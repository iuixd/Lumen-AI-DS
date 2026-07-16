import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SplitButton } from "./SplitButton";
import { PlusIcon, LmAisymbolIcon } from "../icons/generated";
import { getAICapability, type AICapabilityId } from "../primitives/ai-capabilities";

const meta = {
  title: "Composite/SplitButton",
  component: SplitButton,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Sourced from the Figma 'Buttons' page (Lumen-AI-Design-System, node 555:300): a primary action joined to a dropdown-toggle by a divider. Primary, Raised, Secondary, and Outline are specced (no Tertiary/Link), in sm/md/lg sizes, with an optional leading icon."
      }
    }
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "raised", "secondary", "outline"]
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    pill: { control: "boolean" },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" }
  },
  args: {
    children: "Save changes",
    variant: "primary",
    size: "lg",
    pill: false,
    isLoading: false,
    disabled: false,
    dropdownLabel: "More save options"
  }
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <SplitButton variant="primary" dropdownLabel="More save options">
        Primary
      </SplitButton>
      <SplitButton variant="raised" dropdownLabel="More save options">
        Raised
      </SplitButton>
      <SplitButton variant="secondary" dropdownLabel="More save options">
        Secondary
      </SplitButton>
      <SplitButton variant="outline" dropdownLabel="More save options">
        Outline
      </SplitButton>
    </div>
  )
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <SplitButton size="sm" dropdownLabel="More save options">
        Small
      </SplitButton>
      <SplitButton size="md" dropdownLabel="More save options">
        Medium
      </SplitButton>
      <SplitButton size="lg" dropdownLabel="More save options">
        Large
      </SplitButton>
    </div>
  )
};

export const Pill: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <SplitButton pill variant="primary" dropdownLabel="More save options">
        Primary
      </SplitButton>
      <SplitButton pill variant="raised" dropdownLabel="More save options">
        Raised
      </SplitButton>
      <SplitButton pill variant="secondary" dropdownLabel="More save options">
        Secondary
      </SplitButton>
      <SplitButton pill variant="outline" dropdownLabel="More save options">
        Outline
      </SplitButton>
    </div>
  )
};

export const WithIcon: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <SplitButton iconStart={<PlusIcon className="size-4" />} dropdownLabel="More create options">
        Create
      </SplitButton>
      <SplitButton
        variant="secondary"
        iconStart={<PlusIcon className="size-4" />}
        dropdownLabel="More create options"
      >
        Create
      </SplitButton>
    </div>
  )
};

export const Loading: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <SplitButton isLoading variant="primary" dropdownLabel="More save options">
        Saving
      </SplitButton>
      <SplitButton isLoading variant="raised" dropdownLabel="More save options">
        Saving
      </SplitButton>
      <SplitButton isLoading variant="secondary" dropdownLabel="More save options">
        Saving
      </SplitButton>
      <SplitButton isLoading variant="outline" dropdownLabel="More save options">
        Saving
      </SplitButton>
    </div>
  )
};

/**
 * `AiCapabilityMenu` — Storybook-only helper (not exported from the
 * package) implementing the WAI-ARIA APG Menu Button pattern for
 * `SplitButton`'s dropdown segment: `SplitButton` deliberately renders no
 * menu of its own (`onDropdownClick`/`dropdownButtonProps` are the
 * consumer's own hook-in points), so full open/close, roving-focus
 * keyboard navigation, hover, and click-outside behavior lives here as an
 * example, not as new shared component surface.
 *
 * Keyboard: ArrowDown/ArrowUp on the trigger opens the menu and focuses the
 * first/last item; within the menu, ArrowDown/ArrowUp move (wrapping),
 * Home/End jump to the first/last item, Enter/Space selects the focused
 * item, and Escape closes and returns focus to the trigger. Hovering an
 * item moves real DOM focus to it, so keyboard and pointer share one
 * highlighted-item model instead of two parallel ones. Clicking outside
 * the menu or trigger closes it.
 */
function AiCapabilityMenu({
  items,
  trigger
}: {
  items: readonly AICapabilityId[];
  trigger: (dropdownProps: {
    onDropdownClick: () => void;
    dropdownButtonProps: { onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void };
    dropdownLabel: string;
  }) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) {
      const trigger = containerRef.current?.querySelector<HTMLButtonElement>('[aria-haspopup="menu"]');
      trigger?.focus();
    }
  };

  const focusItem = (index: number) => {
    const count = items.length;
    const next = ((index % count) + count) % count;
    itemRefs.current[next]?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(items.length - 1));
    }
  };

  const handleItemKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusItem(index + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusItem(index - 1);
        break;
      case "Home":
        e.preventDefault();
        focusItem(0);
        break;
      case "End":
        e.preventDefault();
        focusItem(items.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        close(true);
        break;
      case "Escape":
        e.preventDefault();
        close(true);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      {trigger({
        onDropdownClick: () => setOpen((o) => !o),
        dropdownButtonProps: { onKeyDown: handleTriggerKeyDown },
        dropdownLabel: "More AI actions"
      })}
      {open && (
        <div
          role="menu"
          aria-label="More AI actions"
          className="absolute left-0 top-full z-10 mt-[var(--spacing-6)] min-w-[var(--spacing-120)] rounded-lg border border-[var(--color-border-default)] bg-neutral-white py-[var(--spacing-6)] shadow-lg"
        >
          {items.map((id, index) => {
            const capability = getAICapability(id)!;
            const Icon = capability.icon;
            return (
              <button
                key={id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                className="flex w-full items-center gap-[var(--spacing-8)] px-[var(--spacing-16)] py-[var(--spacing-8)] text-left text-button-md text-[var(--color-text-body)] outline-none hover:bg-[var(--color-background-subtle)] focus:bg-[var(--color-background-subtle)]"
                onClick={() => close(true)}
                onMouseEnter={(e) => e.currentTarget.focus()}
                onKeyDown={(e) => handleItemKeyDown(e, index)}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {capability.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const AI: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Sourced from the Figma 'AI ButtonGroup Component Library' section (Lumen-AI-Design-System, node 969:5761): three Split Button Group AI examples — Primary ('AI Draft'), Secondary ('AI Summarize'), and an Outline instance captioned 'loading state' ('Generating...'). Resolves a previously-deferred gap ('Split Button AI... not built'). No new component or variant was needed: each reuses `SplitButton`'s existing `variant` prop exactly (Secondary's tokens are unchanged from `variant=\"secondary\"`). The Outline instance is *not* wired to the `isLoading` prop — Figma's own rendering shows the AI icon plus the visible label 'Generating...', not `isLoading`'s spinner-replaces-content treatment (confirmed via `get_design_context`: no spinner glyph, no sr-only text), so `isLoading` would have been a pixel mismatch; 'Generating...' is passed as ordinary label content instead. `iconStart` is the existing AI mark and the dropdown menu is built from the existing `ai-capabilities` catalog (Summarize/Rewrite/Fix Grammar/Translate, matching Figma's own dropdown items). `SplitButton` deliberately renders no menu of its own — `onDropdownClick`/`dropdownButtonProps` are wired up by the consumer; the menu here (`AiCapabilityMenu`, defined in this story file only) implements the full WAI-ARIA APG Menu Button keyboard/hover/click-outside pattern, not just a click-to-toggle demo."
      }
    }
  },
  render: () => {
    const items = ["summarize", "rewrite", "fix-grammar", "translate"] as const;
    return (
      <div className="flex flex-wrap items-start gap-10">
        <div className="flex flex-col items-start gap-3">
          <p className="text-body-xs text-[var(--color-text-muted)]">Primary Split · default + related capabilities</p>
          <AiCapabilityMenu
            items={items}
            trigger={({ onDropdownClick, dropdownButtonProps, dropdownLabel }) => (
              <SplitButton
                iconStart={<LmAisymbolIcon className="size-[18px]" />}
                onDropdownClick={onDropdownClick}
                dropdownButtonProps={dropdownButtonProps}
                dropdownLabel={dropdownLabel}
              >
                AI Draft
              </SplitButton>
            )}
          />
        </div>
        <div className="flex flex-col items-start gap-3">
          <p className="text-body-xs text-[var(--color-text-muted)]">Secondary Split</p>
          <AiCapabilityMenu
            items={items}
            trigger={({ onDropdownClick, dropdownButtonProps, dropdownLabel }) => (
              <SplitButton
                variant="secondary"
                iconStart={<LmAisymbolIcon className="size-[18px]" />}
                onDropdownClick={onDropdownClick}
                dropdownButtonProps={dropdownButtonProps}
                dropdownLabel={dropdownLabel}
              >
                AI Summarize
              </SplitButton>
            )}
          />
        </div>
        <div className="flex flex-col items-start gap-3">
          <p className="text-body-xs text-[var(--color-text-muted)]">Outline Split · loading state</p>
          <AiCapabilityMenu
            items={items}
            trigger={({ onDropdownClick, dropdownButtonProps, dropdownLabel }) => (
              <SplitButton
                variant="outline"
                iconStart={<LmAisymbolIcon className="size-[18px]" />}
                onDropdownClick={onDropdownClick}
                dropdownButtonProps={dropdownButtonProps}
                dropdownLabel={dropdownLabel}
              >
                Generating...
              </SplitButton>
            )}
          />
        </div>
      </div>
    );
  }
};

export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <SplitButton disabled variant="primary" dropdownLabel="More save options">
        Save changes
      </SplitButton>
      <SplitButton disabled variant="raised" dropdownLabel="More save options">
        Save changes
      </SplitButton>
      <SplitButton disabled variant="secondary" dropdownLabel="More save options">
        Save changes
      </SplitButton>
      <SplitButton disabled variant="outline" dropdownLabel="More save options">
        Save changes
      </SplitButton>
    </div>
  )
};
