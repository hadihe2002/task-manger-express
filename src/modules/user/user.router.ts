import { NextFunction, Request, Response, Router } from "express";
import { User } from "../../db/collections";
import { plainToInstance } from "class-transformer";
import { UpdateUserRequestDto } from "./dtos";
import { authMiddleware } from "../../middleware/auth";
import multer from "multer";
import sharp from "sharp";

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: CallableFunction,
) => {
  if (file.originalname.match(/.+\.(jpg|jpeg|png)$/g)) {
    cb(null, true);
  } else {
    cb(new Error("This Image does not have the correct format"), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3_000_000 },
  fileFilter,
});

export const userRouter = Router();

userRouter.get(
  "/users/me/avatar",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.user?._id);

      if (!user || !user.avatar) {
        throw new Error();
      }

      res.set("Content-Type", "image/jpg");
      res.send(user.avatar);
    } catch (err) {
      res.status(404).send();
    }
  },
);

userRouter.delete(
  "/users/me/avatar",
  authMiddleware,
  async (req: Request, res: Response) => {
    const user = req.user!;

    user.avatar = null;
    await user.save();
    res.status(200).send();
  },
  (error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400).send({ error: error.message });
  },
);

userRouter.post(
  "/users/me/avatar",
  authMiddleware,
  upload.single("avatar"),
  async (req: Request, res: Response) => {
    const file = req.file!;
    const user = req.user!;

    user.avatar = await sharp(file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    await user.save();
    res.status(200).send();
  },
  (error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400).send({ error: error.message });
  },
);

userRouter.post("/users/login", async (req: Request, res: Response) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password,
    );
    const token = await user.generateAuthToken();
    res.cookie("Authorization", token, { httpOnly: true });
    res.redirect("/users/me");
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

userRouter.get("/", async (req: Request, res: Response) => {
  res.render("index", {});
});
