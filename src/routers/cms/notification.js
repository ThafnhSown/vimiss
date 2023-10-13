import notificationController from "@/controllers/notification.controller";
import asyncHandler from "@/utils/asyncHandler";
import { Router } from "express";

const router = Router();

router.post("/notification", asyncHandler(notificationController.createNotification))

export { router as cmsNotificationRouter }