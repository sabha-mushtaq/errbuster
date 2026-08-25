import { describe, expect, test } from "vitest";
import { CppParser } from "../../../src/parsers/cpp/CppParser.js";
import type { Parser } from "../../../src/core/Parser.js";

describe("CppParser", () => {
  const parser: Parser = new CppParser();

  test("parses a C++ compiler error with file location", () => {
    const output = `main.cpp:10:5: error: expected ';' before '}'
    10 |     return 0
       |     ^
`;

    const result = parser.parse(output);

    expect(result).not.toBeNull();

    expect(result?.type).toBe("CppError");
    expect(result?.message).toBe(
      "expected ';' before '}'"
    );
    expect(result?.file).toBe("main.cpp");
    expect(result?.line).toBe(10);
    expect(result?.column).toBe(5);
  });

  test("parses a C++ fatal error", () => {
    const output =
      "main.cpp:3:10: fatal error: 'missing.h' file not found";

    const result = parser.parse(output);

    expect(result).not.toBeNull();

    expect(result?.type).toBe("CppError");
    expect(result?.message).toBe(
      "'missing.h' file not found"
    );
    expect(result?.file).toBe("main.cpp");
    expect(result?.line).toBe(3);
    expect(result?.column).toBe(10);
  });

  test("parses a C++ warning", () => {
    const output =
      "main.cpp:8:9: warning: unused variable 'value'";

    const result = parser.parse(output);

    expect(result).not.toBeNull();

    expect(result?.type).toBe("CppError");
    expect(result?.message).toBe(
      "unused variable 'value'"
    );
    expect(result?.file).toBe("main.cpp");
    expect(result?.line).toBe(8);
    expect(result?.column).toBe(9);
  });

  test("recognizes C++ compiler output", () => {
    const output =
      "main.cpp:10:5: error: expected ';' before '}'";

    expect(parser.canParse(output)).toBe(true);
  });
  

  test("returns false for normal application output", () => {
    const output =
      "C++ application completed successfully";

    expect(parser.canParse(output)).toBe(false);
  });

  test("returns null for non-error output", () => {
    const output =
      "C++ application completed successfully";

    const result = parser.parse(output);

    expect(result).toBeNull();
  });
  test("does not recognize C compiler output", () => {
  const output =
    "main.c:10:5: error: expected ';'";

  expect(parser.canParse(output)).toBe(false);
});

  test("implements the Parser contract", () => {
    const genericParser: Parser = new CppParser();

    const result = genericParser.parse(
      "main.cpp:5:3: error: something went wrong"
    );

    expect(result).not.toBeNull();
    expect(result?.type).toBe("CppError");
  });
});