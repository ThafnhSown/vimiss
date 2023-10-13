import mongoose, { Schema, Types } from "mongoose";

export const newsCategoryTbl = "NewsCategory";

const newsCategorySchema = new Schema({
  title: String,
  desc: String,
  slug: String,
  avatar: String,
  createDate: Number,
  lastUpdate: Number,
  status: Number,
  parentId: {
    type: Types.ObjectId,
    ref: newsCategoryTbl
  },
  type: Number,
  index: Number,
  locale: String
}, {
  versionKey: false,
  timestamps: false
})

newsCategorySchema.index({ index: 1 })

export const NewsCategoryModel = mongoose.model(newsCategoryTbl, newsCategorySchema)