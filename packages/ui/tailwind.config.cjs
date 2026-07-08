const tokensPreset = require("@lumen/tokens/tailwind-preset");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [tokensPreset],
  content: ["./src/**/*.{ts,tsx}"]
};
