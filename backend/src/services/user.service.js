import { prisma } from "../configs/prisma.config.js";
import bcrypt from "bcrypt";
import tokenProvider from "../providers/token/token.provider.js";
import cookieParser from "cookie-parser";
import ApiResponse from "../utils/apiResponse.util.js";
import { redis } from "../configs/redis.config.js";


class USER_SERVICE{
    async getME(id) {
        try {
            const cacheUser = await redis.get(`userId:${id}`)
            if (cacheUser) {
                return JSON.parse(cacheUser)
            }
            const user = prisma.user.findUnique({
                where: {
                    id
                }
            })

            return user
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async updateUser(data, id) {
        try {
            const updateData = {
                ...(data.email?.trim() && {
                    email: data.email.trim()
                }),

                ...(data.username?.trim() && {
                    username: data.username.trim()
                })
            };

            const updateUser =  await prisma.user.update({
                where: { id },
                data: updateData
            });


            const key = `userID:${id}`
            await redis.del(key)
            await redis.set(key, updateUser)
            return updateUser

        } catch (err) {
            throw new Error(err.message);
        }
    }
    
    async deleteUser(id) {
        try {
            const user = await prisma.user.delete({
                where: {
                    id
                }
            })

            const key = `userID:${id}`
            await redis.del(key)

            return user
        } catch (err) {
            throw new Error(err.message)
        }
    }
}

export default new USER_SERVICE()