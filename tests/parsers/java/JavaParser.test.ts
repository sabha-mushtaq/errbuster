import { describe, expect, test } from "vitest";
import { JavaParser } from "../../../src/parsers/java/JavaParser.js";
import type { Parser } from "../../../src/core/Parser.js";

describe("JavaParser", () => {
  const parser: Parser = new JavaParser();

  test("recognizes a Java exception", () => {
    const output = `Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.length()" because "value" is null
    at Main.main(Main.java:10)`;

    expect(parser.canParse(output)).toBe(true);
  });

  test("parses a Java exception with file location", () => {
    const output = `Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.length()" because "value" is null
    at Main.main(Main.java:10)`;

    const result = parser.parse(output);

    expect(result).not.toBeNull();

    expect(result?.type).toBe(
      "java.lang.NullPointerException"
    );

    expect(result?.message).toBe(
      'Cannot invoke "String.length()" because "value" is null'
    );

    expect(result?.file).toBe("Main.java");
    expect(result?.line).toBe(10);
  });

  test("parses a Java exception without a stack trace", () => {
    const output =
      "java.lang.IllegalArgumentException: Invalid value";

    const result = parser.parse(output);

    expect(result).not.toBeNull();

    expect(result?.type).toBe(
      "java.lang.IllegalArgumentException"
    );

    expect(result?.message).toBe("Invalid value");
  });

  test("returns false for non-Java output", () => {
    const output = "Application completed successfully";

    expect(parser.canParse(output)).toBe(false);
  });

  test("returns null for non-Java output", () => {
    const output = "Application completed successfully";

    const result = parser.parse(output);

    expect(result).toBeNull();
  });

  test("implements the Parser contract", () => {
    const genericParser: Parser = new JavaParser();

    expect(genericParser.canParse(
      "java.lang.NullPointerException: Something went wrong"
    )).toBe(true);

    const result = genericParser.parse(
      "java.lang.NullPointerException: Something went wrong"
    );

    expect(result).not.toBeNull();
  });
});