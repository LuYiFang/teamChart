import mongoose, { Document, Schema } from "mongoose";

interface User extends Document {
  username: string;
  password: string;
}

const UserSchema = new Schema({
  username: String,
  password: String,
});

const UserModel = mongoose.model<User>("users", UserSchema);
export default UserModel;
