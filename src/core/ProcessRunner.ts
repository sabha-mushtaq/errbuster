import { spawn } from "node:child_process";

export interface ProcessResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  signal: NodeJS.Signals | null;
}

export function runProcess(
  command: string,
  args: string[] = []
): Promise<ProcessResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["inherit", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    // Normal application output:
    // capture it AND immediately show it to the developer.
    child.stdout.on("data", (data: Buffer) => {
      const output = data.toString();

      stdout += output;

      process.stdout.write(output);
    });

    // Error/diagnostic output:
    // capture it, but don't immediately print it.
    // ErrBuster will decide how to present it.
    child.stderr.on("data", (data: Buffer) => {
      const output = data.toString();

      stderr += output;
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (exitCode, signal) => {
      resolve({
        stdout,
        stderr,
        exitCode,
        signal,
      });
    });
  });
}