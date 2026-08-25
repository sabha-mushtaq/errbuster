import type { ErrorRecord } from "../../core/ErrorRecord.js";
import type { Parser } from "../../core/Parser.js";

export class CParser implements Parser {
  canParse(output: string): boolean {
    return (
      /\bsegmentation fault\b/i.test(output) ||
      /\bfatal error:/i.test(output) ||
      /\berror:.*\b/i.test(output) ||
      /\bwarning:.*\b/i.test(output)
    );
  }

  parse(output: string): ErrorRecord | null {
    const lines = output.trim().split("\n");

    if (lines.length === 0 || !output.trim()) {
      return null;
    }

    // GCC / Clang format:
    //
    // main.c:10:5: error: ...
    //
    const locationMatch = output.match(
      /(?:^|\n)([^:\n]+):(\d+):(\d+):\s*(?:fatal error|error):\s*(.+)/i
    );

    if (locationMatch) {
      const file = locationMatch[1];
      const line = locationMatch[2];
      const column = locationMatch[3];
      const message = locationMatch[4];

      if (file && line && column && message) {
        return {
          type: "CError",
          message,
          stack: output,
          file,
          line: Number(line),
          column: Number(column),
        };
      }
    }

    // Runtime error such as:
    //
    // Segmentation fault
    //
    if (/\bsegmentation fault\b/i.test(output)) {
      return {
        type: "SegmentationFault",
        message: "Segmentation fault",
        stack: output,
      };
    }

    return null;
  }
}