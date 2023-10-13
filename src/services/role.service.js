import { RoleModel } from "@/db/models/Role";
import { runTransaction } from "@/utils/mongo";


export default {
    async listRole() {
        const roles = await RoleModel.aggregate().sort({index: 1})
        return { 
            data: roles
        }
    },

    async createRole(args) {
        const {
            role,
            scope = [],
            permission = []
        } = args
        console.log(args)
        const data = await runTransaction(async (session) => {
            const timeServer = Date.now()
            const newRole = new RoleModel({
              role, scope, permission,
              createAt: timeServer
           })
            await newRole.save({session})
            const result = newRole.toObject()
            return result
        })
        return data
    }
}