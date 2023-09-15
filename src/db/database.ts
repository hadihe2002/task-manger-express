import { connect } from "mongoose";

const mongoDBUrl = process.env.MONGO_DB_URL || "mongodb://0.0.0.0:27017/";
const mongoDBName = process.env.MONGO_DB_NAME || "task-manager-api";

export async function dbConfig() {
  await connect(mongoDBUrl, {
    dbName: mongoDBName,
  });
}
