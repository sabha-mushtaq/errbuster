import type { ErrorRecord } from "./ErrorRecord.js";

export interface Parser {
  parse(output: string): ErrorRecord | null;
}