import { connect } from "mongoose";

export async function dbConfig() {
  await connect(`mongodb://0.0.0.0:27017/`, {
    dbName: "task-manager-api",
  });
}
