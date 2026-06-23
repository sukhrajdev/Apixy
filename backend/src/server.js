import express from "express";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import tokenRouter from "./routes/token.route.js";
import apiRouter from "./routes/api.route.js";
import { Verifier } from "./controllers/auth.controller.js";
import { verifyJWT } from "./middlewares/auth.middleware.js";

const app = express()

app.use(cookieParser())
app.use(express.json())


app.use("/api/v1/auth", authRoute)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tokens", tokenRouter)
app.use("/api/v1/apis", apiRouter)

app.get("/", (req, res) => {
    res.send("  H.E.L.L.O FROM APIXY BACKEND!!    ")
})
app.get("/verify/:verificationToken",Verifier)

app.listen(3000, () => {
    console.log("Server Running in port 3000")
})