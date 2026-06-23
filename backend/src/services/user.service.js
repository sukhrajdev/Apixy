import { prisma } from "../configs/prisma.config.js";
import bcrypt from "bcrypt";
import tokenProvider from "../providers/token/token.provider.js";
import cookieParser from "cookie-parser";
import ApiResponse from "../utils/apiResponse.util.js";


class USER_SERVICE{
    async getME(id) {
        try {
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

            return await prisma.user.update({
                where: { id },
                data: updateData
            });

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

            return user
        } catch (err) {
            throw new Error(err.message)
        }
    }
}

export default new USER_SERVICE()