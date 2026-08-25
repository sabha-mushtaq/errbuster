import { spawn } from "node:child_process";

export interface ProcessResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
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

    child.stdout.on("data", (data: Buffer) => {
      const output = data.toString();

      stdout += output;

      // Pass normal application output to the user's terminal
      process.stdout.write(output);
    });

    child.stderr.on("data", (data: Buffer) => {
      const output = data.toString();

      stderr += output;

      // Pass error/diagnostic output to the user's terminal
      process.stderr.write(output);
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (exitCode) => {
      resolve({
        stdout,
        stderr,
        exitCode,
      });
    });
  });
}