import { Request, Response, Router } from "express";
import { User } from "../../db/collections";
import { plainToInstance } from "class-transformer";
import { UpdateUserRequestDto } from "./dtos";
import { USER_NOT_FOUND } from "../../errors";
import { authMiddleware } from "../../middleware/auth";

export const userRouter = Router();

userRouter.post("/users/login", async (req: Request, res: Response) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password,
    );
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err: any) {
    res.status(500).send(err);
  }
});

userRouter.post("/users", async (req: Request, res: Response) => {
  const payload = req.body;
  const user = new User({
    ...payload,
    tokens: [],
  });
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(500).send(err);
  }
});

userRouter.post(
  "/users/logout",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      user.tokens = user.tokens.filter((token) => token.token !== req.token);
      await user.save();
      res.send();
    } catch (err) {
      res.status(500).send(err);
    }
  },
);

userRouter.post(
  "/users/logout-all",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      user.tokens = [];
      await user.save();
      res.send();
    } catch (err) {
      res.status(500).send(err);
    }
  },
);

userRouter.patch(
  "/users/me",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const user = req.user!;
      const updatedUserRequestDto = plainToInstance(
        UpdateUserRequestDto,
        req.body,
      );
      Object.assign(user, updatedUserRequestDto);
      const updatedUser = await user.save();

      res.status(200).send(updatedUser);
    } catch (err) {
      res.status(500).send(err);
    }
  },
);

userRouter.delete(
  "/users/me",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      await req.user?.deleteOne();
      res.status(200).send(req.user);
    } catch (err) {
      res.status(500).send(err);
    }
  },
);

userRouter.get(
  "/users/me",
  authMiddleware,
  async (req: Request, res: Response) => {
    res.send(req.user);
  },
);
