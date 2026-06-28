export async function requestToModel(
  baseUrl: string,
  token: string,
  body: unknown,
) {
  try {
    const header = {
      "Content-Type": "application/json",
      Accept: "*/*",
      Cookie: `ApiToken=${token}`,
    };

    const response = await fetch(`${baseUrl}/chat`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: header,
    });


    return response;
  } catch (err: any) {
    return err.message;
  }
}

export async function* requestToStream(
  baseUrl: string,
  token: string,
  body: unknown,
) {
  try {
    const header = {
      "Content-Type": "application/json",
      Accept: "*/*",
      Cookie: `ApiToken=${token}`,
    };

    const response = await fetch(`${baseUrl}/chat/stream`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: header,
    });
      
      if (!response.ok) {
        throw new Error(await response.text());
    }

    if (!response.body) {
        throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
            if (!event.startsWith("data:")) continue;

            const json = event.slice(5).trim();

            yield JSON.parse(json);
        }
    }
  } catch (err: any) {
    return err.message;
  }
}
