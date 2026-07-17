import { spawn } from "node:child_process";

/**
 * Runs a command with inherited stdio and an argument array (never a concatenated
 * shell string). `shell: true` is scoped to Windows only, where pnpm/corepack are
 * .cmd shims that the plain (non-shell) spawn path can't launch directly — Node
 * still quotes each array element for the shell itself, so this doesn't reopen
 * the shell-injection risk a manually built command string would.
 */
export function runCommand(command: string, args: string[], options: { cwd: string }): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      stdio: "inherit",
      shell: process.platform === "win32"
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`"${command} ${args.join(" ")}" exited with code ${code}`));
      }
    });
  });
}
