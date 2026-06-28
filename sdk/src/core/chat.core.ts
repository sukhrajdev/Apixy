import { requestToModel, requestToStream } from "./request.core.js";

export async function chatWithModel(baseUrl: string, token: string,data:any) {
    try {
        const response = await requestToModel(baseUrl, token, data)
        return response
    } catch (err: any) {
        return err.message
    }
}

export async function chatWithStream(baseUrl:string,token:string,data:any) {
    try {
        return await requestToStream(baseUrl, token, data)
    } catch (err: any) {
        return err.message
    }
}
