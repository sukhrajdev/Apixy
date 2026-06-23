import { Apixy } from "../index.ts";

const client = new Apixy({
    token: "Your Apixy account Api Key",
    baseUrl: "http://localhost:3000/api/v1/apis"
})
async function getResponse() {
    
    const response = await client.chat({
        Provider: "Google",
        model: "gemini-3.5-flash", // Change Model according to provider
        query: "Hey,Explain Who are you and Who make you." // Change Query As you want
    })
    const data = await response.text();
        
    console.log(data)
}

getResponse()