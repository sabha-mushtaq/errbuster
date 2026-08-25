import type { ErrorRecord } from "../../core/ErrorRecord.js";
import type { Parser } from "../../core/Parser.js";

export class NodeParser implements Parser {
  parse(output: string): ErrorRecord | null {
    const lines = output.trim().split("\n");

    if (lines.length === 0 || !lines[0]) {
      return null;
    }

    const errorLine = lines.find((line) =>
      /^(\w*Error):\s*(.+)$/.test(line.trim())
    );

    if (!errorLine) {
      return null;
    }

    const errorMatch = errorLine.trim().match(
      /^(\w*Error):\s*(.+)$/
    );

    if (!errorMatch) {
      return null;
    }

    const type = errorMatch[1];
    const message = errorMatch[2];

    if (!type || !message) {
      return null;
    }

    // Look for a stack-trace location.
    //
    // Supports:
    // at calculate (/app/index.js:10:5)
    // at file:///app/index.js:10:5
    // atfile:///app/index.js:10:5
    const locationMatch = output.match(
      /(?:at\s*)?(?:\()?((?:file:\/\/\/|\/)[^)\n]+):(\d+):(\d+)\)?/
    );

    if (!locationMatch) {
      return {
        type,
        message,
        stack: output,
      };
    }

    const file = locationMatch[1];
    const line = locationMatch[2];
    const column = locationMatch[3];

    if (!file || !line || !column) {
      return {
        type,
        message,
        stack: output,
      };
    }

    return {
      type,
      message,
      stack: output,
      file,
      line: Number(line),
      column: Number(column),
    };
  }
}