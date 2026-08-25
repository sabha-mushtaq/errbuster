import type { ErrorRecord } from "../../core/ErrorRecord.js";
import type { Parser } from "../../core/Parser.js";

export class JavaParser implements Parser {
  canParse(output: string): boolean {
    return (
      /Exception in thread ".*"/.test(output) ||
      /\b[\w.]+Exception(?::|\s)/.test(output) ||
      /\b[\w.]+Error(?::|\s)/.test(output)
    );
  }

  parse(output: string): ErrorRecord | null {
    const lines = output.trim().split("\n");

    if (lines.length === 0 || !lines[0]) {
      return null;
    }

    /*
     * Example:
     *
     * Exception in thread "main" java.lang.NullPointerException:
     * Cannot invoke "String.length()" because "value" is null
     */

    const errorLine = lines.find((line) =>
      /(?:[\w.]+Exception|[\w.]+Error)(?::|\s)/.test(line)
    );

    if (!errorLine) {
      return null;
    }

    const match = errorLine.match(
      /(?:[\w.]+Exception|[\w.]+Error)(?::\s*(.*))?$/
    );

    if (!match) {
      return null;
    }

    const fullTypeMatch = errorLine.match(
      /([\w.]+(?:Exception|Error))/
    );

    if (!fullTypeMatch) {
      return null;
    }

    const fullType = fullTypeMatch[1];

    if (!fullType) {
      return null;
    }

    const type = fullType;

    const message = match[1]?.trim();

    /*
     * Java stack trace:
     *
     * at Main.main(Main.java:10)
     */
    const locationMatch = output.match(
      /\bat\s+[\w.$]+\(([^():]+):(\d+)\)/
    );

    if (!locationMatch) {
      return {
        type,
        message: message || type,
        stack: output,
      };
    }

    const file = locationMatch[1];
    const line = locationMatch[2];

    if (!file || !line) {
      return {
        type,
        message: message || type,
        stack: output,
      };
    }

    return {
      type,
      message: message || type,
      stack: output,
      file,
      line: Number(line),
    };
  }
}