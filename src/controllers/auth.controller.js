import { BadRequestError } from "@/common/errors";
import { failureResponse, successResponse } from "@/common/responses";
import { PREFIX_API_CMS } from "@/routers/config";
import authService from "@/services/auth.service";
import { getCookieOptions } from "@/utils/cookie";
import { CMSPermission } from "@/utils/permission";
import { getAccessTokenKey, getCMSAccessTokenKey, getCMSRefreshTokenKey, getRefreshTokenKey } from "@/utils/token";
import { AuthCode } from "@gitlab-koolsoft-dev/vimiss-portal-config";
import { serialize } from "cookie";
import moment from "moment";

export default {
  /** @type {import("express").RequestHandler} */
  async login(req, res) {
    const source = req.baseUrl;
    const { account, password } = req.body;
    if (!account || !password) throw new BadRequestError();
    const withRole = source === PREFIX_API_CMS;
    const data = await authService.login({ account, password, withRole });
    if (data.code === AuthCode.SUCCESS) {
      if (source === PREFIX_API_CMS && !CMSPermission.canLogin(data.roles)) {
        return failureResponse(res, { code: AuthCode.PERMISSION_NOT_GRANTED })
      }
      const maxAgeRefreshToken = moment().add(1, "month").diff(moment(), "seconds");
      let accessTokenKey = '', refreshTokenKey = '';
      if (source === PREFIX_API_CMS) {
        accessTokenKey = getCMSAccessTokenKey(); refreshTokenKey = getCMSRefreshTokenKey()
      } else {
        accessTokenKey = getAccessTokenKey(); refreshTokenKey = getRefreshTokenKey()
      }
      if (accessTokenKey && refreshTokenKey) {
        res.setHeader(
          'Set-Cookie',
          [
            serialize(accessTokenKey, data.accessToken, { httpOnly: true, ...getCookieOptions() }),
            serialize(refreshTokenKey, data.refreshToken, { httpOnly: true, ...getCookieOptions({ maxAge: maxAgeRefreshToken }) })
          ]
        )
      }
      return successResponse(res, data);
    }
    return failureResponse(res, data);
  },

  async googleGSI(req, res) {
    const jwt = req.body
    const data = await authService.googleGSI(jwt)
    let accessTokenKey = '', refreshTokenKey = '';
    const maxAgeRefreshToken = moment().add(1, "month").diff(moment(), "seconds");
    accessTokenKey = getCMSAccessTokenKey(); refreshTokenKey = getCMSRefreshTokenKey()
    if (accessTokenKey && refreshTokenKey) {
      res.setHeader(
        'Set-Cookie',
        [
          serialize(accessTokenKey, data.accessToken, { httpOnly: true, ...getCookieOptions() }),
          serialize(refreshTokenKey, data.refreshToken, { httpOnly: true, ...getCookieOptions({ maxAge: maxAgeRefreshToken }) })
        ]
      )
    }
    return successResponse(res, data)
  },

  async googleOAuth(req, res) {
    const user = req.user
    const data = await authService.googleOAuth(user._json)
    
    let accessTokenKey = '', refreshTokenKey = '';
    const maxAgeRefreshToken = moment().add(1, "month").diff(moment(), "seconds");
    accessTokenKey = getCMSAccessTokenKey(); refreshTokenKey = getCMSRefreshTokenKey()
    if (accessTokenKey && refreshTokenKey) {
      res.setHeader(
        'Set-Cookie',
        [
          serialize(accessTokenKey, data.accessToken, { httpOnly: true, ...getCookieOptions() }),
          serialize(refreshTokenKey, data.refreshToken, { httpOnly: true, ...getCookieOptions({ maxAge: maxAgeRefreshToken }) })
        ]
      )
    }
    return successResponse(res, data)
  }
}