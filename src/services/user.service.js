import { UserModel } from "@/db/models/User";
import { UserRoleModel } from "@/db/models/UserRole";
import mongoose from "mongoose";
import { convertToObjectIdMongodb } from "@/utils/convertToObjectIdMongoDb";

export default {
    async listUser(args) {
        const {
            offset = 0,
            limit = 10,
          } = args;
      
          if (!limit) return { total: 0, data: [] }
          const filter = { status : 0}
          const total = await UserModel.countDocuments(filter)
      
          /** @type {Array<NewsCategory>} */
          const users = await UserModel
            .aggregate([
              {
                $lookup: {
                  from:"userroles",
                  localField:"_id",
                  foreignField: "userId",
                  as: "activeUser"
                },
              },
              {
                $project: {
                  password: 0
                }
              }
            ])
            .match(filter)
            .sort({ index: 1 })
            .skip(offset)
            .limit(limit)
         
          return {
            total,
            data: users
          };
    },

    async activeUser(id) {
      const userId = new mongoose.Types.ObjectId(id)
      const existingUserRole = await UserRoleModel.findOne({ userId: id, builtInRole: 1 });
      if (existingUserRole) {
        console.log('Người dùng đã có vai trò.');
        return null;
      }
      const newUserRole = await UserRoleModel.create({
        userId: userId,
        builtInRole: 1
      })
      const savedUserRole = await newUserRole.save()

      return savedUserRole
    },
    async updateCustomRole(args) {
        const { id, roleId } = args
        const filter = { userId: convertToObjectIdMongodb(id)}
        const userRole = await UserRoleModel.updateOne(filter, {
          $addToSet: {
            customRoleId: convertToObjectIdMongodb(roleId),
            lastUpdate: Date.now()
          },
        }, { new: true})
        return userRole
        
    },
    async findUserById(id) {
      const filter = { userId: id }
      const result = await UserRoleModel.findOne(filter).select("-password")
      return result
    },

    async deleteUser(id) {
      const filter = { _id: convertToObjectIdMongodb(id)}
      const foundUser = UserModel.updateOne(filter, {
        $set: {
          status: 1
        }
      })
      await UserRoleModel.deleteOne({userId: convertToObjectIdMongodb(id)})
      return foundUser
    },

    async createByOAuth(args) {
      const {
        account: _account,
        oauthId: _oauthId,
        oauthService="Google",
        avatar: _avatar
      } = args
      const account = _account?.trim().toLowerCase();
      const oauthId = _oauthId
      const avatar = _avatar
      const user = await UserModel.create({
        account, 
        oauthId,
        oauthService,
        avatar
      })
      await UserRoleModel.create({
        userId: user._id,
        builtInRole: 1
      })
      return user
    },

    async findByOAuthId(strategy, id, select) {
      const foundUser = await UserModel.findOne({
        oauthId: id, 
        oauthService : strategy
      }).select(select)

      return foundUser
    }
    
}