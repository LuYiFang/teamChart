import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SECRET_KEY, saltRounds } from "../utils/constants";
import UserModel from "../models/userModel";
import MessageModel from "../models/messageModel";
import WishModel, { WishVoteModel } from "../models/wishModel";

class ChartController {
  async getAllMessageHistory() {
    const messageList = await MessageModel.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .select({ username: 1, message: 1, groupId: 1, createdAt: 1, _id: 0 })
      .sort({ createdAt: 1 });
    return messageList;
  }

  async saveMessage(username: string, groupId: string, message: string) {
    new MessageModel({
      username: username,
      groupId: groupId,
      message: message,
    }).save();
  }

  async getOpenWishBoard() {
    const wishList = await WishModel.find({ status: "open" })
      .sort({ createdAt: 1 })
      .select({ username: 1, content: 1, voteCount: 1, createdAt: 1 });

    return wishList;
  }

  async saveOpenWishBoard(username: string, content: string) {
    return await new WishModel({
      username: username,
      content: content,
    }).save();
  }

  async voteWish(wishId: string, username: string) {
    await new WishVoteModel({
      wishId: wishId,
      username: username,
    }).save();
  }
}

export default ChartController;
