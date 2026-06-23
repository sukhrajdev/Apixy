import { GoogleGenAI } from "@google/genai";

export async function googleLLM(skKey, model, contents) {
    try {
        const googleLLM = new GoogleGenAI({
            apiKey: skKey.apiKey,
        });

        const aiResponse = await googleLLM.models.generateContent({
            model: model,
            contents: contents,
            config: {
                systemInstruction: "You are A Apixy Google LLM."
            }
        });

        return aiResponse.text;
    } catch (err) {
        throw new Error(
            `Error occurred in googleLLM: ${err.message}`
        );
    }
}