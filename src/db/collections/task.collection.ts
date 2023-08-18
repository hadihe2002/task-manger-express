import { Schema, model, Document } from "mongoose";

interface ITask extends Document {
  description: string;
  completed: boolean;
  user: Schema.Types.ObjectId;
}

const taskSchema = new Schema<ITask>({
  description: {
    type: "string",
    required: true,
    trim: true,
  },
  completed: {
    type: "boolean",
    default: false,
  },
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

export const Task = model<ITask>("task", taskSchema);
