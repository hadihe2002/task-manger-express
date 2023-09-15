import express, { NextFunction } from "express";
import dotenv from "dotenv";
import mustacheExpress from "mustache-express";
import { dbConfig } from "./db/database";
import { taskRouter } from "./modules/task/task.router";
import { userRouter } from "./modules/user/user.router";

dotenv.config();
dbConfig().catch((err) => console.log(err));

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(taskRouter);
app.use(userRouter);

app.set("views", `${__dirname}/public`);
app.set("view engine", "mustache");
app.engine("mustache", mustacheExpress());

const mainRouter = express.Router();
app.use(mainRouter);

app.listen(port, () => {
  console.log(`Server Is Running on /localhost:${port}/`);
});
