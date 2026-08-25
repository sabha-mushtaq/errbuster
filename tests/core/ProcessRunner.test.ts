import { describe, expect, test } from "vitest";
import { runProcess } from "../../src/core/ProcessRunner";

describe("ProcessRunner", () => {
  test("captures stdout, stderr, and exit code from a failed child process", async () => {
    const result = await runProcess("node", [
      "-e",
      `
        console.log("Hello from child");
        console.error("Something went wrong");
        process.exit(1);
      `,
    ]);

    expect(result.stdout).toContain("Hello from child");
    expect(result.stderr).toContain("Something went wrong");
    expect(result.exitCode).toBe(1);
  });

  test("reports exit code 0 when the child process succeeds", async () => {
    const result = await runProcess("node", [
      "-e",
      `
        console.log("Application completed successfully");
        process.exit(0);
      `,
    ]);

    expect(result.stdout).toContain("Application completed successfully");
    expect(result.stderr).toBe("");
    expect(result.exitCode).toBe(0);
  });

  test("does not reject when the child process exits with a non-zero exit code", async () => {
    const result = await runProcess("node", [
      "-e",
      `
        console.error("Child failed");
        process.exit(1);
      `,
    ]);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Child failed");
  });
});