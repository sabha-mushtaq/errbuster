import { createInterface } from "node:readline";

export function askToSave(): Promise<boolean> {
  return new Promise((resolve) => {
    const readline = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question(
      "\nSave this error to errlog.md? (y/n): ",
      (answer) => {
        readline.close();

        const normalized = answer.trim().toLowerCase();

        resolve(
          normalized === "y" ||
          normalized === "yes"
        );
      }
    );
  });
}