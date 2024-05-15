import { registerHook } from "@/libs/hooks";

registerHook("beforeDeploy", async (environment, task) => {
  console.log("Before deploy hook executed");
  console.log({ environment, task });
});

registerHook("afterDeploy", async (environment, task, deployResponse) => {
  console.log("After deploy hook executed");
  console.log({ environment, task, deployResponse });
});
