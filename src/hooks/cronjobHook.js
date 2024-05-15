const { registerHook } = require("../libs/hooksServer");

const beforeDeployHook = async (environment, task) => {
  console.log("Before deploy hook executed");
  console.log({ environment, task });
};

const afterDeployHook = async (environment, task, deployResponse) => {
  console.log("After deploy hook executed");
  console.log({ environment, task, deployResponse });
};

registerHook("beforeDeploy", beforeDeployHook);
registerHook("afterDeploy", afterDeployHook);
