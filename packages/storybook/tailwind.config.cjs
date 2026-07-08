const lumenPreset = require("@lumen/tokens/tailwind-preset");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [lumenPreset],
  content: [
    "../ui/src/**/*.{ts,tsx,mdx}",
    "../patterns/src/**/*.{ts,tsx,mdx}",
    "./.storybook/**/*.{ts,tsx,mdx}",
    "./src/**/*.{ts,tsx,mdx}"
  ]
};
