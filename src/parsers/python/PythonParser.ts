import type { ErrorRecord } from "../../core/ErrorRecord.js";
import type { Parser } from "../../core/Parser.js";

export class PythonParser implements Parser {
  canParse(output: string): boolean {
    return output.includes("Traceback (most recent call last):");
  }

  parse(output: string): ErrorRecord | null {
    const lines = output.trim().split("\n");

    if (lines.length === 0 || !lines[0]) {
      return null;
    }

    // Python traceback location:
    //
    // File "app.py", line 10, in <module>
    //
    const locationMatch = output.match(
      /File "([^"]+)", line (\d+)/
    );

    // Python error:
    //
    // NameError: name 'user' is not defined
    // TypeError: ...
    // ValueError: ...
    //
    const errorMatch = output.match(
      /^([A-Za-z_][A-Za-z0-9_]*(?:Error|Exception)):\s*(.+)$/m
    );

    if (!errorMatch) {
      return null;
    }

    const type = errorMatch[1];
    const message = errorMatch[2];

    if (!type || !message) {
      return null;
    }

    if (!locationMatch) {
      return {
        type,
        message,
        stack: output,
      };
    }

    const file = locationMatch[1];
    const line = locationMatch[2];

    if (!file || !line) {
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
    };
  }
}