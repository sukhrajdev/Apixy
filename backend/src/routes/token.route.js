import express from "express";
import {
    refreshAccessToken
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {authLimiter} from "../middlewares/ratelimite.middleware.js";

const tokenRouter = express.Router()

tokenRouter.post("/",authLimiter, refreshAccessToken);


export default tokenRouter