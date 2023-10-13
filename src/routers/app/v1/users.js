import { successResponse } from "@/common/responses";
import { jwtMiddleware } from "@/middlewares/auth";
import asyncHandler from "@/utils/asyncHandler";
import { Router } from "express";

const router = Router();

router.post("/users/me", jwtMiddleware, asyncHandler(async (req, res) => {
  successResponse(res, { name: "user/me" })
}))

export { router as userRouter };
