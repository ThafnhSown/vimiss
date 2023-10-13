const { UserRoleModel } = require('@/db/models/UserRole');
import { signCredentials } from "@/services/jwt.helper";
import jwt_decode from 'jwt-decode'
const userService = require('@/services/user.service');
import { AuthCode } from "@gitlab-koolsoft-dev/vimiss-portal-config";

var accessTokenKey, refreshTokenKey, newUser

async function passportGoogleGSI(jwt) {
    var userData = jwt_decode(jwt.jwt)
    const defaultUser = {
        email: userData.email,
        googleId: userData.sub,
        avatar: userData.picture
    }
    const foundUser = await userService.findByOAuthId("Google", defaultUser.googleId)
          if(foundUser) {
            newUser = foundUser
          } else {
              newUser = await userService.createByOAuth({
              account: defaultUser.email,
              oauthId: defaultUser.googleId,
              avatar: defaultUser.avatar
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

module.exports = {passportGoogleGSI}