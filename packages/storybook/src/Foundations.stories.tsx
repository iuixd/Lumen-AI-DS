import type { Meta, StoryObj } from "@storybook/react";
import { colorPrimitives, typography, opacity } from "@lumen/tokens";

// Each section renders inside a real `<Story>`/`<Canvas>` — not raw JSX
// directly in Foundations.mdx's body — because only actual story renders get
// their own themed iframe (docs.story.inline: false in preview.tsx) that
// PreviewThemeSync keeps synced to the toolbar's light/dark toggle. Raw MDX
// body content lives in the outer Docs document, which never receives
// `data-theme` (only the separate `data-preview-theme`, used for unrelated
// manager chrome), so `var(--color-*)` there would always resolve against
// `:root`'s light values regardless of the toggle. See PreviewThemeSync.tsx.

// Palette families to render as ramps. Deliberately a curated list, not
// "every top-level group in colorPrimitives" — component-scoped one-off
// groups (badge/button/input/app-shell/code/chat/status) aren't palettes and
// would just add noise here; they're already covered via the semantic-role
// swatches below, which is how a consumer actually reaches them.
const PALETTE_FAMILIES = [
  "neutral",
  "primary",
  "lumen-gray",
  "blue",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "light-blue",
  "purple",
  "deep-purple",
  "pink",
  "cobalt",
  "lumen-dark",
  "nightshade",
  "overlay"
];

const FAMILY_NOTES: Record<string, string> = {
  overlay: "translucent black/white steps, not a hue ramp — backs bg.hover/bg.pressed/bg.overlay.",
  purple: "PENDING REPLACEMENT — not a current Figma collection, see primitives/color.json comment.",
  "deep-purple": "PENDING REPLACEMENT — not a current Figma collection, see primitives/color.json comment.",
  pink: "PENDING REPLACEMENT — not a current Figma collection, see primitives/color.json comment.",
  cobalt: "PENDING REPLACEMENT — not a current Figma collection, see primitives/color.json comment."
};

function kebabColorKey(key: string) {
  return key.replace(/[._]/g, "-");
}

function PalettesDemo() {
  const families = PALETTE_FAMILIES.map((family) => ({
    family,
    steps: Object.keys(colorPrimitives).filter((key) => key.startsWith(`${family}.`))
  })).filter(({ steps }) => steps.length > 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {families.map(({ family, steps }) => (
        <div key={family}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, marginBottom: 4, color: "var(--color-text-body)" }}>
            {family}
            {FAMILY_NOTES[family] && <span style={{ color: "var(--color-text-secondary)" }}> — {FAMILY_NOTES[family]}</span>}
          </div>
          <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 4 }}>
            {steps.map((key) => (
              <div key={key} style={{ textAlign: "center", flex: "0 0 auto" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: `var(--color-${kebabColorKey(key)})`,
                    border: "1px solid var(--color-border-default)",
                    borderRadius: "var(--radius-sm)"
                  }}
                />
                <div
                  style={{
                    fontSize: 9,
                    marginTop: 2,
                    color: "var(--color-text-secondary)",
                    maxWidth: 44,
                    overflowWrap: "anywhere"
                  }}
                >
                  {key.slice(family.length + 1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const COLOR_ROLES: [string, string][] = [
  ["background.default", "--color-background-default"],
  ["background.app", "--color-background-app"],
  ["background.raised", "--color-background-raised"],
  ["background.hover", "--color-background-hover"],
  ["background.disabled", "--color-background-disabled"],
  ["text.title", "--color-text-title"],
  ["text.body", "--color-text-body"],
  ["text.link", "--color-text-link"],
  ["text.danger", "--color-text-danger"],
  ["border.default", "--color-border-default"],
  ["border.focus", "--color-border-focus"],
  ["brand.default", "--color-brand-default"],
  ["status.success", "--color-status-success"],
  ["status.warning", "--color-status-warning"],
  ["status.error", "--color-status-error"],
  ["status.info", "--color-status-info"]
];

function ColorRolesDemo() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
      {COLOR_ROLES.map(([label, varName]) => (
        <div
          key={varName}
          style={{ border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}
        >
          <div style={{ height: 48, background: `var(${varName})` }} />
          <div style={{ padding: 8, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-body)" }}>
            {label}
            <br />
            <span style={{ color: "var(--color-text-secondary)" }}>{varName}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function FontFamiliesDemo() {
  const keys = Object.keys(typography.fontFamily);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {keys.map((key) => {
        const stack = (typography.fontFamily as Record<string, { value: readonly string[] }>)[key].value;
        return (
          <div key={key} style={{ borderBottom: "1px solid var(--color-border-default)", paddingBottom: 12 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-text-secondary)" }}>
              --font-{key} <span style={{ color: "var(--color-text-tertiary)" }}>({stack.join(", ")})</span>
            </div>
            <div style={{ fontFamily: `var(--font-${key})`, fontSize: 24, color: "var(--color-text-title)" }}>
              Lumen AI Design System — abcdefghijklm 0123456789
            </div>
          </div>
        );
      })}
    </div>
  );
}

const TYPOGRAPHY_TIERS: [string, boolean][] = [
  ["display-lg", true],
  ["display-md", true],
  ["display-sm", true],
  ["headline-lg", true],
  ["headline-md", true],
  ["headline-sm", false],
  ["title-lg", false],
  ["body-lg", false],
  ["body-md", false],
  ["standard-button-xl", true],
  ["standard-button-sm", true]
];

function TypographyDemo() {
  return (
    <table style={{ color: "var(--color-text-body)" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left" }}>Tier</th>
          <th style={{ textAlign: "left" }}>Sample</th>
          <th style={{ textAlign: "left" }}>Responsive</th>
        </tr>
      </thead>
      <tbody>
        {TYPOGRAPHY_TIERS.map(([tier, responsive]) => (
          <tr key={tier}>
            <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, paddingRight: 16 }}>{tier}</td>
            <td>
              <span
                style={{
                  fontFamily: "var(--font-interface)",
                  fontSize: `var(--text-${tier}-size)`,
                  lineHeight: `var(--text-${tier}-line-height)`,
                  fontWeight: `var(--text-${tier}-weight)`
                }}
              >
                Lumen AI Design System
              </span>
            </td>
            <td style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{responsive ? "tablet/mobile" : "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const RADIUS_KEYS = ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "pill"];

function RadiusDemo() {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {RADIUS_KEYS.map((key) => (
        <div key={key} style={{ textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: "var(--color-background-subtle)",
              border: "1px solid var(--color-border-default)",
              borderRadius: `var(--radius-${key})`
            }}
          />
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, marginTop: 4, color: "var(--color-text-body)" }}>
            {key}
          </div>
        </div>
      ))}
    </div>
  );
}

const MOTION_DURATIONS: [string, string][] = [
  ["duration.instant", "--duration-instant"],
  ["duration.fast", "--duration-fast"],
  ["duration.moderate", "--duration-moderate"],
  ["duration.slow", "--duration-slow"],
  ["duration.slower", "--duration-slower"]
];

function MotionDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {MOTION_DURATIONS.map(([label, varName]) => (
        <div key={varName} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 160, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-text-body)" }}>
            {label}
          </div>
          <div style={{ flex: 1, height: 8, background: "var(--color-background-subtle)", borderRadius: "var(--radius-pill)" }}>
            <div
              key={varName}
              className="lumen-foundations-motion-bar"
              style={{
                height: "100%",
                width: "100%",
                background: "var(--color-brand-default)",
                borderRadius: "var(--radius-pill)",
                animation: `lumen-foundations-motion-sweep var(${varName}) var(--easing-standard) infinite alternate`
              }}
            />
          </div>
        </div>
      ))}
      <style>{`
        @keyframes lumen-foundations-motion-sweep {
          from { transform: scaleX(0.1); transform-origin: left; }
          to { transform: scaleX(1); transform-origin: left; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lumen-foundations-motion-bar { animation: none; }
        }
      `}</style>
    </div>
  );
}

const SIZE_TOKENS: [string, string, string][] = [
  ["size.header-h", "--size-header-h", "AppShell"],
  ["size.nav-expanded", "--size-nav-expanded", "SideNav"],
  ["size.nav-collapsed", "--size-nav-collapsed", "SideNav"],
  ["size.ai-panel-w", "--size-ai-panel-w", "AppShell"],
  ["size.footer-h", "--size-footer-h", "declared only"],
  ["size.icon-sm", "--size-icon-sm", "declared only"],
  ["size.icon-md", "--size-icon-md", "declared only"],
  ["size.icon-lg", "--size-icon-lg", "declared only"],
  ["size.avatar-sm", "--size-avatar-sm", "declared only"],
  ["size.avatar-md", "--size-avatar-md", "declared only"],
  ["size.avatar-lg", "--size-avatar-lg", "declared only"],
  ["size.touch-target", "--size-touch-target", "declared only"]
];

function SizeDemo() {
  return (
    <table style={{ color: "var(--color-text-body)" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left" }}>Token</th>
          <th style={{ textAlign: "left" }}>Value</th>
          <th style={{ textAlign: "left" }}>Consumed by</th>
        </tr>
      </thead>
      <tbody>
        {SIZE_TOKENS.map(([label, varName, consumer]) => (
          <tr key={varName}>
            <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, paddingRight: 16 }}>{label}</td>
            <td style={{ fontFamily: "var(--font-mono)", fontSize: 12, paddingRight: 16 }}>var({varName})</td>
            <td style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{consumer}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OpacityDemo() {
  const keys = Object.keys(opacity).filter((k) => k !== "_comment");
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {keys.map((key) => (
        <div key={key} style={{ textAlign: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "var(--color-brand-default)",
              opacity: `var(--opacity-${key})`,
              borderRadius: "var(--radius-sm)"
            }}
          />
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, marginTop: 4, color: "var(--color-text-body)" }}>
            {key}
          </div>
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: "Foundations",
  parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Palettes: Story = { render: () => <PalettesDemo /> };
export const FontFamilies: Story = { render: () => <FontFamiliesDemo /> };
export const ColorRoles: Story = { render: () => <ColorRolesDemo /> };
export const Typography: Story = { render: () => <TypographyDemo /> };
export const Radius: Story = { render: () => <RadiusDemo /> };
export const Motion: Story = { render: () => <MotionDemo /> };
export const Size: Story = { render: () => <SizeDemo /> };
export const Opacity: Story = { render: () => <OpacityDemo /> };
