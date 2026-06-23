import { request } from "./request.core.ts";

export async function getResponse(baseUrl: string, token: string,data:any) {
    try {
        const response = await request(baseUrl, token, data)
        return response
    } catch (err: any) {
        return err.message
    }
}