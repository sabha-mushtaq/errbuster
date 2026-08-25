import { describe, expect, test } from "vitest";
import type { ErrorRecord } from "../../src/core/ErrorRecord";

describe("ErrorRecord", () => {
  test("represents an error with all available information", () => {
    const error: ErrorRecord = {
      type: "TypeError",
      message: "Cannot read properties of undefined",
      stack: "TypeError: Cannot read properties of undefined\n    at app.js:10:5",
      file: "app.js",
      line: 10,
      column: 5,
    };

    expect(error.type).toBe("TypeError");
    expect(error.message).toBe(
      "Cannot read properties of undefined"
    );
    expect(error.file).toBe("app.js");
    expect(error.line).toBe(10);
    expect(error.column).toBe(5);
  });

  test("allows an error with only required information", () => {
    const error: ErrorRecord = {
      type: "Error",
      message: "Something went wrong",
    };

    expect(error.type).toBe("Error");
    expect(error.message).toBe("Something went wrong");
    expect(error.stack).toBeUndefined();
    expect(error.file).toBeUndefined();
    expect(error.line).toBeUndefined();
    expect(error.column).toBeUndefined();
  });
});