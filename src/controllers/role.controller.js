import roleService from "@/services/role.service";
import { successResponse } from "@/common/responses";
import { BadRequestError } from "@/common/errors";

export default {
    async listRole(req, res) {
        const data = await roleService.listRole()
        return successResponse(res,data)
    },

    async createRole(req, res) {
        if(!req.body.role) throw new BadRequestError()
        const data = await roleService.createRole(req.body);
        return successResponse(res, data);
    }
}