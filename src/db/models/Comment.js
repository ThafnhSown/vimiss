import mongoose, { Schema, Types } from "mongoose";

export const commentTbl = "Comment";

const commentSchema = new Schema({
  account: String,
  avatar: String,
  userId: {
    type: Types.ObjectId,
  },
  newsId: {
    type: Types.ObjectId,
  },
  content: String
}, {
  versionKey: false,
  timestamps: false
})

export const CommentModel = mongoose.model(commentTbl, commentSchema)