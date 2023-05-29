import express from 'express'
import {getData, trial} from "../controllers/statesController"
import * as access from "../middlewares/auth"

const router = express.Router()


router.post("/add", trial )
router.get("/getInfo", access.RequireAuth, getData)


export default router