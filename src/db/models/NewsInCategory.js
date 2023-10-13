import mongoose, { Schema, Types } from "mongoose";
import { newsTbl } from "./News";
import { newsCategoryTbl } from "./NewsCategory";


export const newsInCategoryTbl = "NewsInCategory";

const newsInCategorySchema = new Schema({
  newsId: {
    type: Types.ObjectId,
    ref: newsTbl
  },
  categoryId: {
    type: Types.ObjectId,
    ref: newsCategoryTbl
  },
  index: Number
}, {
  versionKey: false,
  timestamps: false
})

export const NewsInCategoryModel = mongoose.model(newsInCategoryTbl, newsInCategorySchema)