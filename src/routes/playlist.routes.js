import {Route} from express;
import { verifyJWT } from "../middlewares/auth.middleware";
import {createPlaylist,getUserPlaylist,getPlaylistById,addVideoToPlaylist,removeVideoFromPlaylist,deletePlaylist,updatePlaylist} from '../controllers/playlist.controller.js'
const router= Route();


router.user(verifyJWT);


router.route('/').post(createPlaylist)

router.route("/:playlistID")
      .get(getPlaylistById)
      .patch(updatePlaylist)
      .delete(deletePlaylist)

      
router.route("/add/:videoID/:playlistID").patch(addVideoToPlaylist);

router.route("/remove/:videoID/:playlistID").patch(removeVideoFromPlaylist);


router.route("/user/:userID").get(getUserPlaylist);
export default router