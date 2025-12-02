import { Router } from "express";
import { healthCheck } from "../controllers/healthcheck.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
const router = Router()

router .route("/").get(healthCheck)



export default router
