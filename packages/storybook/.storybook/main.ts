import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  staticDirs: ["../public"],
  stories: [
    "../src/**/*.mdx",
    "../../ui/src/**/*.stories.@(ts|tsx)",
    "../../ui/src/**/*.mdx",
    "../../patterns/src/**/*.mdx",
    "../../patterns/src/**/*.stories.@(ts|tsx)"
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-links",
    "@storybook/addon-a11y",
    "@storybook/addon-themes"
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  docs: {
    autodocs: "tag"
  },
  managerHead: (head) => `${head}
    <style>
      img[src="./lumen-ds-logo.svg"] {
        display: block;
        width: auto;
        height: 40px;
        object-fit: contain;
        object-position: left center;
      }

      #storybook-explorer-tree [aria-current="page"],
      #storybook-explorer-tree [data-selected="true"] {
        background-color: #ffffff !important;
        color: #1e2021 !important;
      }

      #storybook-explorer-tree a:hover:not([aria-current="page"]),
      #storybook-explorer-tree button:hover:not([aria-current="page"]),
      #storybook-explorer-tree [data-item-id]:hover:not([data-selected="true"]) {
        background-color: #f3f5f6 !important;
      }

      #storybook-explorer-tree [aria-current="page"]:hover,
      #storybook-explorer-tree [data-selected="true"]:hover,
      #storybook-explorer-tree [data-item-id]:has([aria-current="page"]):hover,
      #storybook-explorer-tree [data-item-id]:has([data-selected="true"]):hover {
        background-color: #ffffff !important;
      }

      #storybook-explorer-tree a:focus-visible,
      #storybook-explorer-tree button:focus-visible {
        outline-color: #0096b7 !important;
      }
    </style>
  `,
  typescript: {
    reactDocgen: "react-docgen-typescript"
  }
};

export default config;
