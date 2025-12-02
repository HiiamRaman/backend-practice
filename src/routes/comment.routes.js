import {Router} from 'express'
import { createComment,getAllVideoComment,updateComment,deleteComment } from '../controllers/comment.controller.js'

import { verifyJWT } from '../middlewares/auth.middleware'
const router = Router()

router.use(verifyJWT) // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(getAllVideoComment).post(createComment)

router.route("/c/:commentId").delete(deleteComment).patch(updateComment)
export default router