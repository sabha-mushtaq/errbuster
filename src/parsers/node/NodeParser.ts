import type { ErrorRecord } from "../../core/ErrorRecord.js";
import type { Parser } from "../../core/Parser.js";

export class NodeParser implements Parser {
  parse(output: string): ErrorRecord | null {
    const lines = output.trim().split("\n");

    if (lines.length === 0 || !lines[0]) {
      return null;
    }

    const errorLine = lines[0];

    const errorMatch = errorLine.match(/^(\w*Error):\s*(.+)$/);

    if (!errorMatch) {
      return null;
    }

    const type = errorMatch[1];
    const message = errorMatch[2];

    if (!type || !message) {
      return null;
    }

    const stackLine = lines.find((line) =>
      line.trim().startsWith("at ")
    );

    if (!stackLine) {
      return {
        type,
        message,
      };
    }

    const locationMatch = stackLine.match(
      /\((.*):(\d+):(\d+)\)/
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