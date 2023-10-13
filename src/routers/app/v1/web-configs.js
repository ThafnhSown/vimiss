import webSettingController from "@/controllers/webSetting.controller";
import asyncHandler from "@/utils/asyncHandler";
import { Router } from "express";

const router = Router();

router.get("/web-configs/menu", asyncHandler(webSettingController.getMenuItems));

export { router as webConfigRouter }