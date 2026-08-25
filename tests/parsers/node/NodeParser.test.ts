import { describe, expect, test } from "vitest";
import { NodeParser } from "../../../src/parsers/node/NodeParser";
import type { Parser } from "../../../src/core/Parser";

describe("NodeParser", () => {
  const parser: Parser = new NodeParser();

  test("parses a Node.js error with file location", () => {
    const output = `TypeError: Cannot read properties of undefined
    at calculate (/app/index.js:10:5)
    at processData (/app/index.js:20:3)`;

    const result = parser.parse(output);

    expect(result).not.toBeNull();

    expect(result?.type).toBe("TypeError");
    expect(result?.message).toBe(
      "Cannot read properties of undefined"
    );
    expect(result?.file).toBe("/app/index.js");
    expect(result?.line).toBe(10);
    expect(result?.column).toBe(5);
  });

  test("parses an error without a stack trace", () => {
    const output = "Error: Something went wrong";

    const result = parser.parse(output);

    expect(result).not.toBeNull();

    expect(result?.type).toBe("Error");
    expect(result?.message).toBe("Something went wrong");
  });

  test("returns null for non-error output", () => {
    const output = "Server started successfully";

    const result = parser.parse(output);

    expect(result).toBeNull();
  });

  test("returns null for empty output", () => {
    const result = parser.parse("");

    expect(result).toBeNull();
  });

  test("implements the Parser contract", () => {
    const genericParser: Parser = new NodeParser();

    const result = genericParser.parse(
      "ReferenceError: something is not defined"
    );

    expect(result).not.toBeNull();
    expect(result?.type).toBe("ReferenceError");
    expect(result?.message).toBe("something is not defined");
  });
});