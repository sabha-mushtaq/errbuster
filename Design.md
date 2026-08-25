# ErrBuster Design

## Core Principles

1. ErrBuster is not an application dependency.
2. ErrBuster runs as a parent/wrapper process.
3. Failure of ErrBuster must not break the child process.
4. Core architecture is language-independent.
5. Core architecture is tool-independent.
6. Error persistence requires developer permission.

## v1

- Capture stdout/stderr
- Detect errors
- Pretty terminal output
- Ask before persistence
- Store approved errors locally in a errlog.md file