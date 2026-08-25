import type { ErrorRecord } from "./ErrorRecord.js";

export interface Parser {
  canParse(output: string): boolean;
  parse(output: string): ErrorRecord | null;
}