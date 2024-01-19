import mongoose, { Document, Schema } from "mongoose";

interface User extends Document {
  username: string;
  password: string;
}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createTime: { type: Date, default: Date.now },
});

const UserModel = mongoose.model<User>("users", UserSchema);
export default UserModel;
