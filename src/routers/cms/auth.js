import { UnauthorizedError } from "@/common/errors";
import { failureResponse, successResponse } from "@/common/responses";
import authController from "@/controllers/auth.controller";
import { jwtCMS } from "@/middlewares/auth";
import authService from "@/services/auth.service";
import asyncHandler from "@/utils/asyncHandler";
import { getCookieOptions } from "@/utils/cookie";
import { CMSPermission } from "@/utils/permission";
import { getCMSAccessTokenKey, getCMSRefreshTokenKey } from "@/utils/token";
import { serialize } from "cookie";
import { Router } from "express";
import { AuthCode } from "@gitlab-koolsoft-dev/vimiss-portal-config"
import moment from "moment";
import passport from "passport"


const router = Router();

router.post("/login", asyncHandler(authController.login))

router.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get("/auth/google/callback", passport.authenticate('google', 
  { successRedirect: '/api/cms/login/success',
    failureRedirect: "/login/failed" }
    ))

router.get("/login/success", asyncHandler(authController.googleOAuth));

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});
router.post("/login/gsi", asyncHandler(authController.googleGSI))

router.post("/refresh-token", asyncHandler(async (req, res) => {
  const token = req.cookies[getCMSRefreshTokenKey()] || req.body.refreshToken;
  if (!token) throw new UnauthorizedError();
  const data = await authService.refreshToken(token);
  if (!data) throw new UnauthorizedError();
  const maxAgeRefreshToken = moment().add(1, "month").diff(moment(), "seconds");
  res.setHeader(
    'Set-Cookie',
    [
      serialize(getCMSAccessTokenKey(), data.accessToken, { httpOnly: true, ...getCookieOptions() }),
      serialize(getCMSRefreshTokenKey(), data.refreshToken, { httpOnly: true, ...getCookieOptions({ maxAge: maxAgeRefreshToken }) })
    ]
  )
  return successResponse(res);
}))

router.post("/logout", asyncHandler(async (req, res) => {
  res.setHeader(
    'Set-Cookie',
    [
      serialize(getCMSAccessTokenKey(), "", { httpOnly: true, ...getCookieOptions({ maxAge: 0 }) }),
      serialize(getCMSRefreshTokenKey(), "", { httpOnly: true, ...getCookieOptions({ maxAge: 0 }) })
    ]
  )
  return successResponse(res);
}))

router.post("/session", jwtCMS, (req, res) => {
  const credential = req.credential
  if (!CMSPermission.canLogin(credential.roles)) {
    return failureResponse(res, { code: AuthCode.PERMISSION_NOT_GRANTED })
  }
  return successResponse(res);
})

export { router as cmsAuthRouter };
