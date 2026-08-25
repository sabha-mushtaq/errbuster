import { appendFile, access } from "node:fs/promises";
import type { ErrorRecord } from "../core/ErrorRecord.js";

export class ErrLogStore {
  private readonly filePath: string;

  constructor(filePath = "errlog.md") {
    this.filePath = filePath;
  }

  async store(error: ErrorRecord): Promise<void> {
    const entry = this.format(error);

    try {
      await access(this.filePath);
    } catch {
      await appendFile(
        this.filePath,
        "# ErrBuster Error Log\n\n",
        "utf8"
      );
    }

    await appendFile(this.filePath, entry, "utf8");
  }

  private format(error: ErrorRecord): string {
    const lines: string[] = [];

    lines.push("## Error");
    lines.push("");
    lines.push(`**Type:** ${error.type}`);
    lines.push(`**Message:** ${error.message}`);

    if (error.file) {
      lines.push(`**File:** ${error.file}`);
    }

    if (error.line !== undefined) {
      lines.push(`**Line:** ${error.line}`);
    }

    if (error.column !== undefined) {
      lines.push(`**Column:** ${error.column}`);
    }

    if (error.stack) {
      lines.push("");
      lines.push("### Stack");
      lines.push("");
      lines.push("```text");
      lines.push(error.stack);
      lines.push("```");
    }

    lines.push("");
    lines.push("---");
    lines.push("");

    return lines.join("\n");
  }
}