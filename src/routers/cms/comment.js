import commentController from "@/controllers/comment.controller";
import asyncHandler from "@/utils/asyncHandler";
import { Router } from "express";

const router = Router();

router.post("/comment", asyncHandler(commentController.createComment))
router.get("/comment/:id", asyncHandler(commentController.listCommentInNews))

export { router as cmsCommentRouter }