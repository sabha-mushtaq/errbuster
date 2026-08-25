import type { ErrorRecord } from "../core/ErrorRecord.js";

export class TerminalRenderer {
  private readonly minWidth = 60;
  private readonly maxWidth = 120;

  render(error: ErrorRecord): string {
    const terminalWidth = this.getTerminalWidth();
    const width = Math.min(
      Math.max(terminalWidth, this.minWidth),
      this.maxWidth
    );

    const lines: string[] = [];

    // Main error box
    this.renderErrorBox(lines, error, width);

    // Stack trace section
    if (error.stack && error.stack.trim()) {
      this.renderStackTrace(lines, error.stack, width);
    }

    lines.push("");

    return lines.join("\n");
  }

  private renderErrorBox(lines: string[], error: ErrorRecord, width: number): void {
    const border = "─".repeat(width - 2);
    const contentWidth = width - 4;

    // Top border
    lines.push(`╭${border}╮`);
    
    // Title
    const title = "ERRBUSTER • ERROR";
    lines.push(
      `│${this.center(title, contentWidth)}│`
    );
    
    // Separator
    lines.push(`├${border}┤`);

    // Type
    this.addRow(lines, "Type", error.type, width);

    // Message (wrapped)
    this.addWrappedRow(lines, "Message", error.message, width);

    // File (wrapped)
    if (error.file) {
      this.addWrappedRow(lines, "File", error.file, width);
    }

    // Location
    if (error.line !== undefined) {
      const location = error.column !== undefined 
        ? `${error.line}:${error.column}`
        : `${error.line}`;
      this.addRow(lines, "Location", location, width);
    }

    // Bottom border
    lines.push(`╰${border}╯`);
  }

  private renderStackTrace(lines: string[], stack: string, width: number): void {
    lines.push("");
    lines.push("  Stack Trace");
    lines.push(`  ${"─".repeat(Math.min(width - 4, 80))}`);

    const stackLines = stack.split("\n").filter(line => line.trim());
    
    // Indent stack frames for readability
    for (const stackLine of stackLines) {
      lines.push(`    ${stackLine}`);
    }

    lines.push("");
  }

  private addRow(
    lines: string[],
    label: string,
    value: string,
    width: number
  ): void {
    const labelWidth = 12;
    const contentWidth = width - 4 - labelWidth;

    const paddedLabel = label.padEnd(labelWidth);
    
    // Truncate if value is too long for a single line
    const displayValue = value.length > contentWidth
      ? value.slice(0, contentWidth - 3) + "..."
      : value.padEnd(contentWidth);

    lines.push(
      `│  ${paddedLabel}│ ${displayValue} │`
    );
  }

  private addWrappedRow(
    lines: string[],
    label: string,
    value: string,
    width: number
  ): void {
    const labelWidth = 12;
    const contentWidth = width - 4 - labelWidth;

    // Split by words for intelligent wrapping
    const words = value.split(" ");
    let currentLine = "";
    let firstLine = true;

    for (const word of words) {
      // Check if adding this word would exceed the line width
      if (
        currentLine.length > 0 &&
        currentLine.length + word.length + 1 > contentWidth
      ) {
        // Add the current line
        this.addRow(
          lines,
          firstLine ? label : "",
          currentLine,
          width
        );
        firstLine = false;
        currentLine = word;
      } else {
        // Add word to current line
        currentLine = currentLine.length === 0
          ? word
          : `${currentLine} ${word}`;
      }
    }

    // Add the last line
    if (currentLine.length > 0) {
      this.addRow(
        lines,
        firstLine ? label : "",
        currentLine,
        width
      );
    }
  }

  private center(text: string, width: number): string {
    if (text.length >= width) {
      return text.slice(0, width);
    }

    const totalPadding = width - text.length;
    const leftPadding = Math.floor(totalPadding / 2);
    const rightPadding = totalPadding - leftPadding;

    return " ".repeat(leftPadding) + text + " ".repeat(rightPadding);
  }

  private getTerminalWidth(): number {
    if (typeof process !== "undefined" && process.stdout?.columns) {
      return process.stdout.columns;
    }
    return 80;
  }
}