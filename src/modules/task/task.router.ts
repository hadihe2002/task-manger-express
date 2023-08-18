import { Request, Response, Router } from "express";
import { Task } from "../../db/collections";
import { plainToInstance } from "class-transformer";
import { UpdateTaskRequestDto } from "./dtos";
import { authMiddleware } from "../../middleware/auth";
import { CustomError, TASK_NOT_FOUND } from "../../errors";

export const taskRouter = Router();

taskRouter.get(
  "/tasks/",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ user: req.user!._id });
      res.status(200).send(tasks);
    } catch (err) {
      res.send(err);
    }
  },
);

taskRouter.get(
  "/tasks/:taskId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const taskId = req.params.taskId;
      const task = await Task.findOne({ _id: taskId, user: req.user!._id });

      if (!task) {
        return res.status(TASK_NOT_FOUND.status).send(TASK_NOT_FOUND);
      }

      res.status(200).send(task);
    } catch (err) {
      res.send(err);
    }
  },
);

taskRouter.post(
  "/tasks",
  authMiddleware,
  async (req: Request, res: Response) => {
    const payload = req.body;
    const task = new Task({
      ...payload,
      user: req.user!._id,
    });

    try {
      const savedTask = await task.save();
      res.status(201).send(savedTask);
    } catch (err) {
      res.status(500).send(err);
    }
  },
);

taskRouter.patch(
  "/tasks/:taskId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const taskId = req.params.taskId;
      const updatedTaskRequestDto = plainToInstance(
        UpdateTaskRequestDto,
        req.body,
      );

      const task = await Task.findOne({ _id: taskId, user: req.user!._id });

      if (!task) {
        return res.status(TASK_NOT_FOUND.status).send(TASK_NOT_FOUND);
      }

      Object.assign(task, updatedTaskRequestDto);
      const updatedTask = await task.save();

      res.status(200).send(updatedTask);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
);

taskRouter.delete(
  "/tasks/:taskId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const taskId = req.params.taskId;
      const task = await Task.findOne({ _id: taskId, user: req.user!._id });

      if (!task) {
        return res.status(TASK_NOT_FOUND.status).send(TASK_NOT_FOUND);
      }

      const deletedTask = await task.deleteOne();

      res.status(200).send(deletedTask);
    } catch (err) {
      res.status(500).send(err);
    }
  },
);
