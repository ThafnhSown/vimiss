import { UnauthorizedError } from "@/common/errors";
import { successResponse } from "@/common/responses";
import authController from "@/controllers/auth.controller";
import authService from "@/services/auth.service";
import asyncHandler from "@/utils/asyncHandler";
import { getCookieOptions } from "@/utils/cookie";
import { serialize } from "cookie";
import { Router } from "express";
import moment from "moment";

const router = Router();

router.post("/login", asyncHandler(authController.login))

router.post("/register", asyncHandler(async (req, res) => {
  const { account, password } = req.body
  const data = await authService.register({
    account,
    password
  })
  return successResponse(res, data)
}))

// router.get("/auth/google",  passport.authenticate('google', { scope: ['profile', 'email'] }))

// router.get("/auth/google/callback",  passport.authenticate('google', { failureRedirect: '/' }),
//   (req, res) => {
//     var accessTokenKey = getCMSAccessTokenKey(); 
//     var refreshTokenKey = getCMSRefreshTokenKey()
//     const maxAgeRefreshToken = moment().add(1, "month").diff(moment(), "seconds");
//     if (accessTokenKey && refreshTokenKey) {
//       res.setHeader(
//         'Set-Cookie',
//         [
//           serialize(accessTokenKey, req.user.accessTokenKey, { httpOnly: true, ...getCookieOptions() }),
//           serialize(refreshTokenKey, req.user.refreshTokenKey, { httpOnly: true, ...getCookieOptions({ maxAge: maxAgeRefreshToken }) })
//         ]
//       )
//     }
//     return successResponse(res, req.user);
//   })

router.post("/refresh-token", asyncHandler(async (req, res) => {
  const token = req.cookies[getRefreshTokenKey()] || req.body.refreshToken;
  if (!token) throw new UnauthorizedError();
  const data = await authService.refreshToken(token);
  if (!data) throw new UnauthorizedError();
  const maxAgeRefreshToken = moment().add(1, "month").diff(moment(), "seconds");
  res.setHeader(
    'Set-Cookie',
    [
      serialize(getAccessTokenKey(), data.accessToken, { httpOnly: true, ...getCookieOptions() }),
      serialize(getRefreshTokenKey(), data.refreshToken, { httpOnly: true, ...getCookieOptions({ maxAge: maxAgeRefreshToken }) })
    ]
  )
  return successResponse(res);
}))

router.post("/logout", asyncHandler(async (req, res) => {
  res.setHeader(
    'Set-Cookie',
    [
      serialize(getAccessTokenKey(), "", { httpOnly: true, ...getCookieOptions({ maxAge: 0 }) }),
      serialize(getRefreshTokenKey(), "", { httpOnly: true, ...getCookieOptions({ maxAge: 0 }) })
    ]
  )
  return successResponse(res);
}))

export { router as authRouter };
