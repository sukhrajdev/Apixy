import { log } from "node:console";
import { Apixy } from "../index.js";

const client = new Apixy({
    token: "Your Apixy Token",
    baseUrl: "http://localhost:3000/api/v1/apis"
})
async function getResponse() {
    try {
        
        const stream = await client.chatWithStream({
            Provider: "Google",
            model: "gemini-3.5-flash",
            query: "Hey, Explain who are you."
        });

        
        

        for await (const event of stream) {
            process.stdout.write(event.text);
        }
    } catch (err:any) {
        console.log(err.message);
        
    }
}

getResponse()