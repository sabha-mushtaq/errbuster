import { runProcess } from "../core/ProcessRunner.js";
import { NodeParser } from "../parsers/node/NodeParser.js";
import { JavaParser } from "../parsers/java/JavaParser.js";
import { ParserRegistry } from "../parsers/ParserRegistry.js";
import { TerminalRenderer } from "../renderer/TerminalRenderer.js";
import { ErrLogStore } from "../storage/ErrLogStore.js";
import { askToSave } from "./prompt.js";

export async function run(
  command: string,
  args: string[]
): Promise<void> {
  const processResult = await runProcess(command, args);

  const output = processResult.stderr || processResult.stdout;

  // Let the parser registry determine whether the
  // output contains an error and which parser understands it.
  const parserRegistry = new ParserRegistry([
    new NodeParser(),
    new JavaParser(),
  ]);

  const parser = parserRegistry.findParser(output);

  if (!parser) {
    return;
  }

  const error = parser.parse(output);

  if (!error) {
    return;
  }

  const renderer = new TerminalRenderer();

  console.log(renderer.render(error));

  const shouldStore = await askToSave();

  if (!shouldStore) {
    return;
  }

  const store = new ErrLogStore();

  await store.store(error);
}