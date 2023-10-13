import { UserModel } from "@/db/models/User";
import { genSalt, hash, compare } from "bcryptjs";
import { AuthCode, UserStatus } from "@gitlab-koolsoft-dev/vimiss-portal-config";
import { signCredentials, verifyCredentials } from "./jwt.helper";
import { UserRoleModel } from "@/db/models/UserRole";
// import {passportGoogleGSI, passportGoogleSSO} from "@/utils/loginGoogle"
import { loginByGoogle } from "@/utils/loginByGoogle" 
import jwt_decode from 'jwt-decode'

async function hashPwd(plain) {
  const salt = await genSalt();
  return hash(plain, salt);
}
async function compareHashPwd(plain, hash) {
  return compare(plain, hash);
}

export default {
  /**
   * 
   * @param {{
   *  account: string;
   *  password: string;
   * }} args 
   */
  async register(args) {
    const {
      account: _account,
      password: _password
    } = args;
    const account = _account?.trim().toLowerCase();
    if (!account) return { code: AuthCode.ERROR };

    const password = _password;
    if (!password) return { code: AuthCode.ERROR };

    const exUser = await UserModel.exists({
      account
    })

    if (!!exUser) return { code: AuthCode.DUPLICATED };
    const _hashPwd = await hashPwd(password);
    await UserModel.create({ account, password: _hashPwd })
    return { code: AuthCode.SUCCESS }
  },

  /**
     * 
     * @param {{
  *  account: string;
  *  password: string;
  *  withRole?: boolean;
  * }} args 
  */
  async login(args) {
    const {
      account: _account,
      password: _password,
      withRole
    } = args;

    const account = _account?.trim().toLowerCase();
    if (!account) return { code: AuthCode.ERROR };

    const password = _password;
    if (!password) return { code: AuthCode.ERROR };

    const user = await UserModel.findOne({
      account,
      status: {
        $ne: UserStatus.DELETED
      }
    }).exec()
    if (!user) return { code: AuthCode.NOT_EXISTS };

    const isValidPwd = await compareHashPwd(password, user.password);
    if (!isValidPwd) return { code: AuthCode.WRONG_PWD };

    /** @type {import("@gitlab-koolsoft-dev/vimiss-portal-config").Credential} */
    const credential = { id: user._id };
    if (withRole) {
      const roles = await UserRoleModel.find({ userId: user._id })
      const credentialRoles = roles.map((e) => ({
        builtInRole: e.builtInRole
      }))
      const customRoles = roles.map((e) => ({
        customRoleId: e.customRoleId
      }))
      credential.roles = credentialRoles
      credential.customRoles = customRoles
    }
   
    const accessToken = signCredentials({ type: "accessToken", credential });
    const refreshToken = signCredentials({ type: "refreshToken", credential });

    return {
      id: user._id,
      account: user.account,
      avatar: user.avatar,
      code: AuthCode.SUCCESS,
      accessToken,
      refreshToken,
      roles: credential.roles,
      customRole: credential.customRoles
    }

  },

  /**
   * 
   * @param {string} token 
   * @returns 
   */
  async refreshToken(token) {
    const credential = verifyCredentials({ token, type: "refreshToken" });
    if (!credential || typeof credential === "string") return null;
    const newCredential = { id: credential.id, roles: credential.roles };

    const accessToken = signCredentials({ type: "accessToken", credential: newCredential });
    const refreshToken = signCredentials({ type: "refreshToken", credential: newCredential });
    return {
      accessToken,
      refreshToken
    }
  },

  async googleOAuth(args) {
    const data = await loginByGoogle(args)
    return data
  },

  async googleGSI(args) {
    const userData = jwt_decode(args.jwt)
    const data = await loginByGoogle(userData)
    return data
  }
}

