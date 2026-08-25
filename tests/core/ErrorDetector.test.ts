import { describe, expect, test } from "vitest";
import { ErrorDetector } from "../../src/core/ErrorDetector";

describe("ErrorDetector", () => {
  const detector = new ErrorDetector();

  test("detects a generic Error", () => {
    const output = "Error: Something went wrong";

    expect(detector.detect(output)).toBe(true);
  });

  test("detects a TypeError", () => {
    const output = "TypeError: Cannot read properties of undefined";

    expect(detector.detect(output)).toBe(true);
  });

  test("detects a ReferenceError", () => {
    const output = "ReferenceError: variable is not defined";

    expect(detector.detect(output)).toBe(true);
  });

  test("detects a SyntaxError", () => {
    const output = "SyntaxError: Unexpected token";

    expect(detector.detect(output)).toBe(true);
  });

  test("does not detect normal application output", () => {
    const output = "Server started successfully";

    expect(detector.detect(output)).toBe(false);
  });

  test("does not detect empty output", () => {
    const output = "";

    expect(detector.detect(output)).toBe(false);
  });
});