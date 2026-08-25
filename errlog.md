# ErrBuster Error Log

## Error

**Type:** TypeError
**Message:** Cannot read properties of undefined (reading 'name')
**File:** file:///Users/sabhamushtaq/Desktop/errbuster/examples/crash.js
**Line:** 5
**Column:** 18

### Stack

```text
file:///Users/sabhamushtaq/Desktop/errbuster/examples/crash.js:5
console.log(user.name);
                 ^

TypeError: Cannot read properties of undefined (reading 'name')
    at file:///Users/sabhamushtaq/Desktop/errbuster/examples/crash.js:5:18
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:665:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.21.1

```

---
