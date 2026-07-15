import type { Preview } from "@storybook/react";
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import { PreviewThemeSync } from "./PreviewThemeSync";
import "./tailwind.css";

const preview: Preview = {
  parameters: {
    layout: "padded",
    docs: {
      container: PreviewThemeSync,
      canvas: { withToolbar: true },
      // Default (inline: true) renders each <Canvas> story directly inside
      // the docs page's own DOM instead of its own document, so it never
      // picks up the decorator/tailwind.css background — the light/dark
      // toggle has no visible effect inside Canvas boxes. Forcing a real
      // per-story iframe (matching the standalone Canvas tab) fixes that.
      story: { inline: false, iframeHeight: 120 }
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Foundations",
          "Primitives",
          "AI Components",
          "Composite",
          "Layout",
          "Patterns"
        ]
      }
    }
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { light: "light", dark: "dark" },
      defaultTheme: "light",
      attributeName: "data-theme"
    })
  ]
};

export default preview;
