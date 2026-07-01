import express from "express";
import {
    getMe,
    getUser,
    deleteMe,
    deleteUser,
    updateUser
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    authLimiter,
    logoutLimiter
} from "../middlewares/ratelimite.middleware.js";


const userRouter = express.Router()

userRouter.get("/me",authLimiter,verifyJWT, getMe)
userRouter.get("/:id",authLimiter, getUser)
userRouter.put("/",logoutLimiter,verifyJWT,updateUser)
userRouter.delete("/",authLimiter, verifyJWT, deleteMe)
userRouter.delete("/:id",authLimiter,deleteUser)

export default userRouter