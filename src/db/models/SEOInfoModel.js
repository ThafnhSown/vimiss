import mongoose, { Schema, Types } from "mongoose";

export const SEOInfoTbl = "SEOInfo";

const SEOInfoSchema = new Schema({
  title: String,
  description: String,
  keywords: String,
  robot: String,
  redirect: String,
  image: String,
  imageAlt: String,
  imageTitle: String,
  refId: Types.ObjectId,
  refType: Number
}, {
  versionKey: false,
  timestamps: true
})

export const SEOInfoModel = mongoose.model(SEOInfoTbl, SEOInfoSchema)