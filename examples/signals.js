const signal = process.argv[2];

console.log(`Testing ${signal}...`);

if (!signal) {
  console.error("Usage: node signals.js <signal>");
  process.exit(1);
}

process.kill(process.pid, signal);