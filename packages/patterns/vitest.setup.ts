import "@testing-library/jest-dom/vitest";

// jsdom has no layout engine and doesn't implement ResizeObserver — Radix
// Checkbox's `useSize` hook (used by EnterpriseLoginPage's "Remember this
// device"/"Trust this device" checkboxes) observes it on mount. Mirrors
// @lumen/ui's own vitest.setup.ts stub (same underlying shadcn/Radix
// primitives, now consumed here too for the first time). A no-op stub is
// sufficient since layout/size values are never asserted on in jsdom-based
// tests.
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
