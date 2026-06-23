import { prisma } from "../configs/prisma.config.js";
import bcrypt from "bcrypt";
import tokenProvider from "../providers/token/token.provider.js";
import { googleLLM } from "../providers/llm/google/google.llm.js";
import userService from "./user.service.js";


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

            return api
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async getApi(apiName) {
        try {
            const api = await prisma.api.findUnique({
                where: {
                    name:apiName
                }
            })

            return api
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async getALLAPI(ownerid) {
        try {
            const api = await prisma.api.findMany({
                where: {
                    ownerId:ownerid
                }
            })

            return api
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async LLM(id,provider,model,query) {
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
            
            const apiKey = await tokenProvider.api_provider_Token(id, newProvider);
            
                
            if (!apiKey) { 
                throw new Error(`<<< Error Occured in while decrypt ApiKey. >>>`)
            }

            const ai = await googleLLM(apiKey, model, query)
            
            if (!ai) {
                throw new Error(`<<< Sorry ? Error Occured in ai Model Please check your Api Key. >>> `)
            }
            return ai
        } catch (err) {
            throw new Error(`<<< Error occured in LLM: ${err.message} >>>`)
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

            if (Object.keys(updatedApi ?? 0).length == 0) {
                throw new Error("Invaild Api Id.")
            }

            return updatedApi

            
        } catch (err) {
            throw new Error(err.message)
        }
    }
}

export default new API_SERVICE()