import { UserStatus } from "@gitlab-koolsoft-dev/vimiss-portal-config";
import mongoose, { Schema } from "mongoose";

export const userTbl = "User";

const userSchema = new Schema({
  account: String,
  password: String,
  status: {
    type: Number,
    default: UserStatus.DEFAULT
  },
  oauthService: {
    type: String, 
    enum: ["Google"]
  },
  oauthId: String,
  avatar: String
}, {
  versionKey: false
})

export const UserModel = mongoose.model(userTbl, userSchema)
