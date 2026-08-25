import { runProcess } from "../core/ProcessRunner.js";
import { NodeParser } from "../parsers/node/NodeParser.js";
import { JavaParser } from "../parsers/java/JavaParser.js";
import { PythonParser } from "../parsers/python/PythonParser.js";
import { CParser } from "../parsers/c/CParser.js";
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

  // Handle processes terminated by an operating-system signal.
  if (processResult.signal) {
    const signalInfo = getSignalInfo(processResult.signal);

    const error = {
      type: signalInfo.type,
      message: signalInfo.message,
      ...(output ? { stack: output } : {}),
    };

    const renderer = new TerminalRenderer();

    console.log(renderer.render(error));

    const shouldStore = await askToSave();

    if (!shouldStore) {
      return;
    }

    const store = new ErrLogStore();

    await store.store(error);

    return;
  }

  // Let the parser registry determine which parser
  // understands the terminal output.
  const parserRegistry = new ParserRegistry([
    new NodeParser(),
    new JavaParser(),
    new PythonParser(),
    new CParser(),
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

function getSignalInfo(signal: NodeJS.Signals): {
  type: string;
  message: string;
} {
  switch (signal) {
    case "SIGSEGV":
      return {
        type: "Segmentation Fault",
        message:
          "The program tried to access invalid memory. This can be caused by a null pointer, invalid pointer, or out-of-bounds memory access.",
      };

    case "SIGABRT":
      return {
        type: "Aborted",
        message:
          "The program terminated itself unexpectedly, usually because a runtime assertion or fatal condition occurred.",
      };

    case "SIGTERM":
      return {
        type: "Process Terminated",
        message:
          "The process was asked to terminate by the operating system or another process.",
      };

    case "SIGKILL":
      return {
        type: "Process Killed",
        message:
          "The process was forcibly terminated and could not clean up before exiting.",
      };

    case "SIGINT":
      return {
        type: "Interrupted",
        message:
          "The process was interrupted, usually by the user stopping it from the terminal.",
      };

    default:
      return {
        type: "Process Terminated",
        message: `The process was terminated by ${signal}.`,
      };
  }
}