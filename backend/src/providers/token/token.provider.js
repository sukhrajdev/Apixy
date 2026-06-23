import jwt from "jsonwebtoken";
import { prisma } from "../../configs/prisma.config.js";

class tokenProvider {
    async generate_Verification_Token(id) {
        if (!id) {
            throw new Error("To Generate a Token you need to Provide Token.")
        }

        const verificationToken = await jwt.sign({ id }, process.env.VERIFICATION_TOKEN_SECRET, { expiresIn: process.env.VERIFICATION_TOKEN_EXPIREY })
        return verificationToken
    }
    async decrypt_Verification_Token(token) {
        try {
            const user = await jwt.verify(token, process.env.VERIFICATION_TOKEN_SECRET);
            if (Object.keys(user ?? 0).length == 0) {
                return `INVAILD Token`
            }
            
            return user
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async generate_Refresh_Token(id) {
        if (!id) {
            throw new Error("To Generate a Token you need to Provide Token.")
        }

        const refreshToken = await jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIREY })
        return refreshToken
    }

    async generate_Access_Token(id) {
        if (!id) {
            throw new Error("To Generate a Token you need to Provide Token.")
        }

        const accessToken = await jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIREY })
        return accessToken
    }

    async generate_Api_Token(id) {
        try {
            
            if (!id) {
                throw new Error("To Generate a Token you need to Provide Token.")
            }

            const apiToken= await jwt.sign({
                id,
            },
                process.env.API_TOKEN_SECRET,
                { expiresIn: process.env.API_TOKEN_EXPIREY })

            return apiToken
        } catch (err) {
            console.log(`Error occured in Token Provider: ${err.message}`)
        }
    }

    async decrypt_Api_Token(ApiToken) {
        try {
            
            
            const apiKey = await jwt.verify(ApiToken, process.env.API_TOKEN_SECRET)
            if (!apiKey) {
                throw new Error(`Api Token is invaild or Expirey.`)
            }
            console.log(apiKey);

            return apiKey
        } catch (err) {
            console.log(`Error occured in Token Provider: ${err.message}`)
        }
    }

    async api_provider_Token(id, Provider) {
        try {
            const apiKey = await prisma.api.findFirst({
                where: {
                    ownerId: id,
                    provider:Provider
                },
                orderBy: {
                    createdAt: "desc"
                }
            })

            return apiKey
        } catch (err) {
            throw new Error(`<<< ERROR: ${err.message} >>>`)
            console.log(err.message);
            
        }
    }
}

export default new tokenProvider()