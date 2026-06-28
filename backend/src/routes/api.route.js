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

const apiRouter = express.Router();

apiRouter.post("/chat", ApiTokenVerify, ChatWithModel);
apiRouter.post("/chat/stream", ApiTokenVerify, ChatWithStream);

apiRouter.post("/providers/:provider", verifyJWT, createApi);
apiRouter.put("/providers/:apiId", verifyJWT, updateApi);

apiRouter.get("/", verifyJWT, getApi);
apiRouter.get("/all", verifyJWT, getAllApi);

apiRouter.delete(`/:apiId`, verifyJWT, deleteApi);


export default apiRouter;