import mongoose, { Schema, Types } from "mongoose";

export const newsTbl = "News";

const newsSchema = new Schema({
  slug: String,
  authorId: {
    type: Types.ObjectId,
  },
  createDate: Number,
  lastUpdate: Number,
  content: String,
  summary: String,
  title: String,
  pinyinTitle: String,
  status: Number,
  excerpt: String,
  locale: String,
}, {
  versionKey: false,
  timestamps: false
})

newsSchema.index({ title: "text", pinyinTitle: "text" })

export const NewsModel = mongoose.model(newsTbl, newsSchema)