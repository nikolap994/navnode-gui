import database from "@/helper/database";
import Webhook from "@/models/Webhook";

export default async function handler(req, res) {
  const { method } = req;

  await database();

  switch (method) {
    case "GET":
      try {
        const _id = req.query._id;
        const _serverId = req.query._serverId;
        if (_id) {
          const webhooks = await Webhook.findById(_id);
          res.status(200).json({ data: webhooks });
        } else if (_serverId) {
          const webhooks = await Webhook.find("server_id", _serverId);
          res.status(200).json({ data: webhooks });
        }
      } catch (error) {
        res.status(200).json({});
      }
      break;
    case "POST":
      try {
        const webhook = await Webhook.create(req.body);
        res.status(200).json({ data: webhook });
      } catch (error) {
        res.status(500).json({ error });
      }
      break;
    case "PUT":
      try {
        const update = req.body;
        const webhookId = req.query._id;

        await Webhook.findOneAndUpdate({ _id: webhookId }, update);

        const updatedWebhook = await Webhook.find({ _id: webhookId });
        res.status(200).json({ data: updatedWebhook });
      } catch (error) {
        res.status(500).json({ error });
      }
      break;
    case "DELETE":
      try {
        const webhookId = req.body.id;
        await Webhook.findOneAndDelete({ _id: webhookId });
        res.status(200).json({ data: "deleted" });
        return;
      } catch (error) {
        res.status(500).json({ error });
      }
    default:
      res.status(500).json({ error: "Failed to fetch data" });
      break;
  }
}
