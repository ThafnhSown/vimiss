import roleController from "@/controllers/role.controller";
import asyncHandler from "@/utils/asyncHandler";
import { Router } from "express";

const router = Router();

router.get("/role", asyncHandler(roleController.listRole))
router.post("/role", asyncHandler(roleController.createRole))

export { router as cmsRoleRouter }