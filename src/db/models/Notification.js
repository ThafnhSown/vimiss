import mongoose, { Schema, Types } from "mongoose";

export const notificationTbl = "Notification";

const notificationSchema = new Schema({
  userId: {
    type: Types.ObjectId,
  },
  senderId: {
    type: Types.ObjectId,
  },
  newsId: {
    type: Types.ObjectId,
    required: true,
    ref: "Order",
  },
  message: {
    type: String,
    required: true,
  },
}, {
  versionKey: false,
  timestamps: false
})

export const NotificationModel = mongoose.model(notificationTbl, notificationSchema)