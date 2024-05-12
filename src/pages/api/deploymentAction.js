import { deploy } from "@/libs/navnode";
import Server from "@/models/Server";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { action, environment } = req.body;

  const serversWithEnvironment = await Server.find({
    "environments._id": environment,
  });

  let foundEnvironment = {};
  let foundTask = {};

  serversWithEnvironment.forEach((server) => {
    foundEnvironment = server.environments.find(
      (env) => env._id.toString() === environment
    );
  });

  const serversWithTask = await Server.find({ "tasks._id": action });

  serversWithTask.forEach((server) => {
    foundTask = server.tasks.find((task) => task._id.toString() === action);
  });

  const deployResponse = await deploy(foundEnvironment, foundTask.commands);

  try {
    res.status(200).json({
      message: deployResponse,
    });
  } catch (error) {
    console.error("Error executing deployment action:", error);
    res.status(500).json({ error: "Failed to execute deployment action" });
  }
}
