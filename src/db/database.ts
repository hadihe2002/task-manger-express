import { Mongoose, connect } from "mongoose";

const mongoDBUrl = process.env.MONGO_DB_URL || "mongodb://0.0.0.0:27017/";
const mongoDBName = process.env.MONGO_DB_NAME || "task-manager-api";

let db: Mongoose;

export async function dbConnect() {
  db = await connect(mongoDBUrl, {
    dbName: mongoDBName,
  });
}
export async function dbDisconnect() {
  await db.disconnect();
}
export async function dbDrop() {
  await db.connection.db.dropDatabase();
}
