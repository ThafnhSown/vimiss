import newsCategoryController from "@/controllers/news-category.controller";
import asyncHandler from "@/utils/asyncHandler";
import { AuthPage } from "@/middlewares/permission"

import { Router } from "express";

const router = Router();

router.get("/news-categories", asyncHandler(newsCategoryController.listCategories))
router.get("/news-categories/:id", asyncHandler(newsCategoryController.retrieveCategory))
router.post("/news-categories", AuthPage('create'), asyncHandler(newsCategoryController.createCategory))
router.put("/news-categories/:id", AuthPage('update'), asyncHandler(newsCategoryController.partialUpdateCategory))
router.delete("/news-categories/:id", AuthPage('delete'), asyncHandler(newsCategoryController.deleteCategory))


export { router as cmsNewsCategoryRouters };
