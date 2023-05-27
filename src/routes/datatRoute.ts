import express from 'express'
import * as statesController from "../controllers/statesController"

const router = express.Router()


router.post("/add", statesController.trial )
router.get("/getInfo", statesController.getData)


export default router