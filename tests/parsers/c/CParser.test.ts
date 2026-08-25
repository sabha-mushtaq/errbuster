import { describe, expect, test } from "vitest";
import { CParser } from "../../../src/parsers/c/CParser.js";
import type { Parser } from "../../../src/core/Parser.js";

describe("CParser", () => {
  const parser: Parser = new CParser();

  test("recognizes a C compiler error", () => {
    const output =
      "main.c:10:5: error: expected ';' before '}'";

    expect(parser.canParse(output)).toBe(true);
  });

  test("parses a C compiler error with location", () => {
    const output =
      "main.c:10:5: error: expected ';' before '}'";

    const result = parser.parse(output);

    expect(result).not.toBeNull();

    expect(result?.type).toBe("CError");
    expect(result?.message).toBe(
      "expected ';' before '}'"
    );
    expect(result?.file).toBe("main.c");
    expect(result?.line).toBe(10);
    expect(result?.column).toBe(5);
  });

  test("recognizes a segmentation fault", () => {
    const output = "Segmentation fault";

    expect(parser.canParse(output)).toBe(true);
  });
test("does not recognize C++ compiler output", () => {
  const output =
    "main.cpp:10:5: error: expected ';' at end of declaration";

  expect(parser.canParse(output)).toBe(false);
});
  test("parses a segmentation fault", () => {
    const output = "Segmentation fault";

    const result = parser.parse(output);

    expect(result).not.toBeNull();

    expect(result?.type).toBe("SegmentationFault");
    expect(result?.message).toBe("Segmentation fault");
  });

  test("returns false for non-C output", () => {
    const output = "Application completed successfully";

    expect(parser.canParse(output)).toBe(false);
  });

  test("returns null for unsupported output", () => {
    const output = "Application completed successfully";

    const result = parser.parse(output);

    expect(result).toBeNull();
  });

  test("implements the Parser contract", () => {
    const genericParser: Parser = new CParser();

    expect(
      genericParser.canParse(
        "main.c:10:5: error: something went wrong"
      )
    ).toBe(true);

    const result = genericParser.parse(
      "main.c:10:5: error: something went wrong"
    );

    expect(result).not.toBeNull();
  });
});