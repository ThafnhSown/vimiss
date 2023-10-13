import newsController from "@/controllers/news.controller";
import { AuthPage } from "@/middlewares/permission"
import asyncHandler from "@/utils/asyncHandler";
import { Router } from "express";

const router = Router();

router.get("/news", asyncHandler(newsController.listNews))
router.get("/news/:id", asyncHandler(newsController.retrieveNews))
router.post("/news", AuthPage('create'), asyncHandler(newsController.createNews))
router.put("/news/:id", AuthPage('update'), asyncHandler(newsController.partialUpdateNews))
router.delete("/news/:id", AuthPage('delete'), asyncHandler(newsController.deleteNews))



export { router as cmsNewsRouter }