import type { ErrorRecord } from "../../core/ErrorRecord.js";
import type { Parser } from "../../core/Parser.js";

export class CppParser implements Parser {
  canParse(output: string): boolean {
    return (
      /\.cpp:\d+:\d+:\s*(?:fatal error|error|warning):/i.test(output) ||
      /\.cc:\d+:\d+:\s*(?:fatal error|error|warning):/i.test(output) ||
      /\.cxx:\d+:\d+:\s*(?:fatal error|error|warning):/i.test(output)
    );
  }

  parse(output: string): ErrorRecord | null {
    if (!output.trim()) {
      return null;
    }

    /*
     * GCC / Clang C++ diagnostic format:
     *
     * main.cpp:10:5: error: expected ';' before '}'
     */
    const locationMatch = output.match(
      /(?:^|\n)([^:\n]+\.(?:cpp|cc|cxx)):(\d+):(\d+):\s*(?:fatal error|error|warning):\s*(.+)/i
    );

    if (!locationMatch) {
      return null;
    }

    const file = locationMatch[1];
    const line = locationMatch[2];
    const column = locationMatch[3];
    const message = locationMatch[4];

    if (!file || !line || !column || !message) {
      return null;
    }

    return {
      type: "CppError",
      message,
      stack: output,
      file,
      line: Number(line),
      column: Number(column),
    };
  }
}