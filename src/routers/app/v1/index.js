import { Router } from "express";
import { authRouter } from "./auth";
import { userRouter } from "./users";
import { webConfigRouter } from "./web-configs";

const router = Router();

router.use(authRouter);
router.use(userRouter);
router.use(webConfigRouter);

export {
  router as v1Routers
}
