import mongoose, { Document, Schema } from "mongoose";

interface Message extends Document {
  username: string;
  message: string;
  groupId: string;
}

const MessageSchema = new Schema(
  {
    username: {
      type: String,
      ref: "users",
      required: true,
    },
    message: { type: String, required: true },
    groupId: { type: String, required: true },
    // createTime: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: true,
  },
);

const MessageModel = mongoose.model<Message>("messages", MessageSchema);
export default MessageModel;
