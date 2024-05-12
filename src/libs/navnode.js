const { execSync } = require("child_process");

/**
 * Executes SSH commands on a remote server for deployment.
 * @param {object} env - The environment object containing user, server, and path.
 * @param {string[]} commands - Array of commands to execute remotely.
 * @returns {string[]} Array of outputs from each executed command.
 */
exports.deploy = async function (env, commands) {
  if (!env) {
    console.log("Missing environment");
    return [];
  }

  const { user, server, path: remotePath } = env;
  const url = `${user}@${server}`;
  const outputs = [];

  try {
    for (const command of commands) {
      const sshCommand = `cd ${remotePath} && ${command}`;
      const finalCommand = `ssh ${url} "${sshCommand}"`;
      const output = execSync(finalCommand, { encoding: "utf-8" });
      outputs.push(output.trim());
      outputs.push("\n");
    }

    return outputs;
  } catch (err) {
    console.error("Error executing SSH commands:", err);
    return outputs;
  }
};
