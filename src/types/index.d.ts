import { IUser } from "../db/collections";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      token?: string;
    }
  }
}
