import { GoogleGenAI } from "@google/genai";
import { log } from "node:console";

export class GoogleLLM {
    apiKey;
    constructor(Key) {
        this.apiKey = Key;
    }

    async initialization() {
        try {
            const googleLLM = new GoogleGenAI({
                apiKey: this.apiKey,
            });

            return googleLLM;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async chatWithModel(model, contents) {
        try {
            const googleLLM = await this.initialization();

            const aiResponse = await googleLLM.models.generateContent({
                model: model,
                contents: contents,
                config: {
                    systemInstruction: "You are A Apixy Google LLM.",
                },
            });

            return aiResponse.text;
        } catch (err) {
            throw new Error(`Error occurred in googleLLM: ${err.message}`);
        }
    }
    async chatWithStream(model,query) {
        try {
            const ai = await this.initialization()
            return await ai.interactions.create({
                model: model,
                input: query,
                stream: true,
            });

  
        
        } catch (err) {
            throw new Error(err.message);
        }
    }
}


// let LLM = new GoogleLLM('hello world');

// LLM.test('jffsj','yoyoy')
