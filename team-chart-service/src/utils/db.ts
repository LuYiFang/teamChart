import mongoose from "mongoose";
import { MONGO_DB_NAME, MONGO_DB_URL } from "./constants";

const url = MONGO_DB_URL;
const dbName = MONGO_DB_NAME;

async function connect() {
  try {
    await mongoose.connect(`${url}/${dbName}`);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

async function disconnect() {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error disconnecting from the database:", error);
  }
}

export { connect, disconnect };
