#!/usr/bin/env node
import { run } from "./run.js";
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: errbuster <command> [args...]");
  process.exit(1);
}

const [command, ...commandArgs] = args;

if (!command) {
  console.error("No command provided.");
  process.exit(1);
}

await run(command, commandArgs);