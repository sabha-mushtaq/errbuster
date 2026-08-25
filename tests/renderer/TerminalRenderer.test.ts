import { describe, expect, test } from "vitest";
import { TerminalRenderer } from "../../src/renderer/TerminalRenderer";
import type { ErrorRecord } from "../../src/core/ErrorRecord";

describe("TerminalRenderer", () => {
  const renderer = new TerminalRenderer();

  test("renders an error with complete information", () => {
    const error: ErrorRecord = {
      type: "TypeError",
      message: "Cannot read properties of undefined",
      file: "/app/index.js",
      line: 10,
      column: 5,
    };

    const result = renderer.render(error);

    expect(result).toContain("ERRBUSTER • ERROR");

    expect(result).toContain("Type");
    expect(result).toContain("TypeError");

    expect(result).toContain("Message");
    expect(result).toContain(
      "Cannot read properties of undefined"
    );

    expect(result).toContain("File");
    expect(result).toContain("/app/index.js");

    expect(result).toContain("Location");
    expect(result).toContain("10:5");
  });

  test("renders the stack trace when it is available", () => {
    const error: ErrorRecord = {
      type: "TypeError",
      message: "Something went wrong",
      stack: `TypeError: Something went wrong
    at calculate (/app/index.js:10:5)`,
    };

    const result = renderer.render(error);

    expect(result).toContain("Stack Trace");

    expect(result).toContain(
      "TypeError: Something went wrong"
    );

    expect(result).toContain(
      "at calculate (/app/index.js:10:5)"
    );
  });

  test("renders an error with only required information", () => {
    const error: ErrorRecord = {
      type: "Error",
      message: "Something went wrong",
    };

    const result = renderer.render(error);

    expect(result).toContain("ERRBUSTER • ERROR");

    expect(result).toContain("Type");
    expect(result).toContain("Error");

    expect(result).toContain("Message");
    expect(result).toContain(
      "Something went wrong"
    );

    expect(result).not.toContain("File");
    expect(result).not.toContain("Location");
    expect(result).not.toContain("Stack Trace");
  });
});