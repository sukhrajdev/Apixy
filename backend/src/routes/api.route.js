import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { ApiTokenVerify } from "../middlewares/Apitoken.middleware.js";
import {
    createApi,
    getApi,
    getAllApi,
    ChatWithModel,
    ChatWithStream,
    deleteApi,
    updateApi
} from "../controllers/api.controller.js";
import {aiLimiter} from "../middlewares/ratelimite.middleware.js";

const apiRouter = express.Router();

apiRouter.post("/chat",aiLimiter, ApiTokenVerify, ChatWithModel);
apiRouter.post("/chat/stream",aiLimiter, ApiTokenVerify, ChatWithStream);

apiRouter.post("/providers/:provider",aiLimiter, verifyJWT, createApi);
apiRouter.put("/providers/:apiId",aiLimiter, verifyJWT, updateApi);

apiRouter.get("/",aiLimiter, verifyJWT, getApi);
apiRouter.get("/all",aiLimiter, verifyJWT, getAllApi);

apiRouter.delete(`/:apiId`,aiLimiter, verifyJWT, deleteApi);


export default apiRouter;