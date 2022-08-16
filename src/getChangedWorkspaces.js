const { resolve } = require("path");

const { getChangedFiles } = require("./getChangedFiles");
const { getTouchedDependencies } = require("./getTouchedDependencies");
const { getWorkspaces } = require("./getWorkspaces");

const getChangedWorkspaces = async ({ format = 'json', fromBranch, branch, projectRoot }) => {
  const path = resolve(projectRoot);
  const [workspaces, files] = await Promise.all([
    getWorkspaces(path),
    getChangedFiles({ fromBranch, cwd: path, branch }),
  ]);

  const dependencies = getTouchedDependencies({ files, workspaces });
  if (format === 'json') {
    return dependencies;
  } else {
    return Object.keys(dependencies).join(',');
  }
};

exports.getChangedWorkspaces = getChangedWorkspaces;
