import type { ChatOptions } from "./types/chat.type.ts";
import type { ClientConfig } from "./types/client.type.ts";
import { chatWithModel,chatWithStream } from "./core/chat.core.js";

export class Apixy {
    private token: string;
    private baseUrl: string;

    constructor(config: ClientConfig) {
        this.token = config.token;
        this.baseUrl = config.baseUrl;
    }

    async chatWithModel(data: ChatOptions) {
        try {
            const response = await chatWithModel(this.baseUrl, this.token, data);
            return response
        } catch (err: any) {
            return err.message
        }
    }

    async chatWithStream(data: ChatOptions) {
        return chatWithStream(this.baseUrl, this.token, data);

    }
}

