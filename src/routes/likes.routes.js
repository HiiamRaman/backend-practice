import {Router} from express;
import {toggleCommentLike,toggleVideoLike,getLikedVideo,toggleTweetLike} from '../controllers/like.controller.js'

import { verifyJWT } from '../middlewares/auth.middleware';

const router  = Router()
router.use(verifyJWT)

router.route("/toggle/v/:videoID").post(toggleVideoLike)
router.route("/toggle/c/:commentID").post(toggleCommentLike)
router.route("/toggle/t/:tweetID").post(toggleTweetLike)
router.route("/videos/likesd/:userID").get(getLikedVideo)

export default router