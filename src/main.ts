import express, { NextFunction } from "express";
import dotenv from "dotenv";
import { dbConfig } from "./db/database";
import { taskRouter } from "./modules/task/task.router";
import { userRouter } from "./modules/user/user.router";

import consolidate from "consolidate";
import path from "path";
dotenv.config();
dbConfig().catch((err) => console.log(err));

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(taskRouter);
app.use(userRouter);

app.set("view engine", "html");
app.engine("html", consolidate.swig);

app.set("views", path.join(__dirname, "public"));
app.use(express.static(path.join(__dirname, "public")));

const mainRouter = express.Router();
app.use(mainRouter);

app.listen(port, () => {
  console.log(`Server Is Running on /localhost:${port}/`);
});
