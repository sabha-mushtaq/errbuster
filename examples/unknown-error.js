console.log("Application started");

process.stderr.write(
  "CUSTOM_DIAGNOSTIC: Something unexpected happened in the application\n"
);

process.exit(1);