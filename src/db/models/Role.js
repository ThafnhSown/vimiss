import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema({
  role: {
    type: String,
    required: true
  },
  scope: {
    type: Array
  },
  permission: {
    type: Array
  }
}, {
  versionKey: false, timestamps: false
})

export const RoleModel = mongoose.model('Role', roleSchema)
