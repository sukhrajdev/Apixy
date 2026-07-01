import { prisma } from "../configs/prisma.config.js";
import bcrypt from "bcrypt";
import tokenProvider from "../providers/token/token.provider.js";
import { sendVerifyEmail } from "../providers/email/email.provider.js";
import cookieParser from "cookie-parser";
import { redis } from "../configs/redis.config.js";



const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
}

const select = {
    id: true,
    username: true,
    email:true,
    isVerified: true,
    updatedAt: true,
    createdAt:true
}

// AUTH MAIN CLASS (ALL LOGIC ABOUT AUTHICATION OR AUTHORIZATION)
class AuthService {

    async register(data) {

        // Check if data exists
        if (!data || Object.keys(data).length === 0) {
            throw new Error(
                "Unable to Register User! Please provide data."
            );
        }

        // Validate required fields
        if (!data.username || !data.email || !data.password) {
            throw new Error(
                "Data was invalid. Please provide valid data."
            );
        }

        // Validate email
        if (!data.email.endsWith("@gmail.com")) {
            throw new Error("Invalid Email.");
        }

        // Validate password
        if (data.password.length < 8) {
            throw new Error("Password is weak.");
        }


        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(data.password, salt)
        
        // Example database operation
        const createdUser = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
            }
        });
        const verificationToken = await tokenProvider.generate_Verification_Token(createdUser.id);
        const refreshToken = await tokenProvider.generate_Access_Token(createdUser.id);
        const apiToken = await tokenProvider.generate_Api_Token(createdUser.id)

        const user = await prisma.user.update({
            where: {
                id: createdUser.id
            },
            data: {
                verificationToken: verificationToken,
                refreshToken: refreshToken,
                apiToken: apiToken,
            },
            select: {
                id: true,
                username: true,
                email: true,
                isVerified: true,
                apiToken: true,
                updatedAt: true,
                createdAt:true
            }
        })


        await sendVerifyEmail(user.username, user.email, verificationToken);

        const userKey = `user:userId:${user.id}`
        const userEmailKey = `user:email:${user.email}`
    
        await redis.set(Userkey,JSON.stringify(user))
        await redis.set(userEmailKey,JSON.stringify(user))

        return user
    }

    async login(data){
        try { 
            const cachedUser = await redis.get(`user:email:${data.email}`)
            if (cachedUser) {
                
                let user = JSON.parse(cachedUser)

                const isVaildPassword = await bcrypt.compare(data.password, user.password)
                if (!isVaildPassword) {
                    throw new Error("Invaild Password!!!")
                }
        
                const verificationToken = await tokenProvider.generate_Verification_Token(user.id)
                const refreshToken = await tokenProvider.generate_Refresh_Token(user.id)
                const accessToken = await tokenProvider.generate_Access_Token(user.id)
        
                const loggedUser = await prisma.user.update({
                    where: {
                        email:data.email
                    },
                    data: {
                        verificationToken: verificationToken,
                        refreshToken: refreshToken
                    }
                })

                await redis.del(`user:email:${data.email}`)
                await redis.del(`user:userId:${loggedUser.id}`)

                const userKey = `user:userId:${user.id}`
                const userEmailKey = `user:email:${user.email}`
        
                await redis.set(userKey,JSON.stringify(user))
                await redis.set(userEmailKey, JSON.stringify(user))

                
                return {
                    user,
                    refreshToken,
                    accessToken
                }
            }
            
            const isVaildEmail = await prisma.user.findUnique({
                where: {
                    email:data.email
                }
            })
            
            if (!isVaildEmail) {
                throw new Error("User was not found in database!!!")
            }
            
            if (!isVaildEmail.isVerified) {
                throw new Error("Please !! Verify Your Email Addres before login.")
            }
            
            const isVaildPass = await bcrypt.compare(data.password, isVaildEmail.password)
            if (!isVaildPass) {
                throw new Error("Invaild Password!!!")
            }
            
            const verificationToken = await tokenProvider.generate_Verification_Token(isVaildEmail.id)
            const refreshToken = await tokenProvider.generate_Refresh_Token(isVaildEmail.id)
            const accessToken = await tokenProvider.generate_Access_Token(isVaildEmail.id)
            
            const user = await prisma.user.update({
                where: {
                    email:data.email
                },
                data: {
                    verificationToken: verificationToken,
                    refreshToken: refreshToken
                }
            })
            
            const userKey = `user:userId:${user.id}`
            const userEmailKey = `user:email:${user.email}`
        
            await redis.set(userKey,JSON.stringify(user))
            await redis.set(userEmailKey, JSON.stringify(user))
            
            return {
                user,
                refreshToken,
                accessToken
            }

        } catch (err) {
            throw new Error(err.message)
        }
    }

    async logout(res,accessToken, refreshToken) {
        res.clearCookie('accessToken', options)
            .clearCookie('refreshToken', options)
        return "SuccessFully Logout!!!"
    }

    async refreshAccessToken(refreshToken, id) { 
        // Pending Redis
        
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })

        if (Object.keys(user ?? 0).length == 0) {
            throw new Error(`Invaild user Id.`)
        }

        const VaildToken = user.refreshToken
        

        if (refreshToken !== VaildToken) {
            throw new Error("Invaild RefreshToken")
        }

        const accessToken = await tokenProvider.generate_Access_Token(id);

        return accessToken
    }

    async forgetPassword(oldPassword, newPassword, id) {
        try {
            const cachedUser = await redis.get(`user:userId:${id}`)
            if (cachedUser) {
            const isVaildPassword = await bcrypt.compare(oldPassword, JSON.parse(cachedUser).password)
            if (!isVaildPassword) {
                throw new Error("Invaild Password!!!")
            }
    
            const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(newPassword,salt)
    
                const updatedUser = await prisma.user.update({
                    where: {
                        id
                    },
                    data: {
                        password: hashedPassword
                    }
                })
    
                await redis.del(`user:email:${updatedUser.email}`)
                await redis.del(`user:userId:${updatedUser.id}`)
    
                const userKey = `user:userId:${updatedUser.id}`
                const userEmailKey = `user:email:${updatedUser.email}`
            
                await redis.set(userKey,JSON.stringify(updatedUser))
                await redis.set(userEmailKey, JSON.stringify(updatedUser))
    
                return "Successful Change Password"
            }

            let user = await prisma.user.findUnique({
                where: {
                    id
                }
            })

            if (!user) {
                throw Error(`User not found.`)
            }

            const isVaildPass = await bcrypt.compare(oldPassword, user.password)
            if (!isVaildPass) {
                throw new Error("Invaild Password!!!")
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(newPassword,salt)

            const updatedUser = await prisma.user.update({
                where: {
                    id
                },
                data: {
                    password: hashedPassword
                }
            })

            await redis.del(`user:email:${updatedUser.email}`)
            await redis.del(`user:userId:${updatedUser.id}`)

            const userKey = `user:userId:${updatedUser.id}`
            const userEmailKey = `user:email:${updatedUser.email}`
        
            await redis.set(userKey,JSON.stringify(updatedUser))
            await redis.set(userEmailKey, JSON.stringify(updatedUser))

            return "Successful Change Password"
        } catch(err) {
            throw new Error(err.message)
        }
    }

    async Verifier(verificationToken){
        try{
            const user = await tokenProvider.decrypt_Verification_Token(verificationToken);
            
            let updatedUser = await prisma.user.update({
                where: {
                    id:user.id
                },
                data:{
                    isVerified: true,
                    verificationToken: ''
                },
                select:select
            })

            return `💥 <<< Successfully verified !! 💥 >>>`
        }catch(err){
            throw new Error(err.message)
        }
    }
}

export default new AuthService()