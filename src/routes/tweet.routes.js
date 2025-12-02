 import {Router} from express;
 import { verifyJWT } from "../middlewares/auth.middleware";

 import {createTweets,getUserTweets,deleteTweets,updateTweets} from '../controllers/tweet.controller.js'
 const router = Router()


 router.use(verifyJWT)



 router.route('/').post(createTweets)

 router.route('/user/:userID').get(getUserTweets)
 router.route("/:tweetID").patch(updateTweets).delete(deleteTweets);
 export default router