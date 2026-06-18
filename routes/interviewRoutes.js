import express from "express";
const router = express.Router()
import { startInterview , giveResponse} from "../controllers/interviewController.js";
import {protect} from "../middlewares/protectmiddleware.js"

router.post("/start",protect,startInterview)
router.post("/response",protect,giveResponse)

export default router;