import { describe, expect, test } from "vitest";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { ErrLogStore } from "../../src/storage/ErrLogStore";
import type { ErrorRecord } from "../../src/core/ErrorRecord";

describe("ErrLogStore", () => {
  test("creates errlog.md and stores an error", async () => {
    const directory = await mkdtemp(join(tmpdir(), "errbuster-"));
    const filePath = join(directory, "errlog.md");

    try {
      const store = new ErrLogStore(filePath);

      const error: ErrorRecord = {
        type: "TypeError",
        message: "Cannot read properties of undefined",
        file: "/app/index.js",
        line: 10,
        column: 5,
      };

      await store.store(error);

      const content = await readFile(filePath, "utf8");

      expect(content).toContain("# ErrBuster Error Log");
      expect(content).toContain("**Type:** TypeError");
      expect(content).toContain(
        "**Message:** Cannot read properties of undefined"
      );
      expect(content).toContain("**File:** /app/index.js");
      expect(content).toContain("**Line:** 10");
      expect(content).toContain("**Column:** 5");
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  test("appends a second error instead of overwriting the first", async () => {
    const directory = await mkdtemp(join(tmpdir(), "errbuster-"));
    const filePath = join(directory, "errlog.md");

    try {
      const store = new ErrLogStore(filePath);

      const firstError: ErrorRecord = {
        type: "TypeError",
        message: "First error",
      };

      const secondError: ErrorRecord = {
        type: "ReferenceError",
        message: "Second error",
      };

      await store.store(firstError);
      await store.store(secondError);

      const content = await readFile(filePath, "utf8");

      expect(content).toContain("First error");
      expect(content).toContain("Second error");

      expect(
        content.indexOf("First error")
      ).toBeLessThan(
        content.indexOf("Second error")
      );
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });

  test("stores the stack trace when available", async () => {
    const directory = await mkdtemp(join(tmpdir(), "errbuster-"));
    const filePath = join(directory, "errlog.md");

    try {
      const store = new ErrLogStore(filePath);

      const error: ErrorRecord = {
        type: "Error",
        message: "Something went wrong",
        stack: `Error: Something went wrong
    at calculate (/app/index.js:10:5)`,
      };

      await store.store(error);

      const content = await readFile(filePath, "utf8");

      expect(content).toContain("### Stack");
      expect(content).toContain("Error: Something went wrong");
      expect(content).toContain(
        "at calculate (/app/index.js:10:5)"
      );
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});