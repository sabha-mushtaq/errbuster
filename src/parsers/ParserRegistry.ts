import type { Parser } from "../core/Parser.js";

export class ParserRegistry {
  constructor(private readonly parsers: Parser[]) {}

  findParser(output: string): Parser | null {
    for (const parser of this.parsers) {
      if (parser.canParse(output)) {
        return parser;
      }
    }

    return null;
  }
}