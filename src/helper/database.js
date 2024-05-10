import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connection = {};

async function database() {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);

    connection.isConnected = db.connections[0].readyState;
    if (connection.isConnected) {
      console.log("MongoDB database connected successfully.");
    } else {
      console.log("MongoDB connection failed.");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export default database;
