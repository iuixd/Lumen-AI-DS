const tokensPreset = require("@lumen/tokens/dist/tailwind-preset.cjs");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [tokensPreset],
  content: ["./src/**/*.{ts,tsx}"]
};
