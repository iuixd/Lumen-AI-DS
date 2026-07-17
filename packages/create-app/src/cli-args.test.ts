import { describe, expect, it } from "vitest";
import { parseCliFlags } from "./cli-args.js";

describe("parseCliFlags", () => {
  it("parses --name, --patterns, and --no-install", () => {
    const flags = parseCliFlags(["--name", "ci-lumen-react-app", "--patterns", "--no-install"]);

    expect(flags).toEqual({
      name: "ci-lumen-react-app",
      includePatterns: true,
      installDeps: false
    });
  });

  it("parses --no-patterns and --install", () => {
    const flags = parseCliFlags(["--name", "demo", "--no-patterns", "--install"]);

    expect(flags.includePatterns).toBe(false);
    expect(flags.installDeps).toBe(true);
  });

  it("leaves unsupplied flags undefined so the caller knows to prompt", () => {
    const flags = parseCliFlags([]);

    expect(flags.name).toBeUndefined();
    expect(flags.includePatterns).toBeUndefined();
    expect(flags.installDeps).toBeUndefined();
  });

  it("rejects unrecognized flags", () => {
    expect(() => parseCliFlags(["--not-a-real-flag"])).toThrow();
  });

  it("strips a leading '--' separator (pnpm --filter <pkg> <script> -- <args> forwards it literally)", () => {
    const flags = parseCliFlags(["--", "--name", "ci-lumen-react-app", "--patterns", "--no-install"]);

    expect(flags).toEqual({
      name: "ci-lumen-react-app",
      includePatterns: true,
      installDeps: false
    });
  });
});
