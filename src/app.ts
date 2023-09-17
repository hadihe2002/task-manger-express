import path from "path";
import dotenv from "dotenv";

const envPath =
  process.env.NODE_ENV === "test"
    ? path.join(process.cwd(), ".env.test")
    : path.join(process.cwd(), ".env");

dotenv.config({ path: envPath });

import express from "express";
import { dbConnect } from "./db/database";
import { taskRouter } from "./modules/task/task.router";
import { userRouter } from "./modules/user/user.router";
import consolidate from "consolidate";

dbConnect().catch((err) => console.log(err));

const app = express();

app.use(express.json());

app.set("view engine", "html");
app.engine("html", consolidate.swig);

app.set("views", path.join(__dirname, "public"));
app.use(express.static(path.join(__dirname, "public")));

const mainRouter = express.Router();
app.use(mainRouter);
app.use(taskRouter);
app.use(userRouter);

export { app };
