import { Router } from "express";
import { cmsAuthRouter } from "./auth";
import { cmsNewsRouter } from "./news";
import { cmsNewsCategoryRouters } from "./news-categories";
import { cmsUserRouters } from "./user";
import { cmsRoleRouter } from "./role";
import { cmsCommentRouter } from "./comment";
import { cmsNotificationRouter } from "./notification";

const router = Router();

router.use(cmsAuthRouter);
router.use(cmsNewsCategoryRouters);
router.use(cmsNewsRouter)
router.use(cmsUserRouters)
router.use(cmsRoleRouter);
router.use(cmsCommentRouter)
router.use(cmsNotificationRouter);


export {
  router as cmsRouters
}