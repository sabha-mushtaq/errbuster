import type { ErrorRecord } from "../../core/ErrorRecord.js";
import type { Parser } from "../../core/Parser.js";

export class NodeParser implements Parser {
  canParse(output: string): boolean {
    // Standard Node.js runtime errors.
    const nodeRuntimeError =
      /\b(TypeError|ReferenceError|SyntaxError|RangeError|URIError|EvalError|Error):/.test(
        output
      );

    if (nodeRuntimeError) {
      return true;
    }

    // Vite / esbuild JavaScript or JSX build diagnostics.
    //
    // Example:
    //
    // error during build:
    // [vite:esbuild] Transform failed with 1 error:
    //
    // /app/src/App.jsx:189:1: ERROR: Unexpected "default"
    const buildToolError =
      /\b(?:vite|esbuild)\b/i.test(output) &&
      /\bERROR:\s*.+/i.test(output);

    return buildToolError;
  }

  parse(output: string): ErrorRecord | null {
    const lines = output.trim().split("\n");

    if (lines.length === 0 || !lines[0]) {
      return null;
    }

    /*
     * ------------------------------------------------------------
     * Vite / esbuild build errors
     * ------------------------------------------------------------
     *
     * Example:
     *
     * error during build:
     * [vite:esbuild] Transform failed with 1 error:
     *
     * /app/src/App.jsx:189:1: ERROR: Unexpected "default"
     */

    const isBuildToolError =
      /\b(?:vite|esbuild)\b/i.test(output) &&
      /\bERROR:\s*.+/i.test(output);

    if (isBuildToolError) {
      /*
       * First format:
       *
       * /app/src/App.jsx:189:1: ERROR: Unexpected "default"
       */
      const inlineLocationMatch = output.match(
        /(?:^|\n)([^:\n]+(?:\/[^:\n]+)*\.[A-Za-z0-9]+):(\d+):(\d+):\s*ERROR:\s*(.+)/i
      );

      if (inlineLocationMatch) {
        const file = inlineLocationMatch[1];
        const line = inlineLocationMatch[2];
        const column = inlineLocationMatch[3];
        const message = inlineLocationMatch[4];

        if (file && line && column && message) {
          return {
            type: "JavaScriptBuildError",
            message: message.trim(),
            stack: output,
            file,
            line: Number(line),
            column: Number(column),
          };
        }
      }

      /*
       * Second format:
       *
       * file: /app/src/App.jsx:189:1
       *
       * ERROR: Unexpected "default"
       */
      const fileLocationMatch = output.match(
        /(?:^|\n)file:\s*(.+):(\d+):(\d+)/i
      );

      const messageMatch = output.match(
        /\bERROR:\s*([^\n]+)/i
      );

      if (fileLocationMatch && messageMatch) {
        const file = fileLocationMatch[1];
        const line = fileLocationMatch[2];
        const column = fileLocationMatch[3];
        const message = messageMatch[1];

        if (file && line && column && message) {
          return {
            type: "JavaScriptBuildError",
            message: message.trim(),
            stack: output,
            file: file.trim(),
            line: Number(line),
            column: Number(column),
          };
        }
      }

      /*
       * If the build tool produced an error but we could not
       * determine the file and location, still preserve the
       * useful error message.
       */
      const fallbackMessageMatch = output.match(
        /\bERROR:\s*([^\n]+)/i
      );

      if (fallbackMessageMatch && fallbackMessageMatch[1]) {
        return {
          type: "JavaScriptBuildError",
          message: fallbackMessageMatch[1].trim(),
          stack: output,
        };
      }

      return null;
    }

    /*
     * ------------------------------------------------------------
     * Standard Node.js runtime errors
     * ------------------------------------------------------------
     */

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

    /*
     * Look for a stack-trace location.
     *
     * Supports:
     *
     * at calculate (/app/index.js:10:5)
     * at file:///app/index.js:10:5
     * atfile:///app/index.js:10:5
     */
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