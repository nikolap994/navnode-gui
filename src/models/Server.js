const mongoose = require("mongoose");

const environmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: String, required: true },
  server: { type: String, required: true },
  path: { type: String, required: true },
});

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  commands: [{ type: String, required: true }],
});

const serverSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  environments: [environmentSchema],
  tasks: [taskSchema],
});

module.exports =
  mongoose.models.Server || mongoose.model("Server", serverSchema);
