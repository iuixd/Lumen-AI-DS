import { describe, expect, it } from "vitest";
import { aiCapabilities, getAICapability } from "./ai-capabilities";

describe("aiCapabilities", () => {
  it("has a non-empty label, description, category, analyticsEvent, and icon for every entry", () => {
    expect(aiCapabilities.length).toBeGreaterThan(0);
    for (const capability of aiCapabilities) {
      expect(capability.id).toBeTruthy();
      expect(capability.label).toBeTruthy();
      expect(capability.description).toBeTruthy();
      expect(capability.category).toBeTruthy();
      expect(capability.analyticsEvent).toBeTruthy();
      expect(capability.icon).toBeTruthy();
    }
  });

  it("has unique ids", () => {
    const ids = aiCapabilities.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("getAICapability", () => {
  it("returns the matching entry for a known id", () => {
    expect(getAICapability("summarize")?.label).toBe("Summarize");
  });

  it("returns undefined for an unknown id", () => {
    expect(getAICapability("not-a-real-capability")).toBeUndefined();
  });
});
