import mongoose, { Schema, Types } from "mongoose";
import { userTbl } from "./User";

export const userRoleTbl = "UserRole";

const userRoleSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: userTbl
  },
  builtInRole: Number,
  customRoleId: [{
    type: Types.ObjectId,
    ref: 'Role'
  }]
}, { versionKey: false, timestamps: false })

export const UserRoleModel = mongoose.model(userRoleTbl, userRoleSchema);