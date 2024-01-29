import mongoose, { Document, Schema, SchemaTypes } from "mongoose";

enum WishStatus {
  Open = "open",
  Close = "close",
}

interface Wish extends Document {
  id: mongoose.Types.ObjectId;
  username: string;
  content: string;
  status: WishStatus;
  createdAt: Date;
}

const WishSchema = new Schema(
  {
    username: { type: String, required: true },
    content: { type: String, required: true },
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

WishVoteSchema.pre("save", async function (next) {
  const wishVote = this;

  const existingVote = await WishVoteModel.findOne({
    wishId: wishVote.wishId,
    username: wishVote.username,
  });

  if (existingVote) {
    const error = new Error("Duplicate wishId and username combination");
    return next(error);
  }

  next();
});

export const WishVoteModel = mongoose.model<WishVote>(
  "wishVote",
  WishVoteSchema,
);
