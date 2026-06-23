import express from "express";
import {
    getMe,
    getUser,
    deleteMe,
    deleteUser,
    updateUser
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const userRouter = express.Router()

userRouter.get("/me", verifyJWT, getMe)
userRouter.get("/:id", getUser)
userRouter.put("/",verifyJWT,updateUser)
userRouter.delete("/", verifyJWT, deleteMe)
userRouter.delete("/:id",deleteUser)

export default userRouter