import MessageModel from "../models/messageModel";
import WishModel, { WishVoteModel } from "../models/wishModel";
import mongoose from "mongoose";

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
    const wishListWithVote = await WishModel.aggregate([
      {
        $match: { status: "open" },
      },
      {
        $lookup: {
          from: "wishvotes",
          localField: "_id",
          foreignField: "wishId",
          as: "wishVotes",
        },
      },
      {
        $addFields: {
          voteCount: { $size: "$wishVotes" },
        },
      },
      {
        $sort: { createdAt: 1 },
      },
      {
        $project: {
          username: 1,
          content: 1,
          voteCount: 1,
          createdAt: 1,
        },
      },
    ]);

    return wishListWithVote;
  }

  async saveOpenWishBoard(username: string, content: string) {
    return await new WishModel({
      username: username,
      content: content,
    }).save();
  }

  async countVote(wishId: string) {
    const voteCount = await WishVoteModel.aggregate([
      {
        $match: { wishId: new mongoose.Types.ObjectId(wishId) },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          count: 1,
        },
      },
    ]);
    return voteCount.length > 0 ? voteCount[0].count : 0;
  }

  async voteWish(wishId: string, username: string) {
    await new WishVoteModel({
      wishId: new mongoose.Types.ObjectId(wishId),
      username: username,
    }).save();
  }
}

export default ChartController;
