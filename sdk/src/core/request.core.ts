export async function request(baseUrl: string, token: string,body:unknown) {
    try {
        const header = {
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Cookie": `ApiToken=${token}`
        }

        const response = await fetch(`${baseUrl}/chat`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers:header
        })

        return response
    } catch (err: any) {
        return err.message
    }
}

