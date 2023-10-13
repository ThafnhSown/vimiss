import mongoose, { Schema, Types } from "mongoose";

export const menuItemTbl = "MenuItem";

const menuItemSchema = new Schema({
  title: String,
  link: String,
  parentId: {
    type: Types.ObjectId,
    ref: menuItemTbl
  },
  index: Number,
  type: Number,
  locale: String,
  hiddenTitle: Boolean
}, {
  versionKey: false,
  timestamps: false
})

export const MenuItemModel = mongoose.model(menuItemTbl, menuItemSchema);