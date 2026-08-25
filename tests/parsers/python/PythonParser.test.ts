import { describe, expect, test } from "vitest";
import { PythonParser } from "../../../src/parsers/python/PythonParser.js";
import type { Parser } from "../../../src/core/Parser.js";

describe("PythonParser", () => {
  const parser: Parser = new PythonParser();

  test("recognizes a Python traceback", () => {
    const output = `Traceback (most recent call last):
  File "app.py", line 7, in <module>
    print(user.name)
NameError: name 'user' is not defined`;

    expect(parser.canParse(output)).toBe(true);
  });

  test("parses a Python error with file location", () => {
    const output = `Traceback (most recent call last):
  File "app.py", line 7, in <module>
    print(user.name)
NameError: name 'user' is not defined`;

    const result = parser.parse(output);

    expect(result).not.toBeNull();

    expect(result?.type).toBe("NameError");

    expect(result?.message).toBe(
      "name 'user' is not defined"
    );

    expect(result?.file).toBe("app.py");
    expect(result?.line).toBe(7);
  });

  test("parses a Python TypeError", () => {
    const output = `Traceback (most recent call last):
  File "app.py", line 12, in <module>
    print(len(value))
TypeError: object of type 'NoneType' has no len()`;

    const result = parser.parse(output);

    expect(result).not.toBeNull();

    expect(result?.type).toBe("TypeError");

    expect(result?.message).toBe(
      "object of type 'NoneType' has no len()"
    );

    expect(result?.file).toBe("app.py");
    expect(result?.line).toBe(12);
  });

  test("parses a Python error without a location", () => {
    const output =
      "ValueError: invalid value";

    const result = parser.parse(output);

    expect(result).not.toBeNull();

    expect(result?.type).toBe("ValueError");

    expect(result?.message).toBe("invalid value");
  });

  test("returns false for non-Python output", () => {
    const output = "Application completed successfully";

    expect(parser.canParse(output)).toBe(false);
  });

  test("returns null for non-Python output", () => {
    const output = "Application completed successfully";

    const result = parser.parse(output);

    expect(result).toBeNull();
  });

  test("implements the Parser contract", () => {
    const genericParser: Parser = new PythonParser();

    expect(
      genericParser.canParse(
        "Traceback (most recent call last):"
      )
    ).toBe(true);

    const result = genericParser.parse(
      `Traceback (most recent call last):
  File "app.py", line 5, in <module>
NameError: name 'x' is not defined`
    );

    expect(result).not.toBeNull();
    expect(result?.type).toBe("NameError");
  });
});