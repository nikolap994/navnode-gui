import database from "@/helper/database";
import Cronjob from "@/models/Cronjob";

export default async function handler(req, res) {
  const { method } = req;

  await database();

  switch (method) {
    case "GET":
      try {
        const _id = req.query._id;
        const _serverId = req.query._serverId;
        if (_id) {
          const cronjobs = await Cronjob.findById(_id);
          res.status(200).json({ data: cronjobs });
        } else if (_serverId) {
          const cronjobs = await Cronjob.find({ server_id: _serverId });
          res.status(200).json({ data: cronjobs });
        }
      } catch (error) {
        res.status(200).json({});
      }
      break;
    case "POST":
      try {
        const cronjob = await Cronjob.create(req.body);
        res.status(200).json({ data: cronjob });
      } catch (error) {
        res.status(500).json({ error });
      }
      break;
    case "PUT":
      try {
        const update = req.body;
        const cronjobId = req.query._id;

        await Cronjob.findOneAndUpdate({ _id: cronjobId }, update);

        const updatedCronjob = await Cronjob.find({ _id: cronjobId });
        res.status(200).json({ data: updatedCronjob });
      } catch (error) {
        res.status(500).json({ error });
      }
      break;
    case "DELETE":
      try {
        const cronjobId = req.query._id;
        await Cronjob.findOneAndDelete({ _id: cronjobId });
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
