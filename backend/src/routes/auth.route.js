import express from "express";
import {
    register,
    login,
    logout,
    forgetPassword
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    authLimiter,
    logoutLimiter
} from "../middlewares/ratelimite.middleware.js";

const authRoute = express.Router()

authRoute.post("/",authLimiter, register) // Register user Route
authRoute.post("/login", login) // Login User Route
authRoute.get("/logout",logoutLimiter, logout) // Logout Route
authRoute.put("/forget-password",authLimiter, verifyJWT, forgetPassword) // Forget Password Route

export default authRoute