const mongoose = require("mongoose");

const webhookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  server_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Server",
    required: true,
  },
  environment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Environment",
    required: true,
  },
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
});

module.exports =
  mongoose.models.Webhook || mongoose.model("Webhook", webhookSchema);
