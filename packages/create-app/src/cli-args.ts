import { parseArgs } from "node:util";

export interface CliFlags {
  name?: string;
  includePatterns?: boolean;
  installDeps?: boolean;
}

/**
 * Parses the required CI flags (--name, --patterns/--no-patterns, --install/--no-install)
 * into tri-state values: `undefined` means "not supplied, prompt interactively instead".
 * Kept separate from cli.ts (which also drives interactive prompts and process exit codes)
 * so non-interactive argument handling is unit-testable without spawning a process.
 *
 * `pnpm run <script> -- <args>` and `pnpm --filter <pkg> <script> -- <args>` disagree on
 * whether the literal "--" separator reaches the script's argv (observed: the root
 * `create:react` script strips it, but `pnpm --filter @lumen/create-app start -- <args>`
 * does not). node:util's parseArgs treats a bare "--" as its own POSIX positional-args
 * marker, which would otherwise swallow every flag after it as an unrecognized
 * positional. Since none of our flags can legitimately be the literal string "--",
 * stripping it unconditionally handles both invocation shapes identically.
 */
export function parseCliFlags(argv: string[]): CliFlags {
  const { values } = parseArgs({
    args: argv.filter((arg) => arg !== "--"),
    options: {
      name: { type: "string" },
      patterns: { type: "boolean" },
      "no-patterns": { type: "boolean" },
      install: { type: "boolean" },
      "no-install": { type: "boolean" }
    },
    strict: true
  });

  return {
    name: values.name,
    includePatterns: values.patterns ? true : values["no-patterns"] ? false : undefined,
    installDeps: values.install ? true : values["no-install"] ? false : undefined
  };
}
