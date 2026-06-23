import express from "express";
import {
    register,
    login,
    logout,
    forgetPassword
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const authRoute = express.Router()

authRoute.post("/", register) // Register user Route
authRoute.post("/login", login) // Login User Route
authRoute.get("/logout", logout) // Logout Route
authRoute.put("/forget-password", verifyJWT, forgetPassword) // Forget Password Route

export default authRoute