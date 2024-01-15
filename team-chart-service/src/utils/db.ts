import { MongoClient } from "mongodb";
import { MONGO_DB_NAME, MONGO_DB_URL } from "./constants";

const url = MONGO_DB_URL;
const dbName = MONGO_DB_NAME;

async function connect() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log("Connected to the database");
    return client.db(dbName);
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

export default connect;
