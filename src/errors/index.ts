import { StatusCodes } from "http-status-codes";

export interface ICustomError {
  status: number;
  description: string;
}

export class CustomError extends Error {
  constructor({ status, description }: ICustomError) {
    super();
    this.message = description;
    this["status"] = status;
  }
}

export const USER_NOT_FOUND: ICustomError = {
  status: StatusCodes.NOT_FOUND,
  description: "User Not Found!",
};

export const EMAIL_OR_PASSWORD_IS_INCORRECT: ICustomError = {
  status: StatusCodes.BAD_REQUEST,
  description: "Email Or Password Is Incorrect",
};

export const TASK_NOT_FOUND: ICustomError = {
  description: "Task Not Found",
  status: StatusCodes.NOT_FOUND,
};
