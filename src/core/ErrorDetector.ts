export class ErrorDetector {
  detect(output: string): boolean {
    if (!output.trim()) {
      return false;
    }

    const errorPatterns = [
      /\bError:/i,
      /\bTypeError:/i,
      /\bReferenceError:/i,
      /\bSyntaxError:/i,
      /\bRangeError:/i,
      /\bURIError:/i,
      /\bEvalError:/i,
    ];

    return errorPatterns.some((pattern) => pattern.test(output));
  }
}