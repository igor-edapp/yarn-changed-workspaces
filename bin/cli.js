#!/usr/bin/env node

const yargs = require("yargs");
const { resolve, relative } = require("path");
const { format } = require("util");
const chalk = require("chalk");
const { getChangedWorkspacesIds } = require("../src/getChangedWorkspacesIds");

process.on("unhandledRejection", (err) => {
  throw err;
});

const options = yargs
  .option("projectRoot", {
    alias: "p",
    required: true,
    default: resolve(process.cwd()),
    type: "string",
    normalize: true,
  })
  .option("format", {
    description: "Option of how the result will be output",
    choices: ["json", "string"],
    default: "json",
  })
  .option("fromBranch", {
    description: "Option to `git diff` from a diff branch than current one.",
  })
  .option("branch", {
    alias: "b",
    default: "master",
  })
  .option("keyNaming", {
    alias: "k",
    choices: ["snakeCase", "camelCase"],
  })
  .option("namespace", {
    alias: "n",
    type: "string",
  }).argv;

(async () => {
  const cwd = process.cwd();
  const workspaces = Object.entries(await getChangedWorkspacesIds(options));
  if (workspaces.length <= 0) {
    const msg = "No changes found in workspaces";
    if (process.env.CI) return console.info(msg);
    return console.info(msg);
  }
  console.info(
    workspaces
      .map(([id, files]) =>
        [
          id,
          ...[...files].sort().map((filePath) => {
            const path = relative(cwd, filePath);
            if (process.env.CI) return "  " + path;
            return "  " + chalk.green(path);
          }),
        ].join("\n")
      )
      .join("\n")
  );
})();
