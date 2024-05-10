import database from "@/helper/database";
import Server from "@/models/Server";

export default async function handler(req, res) {
  const { method } = req;

  await database();

  switch (method) {
    case "GET":
      try {
        const _id = req.query._id;
        if (_id) {
          const servers = await Server.findById(_id);
          res.status(200).json({ data: servers });
        } else {
          const servers = await Server.find();
          res.status(200).json({ data: servers });
        }
      } catch (error) {
        res.status(500).json({ error });
      }
      break;
    case "POST":
      try {
        const server = await Server.create(req.body);
        res.status(200).json({ data: server });
      } catch (error) {
        res.status(500).json({ error });
      }
      break;
    case "PUT":
      try {
        const update = req.body.update;
        const serverId = req.body.id;

        await Server.findOneAndUpdate({ _id: serverId }, update);

        const updatedServer = await Server.find({ _id: serverId });
        res.status(200).json({ data: updatedServer });
      } catch (error) {
        res.status(500).json({ error });
      }
      break;
    case "DELETE":
      try {
        const serverId = req.body.id;
        await Server.findOneAndDelete({ _id: serverId });
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
