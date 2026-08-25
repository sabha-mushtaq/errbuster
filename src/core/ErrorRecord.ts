export interface ErrorRecord {
  type: string;
  message: string;
  stack?: string;
  file?: string;
  line?: number;
  column?: number;
}