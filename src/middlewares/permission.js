import { verifyCredentials } from "@/services/jwt.helper";
import { UnauthorizedError } from "@/common/errors";
import { getCMSAccessTokenKey } from "@/utils/token";
import { AuthErrorCode } from "@gitlab-koolsoft-dev/vimiss-portal-config/authCode";
import { checkScope } from "./checkScope";
const redisClient = require("@/middlewares/redis")

const AuthPage = (permission) => {
    return async (req, res, next) => {
        const token = req.cookies[getCMSAccessTokenKey()];
        if (!token) throw new UnauthorizedError();
        const credential = verifyCredentials({ type: "accessToken", token })
        if (!credential) throw new UnauthorizedError();
        if (credential.tokenExpired) throw new UnauthorizedError({ data: AuthErrorCode.TokenExpired });
        req.credential = credential
        const listRoleId = credential.customRoles[0].customRoleId
        const listRole = []
        await Promise.all(
            listRoleId.map((roleId) => (
                redisClient.get(roleId).then((response) => {
                    listRole.push(JSON.parse(response))
                })
            ))
        )
        var check = 0
        for(const role of listRole) {
            if(checkScope(role.scope, req.url)) {
                if(role.permission.includes(permission)) {
                    check = 1
                    break;
                }
            } else {
                return res.status(403).json("You do not have permission to access")
            }
        }
        if(check == 1) {
            next()
        } else {
            return res.status(403).json("You do not have permission to access")
        }
       
    }
}

module.exports = {AuthPage}