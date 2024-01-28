import mongoose, { Document, Schema, SchemaTypes } from "mongoose";

enum WishStatus {
  Open = "open",
  Close = "close",
}

interface Wish extends Document {
  id: mongoose.Types.ObjectId;
  username: string;
  content: string;
  voteCount: number;
  status: WishStatus;
  createAt: Date;
}

const WishSchema = new Schema(
  {
    username: { type: String, required: true },
    content: { type: String, required: true },
    voteCount: { type: Number, default: 0, required: true },
    status: {
      type: String,
      enum: Object.values(WishStatus),
      default: WishStatus.Open,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const WishModel = mongoose.model<Wish>("wishes", WishSchema);
export default WishModel;

interface WishVote extends Document {
  wishId: mongoose.Types.ObjectId;
  username: string;
}

const WishVoteSchema = new Schema(
  {
    wishId: { type: SchemaTypes.ObjectId, ref: "wishes", required: true },
    username: { type: String, required: true },
  },
  {
    unique: true,
    timestamps: true,
  },
);

export const WishVoteModel = mongoose.model<WishVote>(
  "wishVote",
  WishVoteSchema,
);
