import { prisma } from "../configs/prisma.config.js";
import bcrypt from "bcrypt";
import tokenProvider from "../providers/token/token.provider.js";
import { GoogleLLM } from "../providers/llm/google/google.llm.js";
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

// async function getResponse(id, provider, mode, query) {
//     try {
//         const apiService = new API_SERVICE()
//         const response = await apiService.ChatWithStream("cmqmiq0ll0002jgtwzhwgpnb8","Google","","Hello,Who are you??")
//     } catch (err) { 
//         console.error(err.message)
//     }
// }

export default new API_SERVICE()