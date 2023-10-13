import { Router } from 'express'
import asyncHandler from '@/utils/asyncHandler'
import { AuthPage } from '@/middlewares/permission'
import userController from '@/controllers/user.controller'

const router = Router()

router.get('/user', AuthPage('create'), asyncHandler(userController.listUser))
router.post('/user/:id',AuthPage('create'), asyncHandler(userController.activeUser))
router.patch('/user/update',AuthPage('create'), asyncHandler(userController.updateCustomRole))
router.delete('/user/:id', asyncHandler(userController.deleteUser))
export { router as cmsUserRouters}