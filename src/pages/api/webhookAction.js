import Webhook from "@/models/Webhook";
import Server from "@/models/Server";
import { deploy } from "@/libs/navnode";
import { executeHooks } from "@/libs/hooks";

import "@/hooks/webhookHook";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const _id = req.query._id;
    const webhook = await Webhook.findById(_id);
    if (!webhook) {
      return res.status(404).json({ error: "Webhook not found" });
    }

    const server = await Server.findById(webhook.server_id);
    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }

    console.log("Webhook environment_id:", webhook.environment_id);
    console.log("Server environments:", server.environments);

    const environment = server.environments.find(
      (env) => env._id.toString() === webhook.environment_id.toString()
    );
    const task = server.tasks.find(
      (task) => task._id.toString() === webhook.task_id.toString()
    );

    if (!environment) {
      return res.status(404).json({ error: "Environment not found" });
    }

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await executeHooks("beforeDeploy", environment, task);

    const deployResponse = await deploy(environment, task.commands);

    await executeHooks("afterDeploy", environment, task, deployResponse);

    try {
      res.status(200).json({
        status: "Success",
        message: deployResponse,
      });
    } catch (error) {
      console.error("Error executing deployment action:", error);
      res.status(500).json({ error: "Failed to execute deployment action" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
