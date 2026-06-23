import type { ChatOptions } from "./types/chat.type.ts";
import type { ClientConfig } from "./types/client.type.ts";
import { getResponse } from "./core/chat.core.ts";

export class Apixy {
    private token: string;
    private baseUrl: string;

    constructor(config: ClientConfig) {
        this.token = config.token;
        this.baseUrl = config.baseUrl;
    }

    async chat(data: ChatOptions) {
        try {
            const response = getResponse(this.baseUrl, this.token, data);
            return response
        } catch (err: any) {
            return err.message
        }
    }
}

