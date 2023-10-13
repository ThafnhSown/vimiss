import userService from "@/services/user.service";
import { ParseQuery } from "@/utils/http";
import { successResponse } from "@/common/responses";

export default {
    async listUser(req, res) {
        const offset = ParseQuery.num(req.query.offset);
        const limit = ParseQuery.num(req.query.limit);
        const data = await userService.listUser({
          offset,
          limit
        })
        return successResponse(res, data)
    },

    async activeUser(req, res) {
      const id = req.params.id
      const result = await userService.activeUser(id)
      return successResponse(res, result)
    },

    async updateCustomRole(req, res) {
      userService.updateCustomRole(req.body)
      return successResponse(res)
    },
    
    async findUserById(req, res) {
      const id = req.body
      const result = await userService.findUserById(id)
      return successResponse(res, result)
    },

    async deleteUser(req, res) {
      const id = req.params.id
      const result = await userService.deleteUser(id)
      return successResponse(res)
    }
}