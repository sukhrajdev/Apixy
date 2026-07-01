import { prisma } from "../configs/prisma.config.js";
import bcrypt from "bcrypt";
import tokenProvider from "../providers/token/token.provider.js";
import { GoogleLLM } from "../providers/llm/google/google.llm.js";
import userService from "./user.service.js";
import { redis } from "../configs/redis.config.js";


// API MAIN CLASS (ALL LOGIC)
class API_SERVICE{
    async createApi(ownerId,name,provider, apiKey) {
        try {
            if (typeof provider !== "string" || typeof apiKey !== "string") {
                throw new Error("<<< Invaild TYPE OF DATA >>>")
            }
            let newProvider = provider.toUpperCase()

            if (newProvider !== "GOOGLE") {
                throw new Error("<<< PROVIDER IS INVAILD >>>")
            }

            if (!apiKey) {
                throw new Error(`<<< Api Key could not generate.Sorry Sir >>>`)
            }

            if (typeof name !== "string") {
                throw new Error(`<<< Invaild Name Type >>>`)
            }

            let newName = name.toLowerCase()

            const api = await prisma.api.create({
                data: {
                    name:newName,
                    provider:newProvider,
                    apiKey,
                    ownerId
                },
            })

            const key1 = `api:name:${newName}`
            const key2 = `api:ownerId:${ownerId}`

            await redis.set(`api:${api.id}`,JSON.stringify(api))

            await redis.set(key1,api.id)
            await redis.sadd(key2,api.id)

            return api
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async getApi(apiName) {
        try {
            const apiId = await redis.get(`api:name:${apiName}`);
            const cachedApi = await redis.get(`api:${apiId}`)
            if (cachedApi) {
                return JSON.parse(cachedApi)
            } else { 
                
                console.log(apiName);
            const api = await prisma.api.findUnique({
                where: {
                    name: apiName
                }
            })

            const key1 = `api:name:${api.name}`
            const key2 = `api:ownerId:${api.ownerId}`

            await redis.set(`api:${api.id}`, JSON.stringify(api))

            await redis.set(key1, api.id)
            await redis.sadd(key2, api.id)

            

            return api
        }
        } catch (err) {
            throw new Error(err.message)
            
        }
    }

    async getALLAPI(ownerid) {
        try {
            const apiId = await redis.smembers(`api:ownerId:${ownerid}`);
            const keys = apiId.map(id => `api:${apiId}`);
            const cachedApi = await redis.mget(keys)

            if (cachedApi) {
                return JSON.parse(cachedApi)
                
            } else {
            
                const api = await prisma.api.findMany({
                    where: {
                        ownerId: ownerid
                    }
                })

                const key1 = `api:name:${api.name}`
                const key2 = `api:ownerId:${ownerId}`

                await redis.set(`api:${api.id}`, JSON.stringify(api))

                await redis.set(key1, api.id)
                await redis.sadd(key2, api.id)

                return api
            }
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async ChatWithModel(id,provider,model,query) {
        try {
            
            const user = await userService.getME(id);
            if (!user) {
                throw new Error(`<<< Id is Invaild. >>>`)
            }
            
            
            if (typeof provider !== "string") {
                throw new Error("<<< Invaild Provider type. >>>")
            }
            
            const newProvider = provider.toUpperCase()
            
            if (newProvider !== "GOOGLE") {
                throw new Error(`<<< Invaild Provider Now Only Google Provider avaliable. >>>`)
            }
            
            const Key = await tokenProvider.api_provider_Token(id, newProvider);
            
                
            if (!Key) { 
                throw new Error(`<<< Error Occured in while decrypt ApiKey. >>>`)
            }

            let googleLLM = new GoogleLLM(Key.apiKey)
            const ai = await googleLLM.chatWithModel(model,query)
            
            if (!ai) {
                throw new Error(`<<< Sorry ? Error Occured in ai Model Please check your Api Key. >>> `)
            }
            return ai
        } catch (err) {
            throw new Error(`<<< Error occured in LLM: ${err.message} >>>`)
        }
    }

    async ChatWithStream(id, provider, model, query) {
        try {
            const user = await userService.getME(id);
            if (!user) {
                throw new Error(`<<< Id is Invaild. >>>`)
            }
            
            
            if (typeof provider !== "string") {
                throw new Error("<<< Invaild Provider type. >>>")
            }
            
            const newProvider = provider.toUpperCase()
            
            if (newProvider !== "GOOGLE") {
                throw new Error(`<<< Invaild Provider Now Only Google Provider avaliable. >>>`)
            }
            
            const Key = await tokenProvider.api_provider_Token(id, newProvider);
            
                
            if (!Key) { 
                throw new Error(`<<< Error Occured in while decrypt ApiKey. >>>`)
            }

            let LLM = new GoogleLLM(Key.apiKey)
            return await LLM.chatWithStream(model,query)
        }catch(err){
            throw new Error(err.message)
        }
    }

    async deleteApi(apiId) {
        try {
            const deleteApi = await prisma.api.delete({
                where: {
                    id:apiId,
                }
            })
            if (!deleteApi) {
                throw new Error(`Sorry,we couldn't delete Api Key.`)
            }

            await redis.del(`api:${deleteApi.id}`)
            await redis.del(`api:name:${deleteApi.name}`)
            await redis.del(`api:ownerId:${deleteApi.ownerId}`)

            return deleteApi

        } catch (err) {
            throw new Error(err.message)
        }
    }
    async updateApi(apiId,data,provider) {
        try {

            const updatedData = {
                ...(data.name && {
                    name: data.name
                }), 

                ...(data.provider && {
                    provider: data.provider
                })
            }

            const updatedApi = await prisma.api.update({
                where: {
                    id:apiId
                },
                data: updatedData
            })

            if (!updatedApi || Object.keys(updatedApi).length == 0) {
                throw new Error("Invaild Api Id.")
            }

            await redis.del(`api:${updatedApi.id}`)
            await redis.del(`api:name:${updatedApi.name}`)
            await redis.del(`api:ownerId:${updatedApi.ownerId}`)

            const key1 = `api:name:${updatedApi.name}`
            const key2 = `api:ownerId:${updatedApi.ownerId}`

            await redis.set(`api:${updatedApi.id}`,JSON.stringify(updatedApi))

            await redis.set(key1,updatedApi.id)
            await redis.sadd(key2,updatedApi.id)

            return updatedApi

            
        } catch (err) {
            throw new Error(err.message)
        }
    }
}


export default new API_SERVICE()