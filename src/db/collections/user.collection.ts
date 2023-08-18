import { compare, hash } from "bcryptjs";
import { Schema, model, Model, HydratedDocument, Document } from "mongoose";
import validator from "validator";
import {
  CustomError,
  EMAIL_OR_PASSWORD_IS_INCORRECT,
  USER_NOT_FOUND,
} from "../../errors";
import * as jwt from "jsonwebtoken";
import { Task } from "./task.collection";

// INTERFACE
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  age: number;
  tokens: { _id: string; token: string }[];
}

// METHODS
export interface IUserMethods {
  generateAuthToken(): Promise<string>;
}

// STATICS
export interface UserModel extends Model<IUser, {}, IUserMethods> {
  findByCredentials(
    email: string,
    password: string,
  ): Promise<HydratedDocument<IUser, IUserMethods>>;
}

// SCHEMA
export const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  name: { type: "string", required: true, trim: true },
  email: {
    type: "string",
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate(email: string) {
      if (!validator.isEmail(email)) {
        throw new Error("Email Is Invalid!");
      }
    },
  },
  password: {
    type: "string",
    required: true,
    minlength: 8,
    trim: true,
    validate(value: string) {
      if (value.toLocaleLowerCase().includes("password")) {
        throw new Error("Password Should Not Contain 'password'!");
      }
    },
  },
  age: {
    type: "number",
    default: 0,
    validate(value: number) {
      if (value < 0) {
        throw new Error("age must be an positive integer");
      }
    },
  },
  tokens: [
    {
      token: {
        type: "string",
        required: true,
      },
    },
  ],
});

// VIRTUAL RELATION
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "user",
});

// STATIC
userSchema.static(
  "findByCredentials",
  async function findByCredentials(email: string, password) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError(USER_NOT_FOUND);
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new CustomError(EMAIL_OR_PASSWORD_IS_INCORRECT);
    }

    return user;
  },
);

// METHODS
userSchema.method("generateAuthToken", async function generateAuthToken() {
  const token = jwt.sign({ _id: this.id }, "JWT@12345", {
    expiresIn: "7 days",
  });

  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
});

// OVERRIDE BUILTIN METHODS
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.tokens;
  },
});

// PRE METHODS
userSchema.pre("deleteOne", { document: true }, async function () {
  await Task.deleteMany({ user: this._id });
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await hash(user.password, 8);
  }

  next();
});

export const User = model<IUser, UserModel>("user", userSchema);
