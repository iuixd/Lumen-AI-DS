import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";

// Storybook's own app chrome (sidebar/toolbar) — not the Lumen design
// system's own component colors, which stay on their own brand palette and
// are toggled separately via the light/dark switcher in the toolbar.
addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Lumen Design System",
    brandImage: "./lumen-ds-logo.svg",
    brandUrl: "./",
    brandTarget: "_self",
    colorSecondary: "#0096B7",
    // Sidebar.tsx uses `theme.background.app` (this key) exclusively for
    // the left navigation panel's background — no other chrome region
    // reads it, so this only recolors the sidebar.
    appBg: "#EDF0F1",
    // Layout.tsx's ContentContainer (the Docs/Story page area, to the
    // right of the sidebar) and the addon panel both read
    // `theme.background.content` (this key) — Storybook doesn't expose a
    // Docs-page-only background key.
    appContentBg: "#EDF0F1",
    // The top canvas toolbar and the addon-panel tab-strip header both
    // read `theme.barBg` (bar.tsx's `Bar` component) — a separate key
    // from appBg/appContentBg above, left at Storybook's stock white
    // until now.
    barBg: "#EDF0F1",
    barSelectedColor: "#0096B7",
    barHoverColor: "#0096B7"
    // Controls addon panel's shadow/bevel + radius are handled in
    // manager-head.html instead of here — `inputBorder`/`inputBorderRadius`
    // type-check against ThemeVars but the Controls addon's Form.Textarea/
    // Form.Select don't actually consume them, so they were a no-op.
  })
});
