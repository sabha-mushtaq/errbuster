import { runProcess } from "../core/ProcessRunner.js";
import { ErrorDetector } from "../core/ErrorDetector.js";
import { NodeParser } from "../parsers/node/NodeParser.js";
import { TerminalRenderer } from "../renderer/TerminalRenderer.js";
import { ErrLogStore } from "../storage/ErrLogStore.js";
import { askToSave } from "./prompt.js";

export async function run(
  command: string,
  args: string[]
): Promise<void> {
  const processResult = await runProcess(command, args);

  const detector = new ErrorDetector();

  const output = processResult.stderr || processResult.stdout;

  const isError = detector.detect(output);

  if (!isError) {
    return;
  }

  const parser = new NodeParser();

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