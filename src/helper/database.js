const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);

const connection = {};

async function database() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = database;
