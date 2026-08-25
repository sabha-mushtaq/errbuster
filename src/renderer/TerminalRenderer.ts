import type { ErrorRecord } from "../core/ErrorRecord.js";

export class TerminalRenderer {
  render(error: ErrorRecord): string {
    const lines: string[] = [];

    lines.push("");
    lines.push("=".repeat(60));
    lines.push(`ERROR: ${error.type}`);
    lines.push("=".repeat(60));
    lines.push(`Message: ${error.message}`);

    if (error.file) {
      lines.push(`File: ${error.file}`);
    }

    if (error.line !== undefined) {
      lines.push(`Line: ${error.line}`);
    }

    if (error.column !== undefined) {
      lines.push(`Column: ${error.column}`);
    }

    if (error.stack) {
      lines.push("");
      lines.push("Stack:");
      lines.push(error.stack);
    }

    lines.push("=".repeat(60));
    lines.push("");

    return lines.join("\n");
  }
}