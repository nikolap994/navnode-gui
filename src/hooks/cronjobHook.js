const { registerHook } = require("../libs/hooksServer");

// Define the beforeDeploy hook
const beforeDeployHook = async (environment, task) => {
  console.log("Before deploy hook executed");
  console.log({ environment, task });
};

// Define the afterDeploy hook
const afterDeployHook = async (environment, task, deployResponse) => {
  console.log("After deploy hook executed");
  console.log({ environment, task, deployResponse });
};

// Register hooks using the registerHook function
registerHook("beforeDeploy", beforeDeployHook);
registerHook("afterDeploy", afterDeployHook);
