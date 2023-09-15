import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { User } from "../db/collections";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers
      .cookie!.split("Authorization=")[1]
      .replace("Bearer", "")
      .trim();
    const decoded = verify(token, "JWT@12345") as JwtPayload;
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("FORBIDDEN RESOURCE");
  }
};
