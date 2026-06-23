import express from "express";
import {
    refreshAccessToken
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const tokenRouter = express.Router()

tokenRouter.post("/", refreshAccessToken);


export default tokenRouter