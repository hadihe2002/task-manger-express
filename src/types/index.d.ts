import { IUser } from "../db/collections";
import "@types/jest";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      token?: string;
    }
  }
}
