const { UserRoleModel } = require('@/db/models/UserRole');
import { signCredentials } from "@/services/jwt.helper";
const userService = require('@/services/user.service');
import { AuthCode } from "@gitlab-koolsoft-dev/vimiss-portal-config";

async function loginByGoogle(userData) {
    var newUser, accessTokenKey, refreshTokenKey
    const foundUser = await userService.findByOAuthId("Google", userData.sub)
          if(foundUser) {
            newUser = foundUser
          } else {
              newUser = await userService.createByOAuth({
              account: userData.email,
              oauthId: userData.sub,
              avatar: userData.picture
            })
          }
            const credential = { id: newUser._id}
            const roles = await UserRoleModel.find({userId: newUser._id})
            const credentialRoles = roles.map((e) => ({
              builtInRole: e.builtInRole
            }))
            const customRoles = roles.map((e) => ({
              customRoleId: e.customRoleId
            }))
            credential.roles = credentialRoles
            credential.customRoles = customRoles
            accessTokenKey = signCredentials({ type: "accessToken", credential });
            refreshTokenKey = signCredentials({ type: "refreshToken", credential });

            return {
              id: newUser._id,
              account: newUser.account,
              avatar: newUser.avatar,
              code: AuthCode.SUCCESS,
              accessToken: accessTokenKey,
              refreshToken: refreshTokenKey,
              roles: credential.roles,
              customRole: credential.customRoles,
            }
}

module.exports ={ loginByGoogle }