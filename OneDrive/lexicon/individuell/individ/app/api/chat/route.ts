import Groq from "groq-sdk";

type ChatRequest = {
  message: unknown;
};

const maxMessageLength = 4000;

function isChatRequest(value: unknown): value is ChatRequest {
  return typeof value === "object" && value !== null && "message" in value;
}

export async function POST(request: Request) {
  console.log("[chat API] Request received");

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isChatRequest(body) || typeof body.message !== "string" || !body.message.trim()) {
    return Response.json({ error: "A message is required." }, { status: 400 });
  }

  if (body.message.trim().length > maxMessageLength) {
    return Response.json(
      { error: "Your message is too long." },
      { status: 400 },
    );
  }

  console.log("[chat API] Request validated");

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey?.trim()) {
    return Response.json(
      { error: "The chat service is not configured." },
      { status: 500 },
    );
  }

  try {
    console.log("[chat API] Calling Groq");
    const groq = new Groq({ apiKey, timeout: 10000 });
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: body.message.trim() }],
      model: "openai/gpt-oss-20b",
      max_tokens: 1024,
      temperature: 0.7,
    });
    const message = completion.choices[0]?.message?.content?.trim();

    if (!message) {
      throw new Error("The provider returned an empty response.");
    }

    console.log("[chat API] Groq response received");
    return Response.json({ message });
  } catch (error) {
    console.error("[chat API] Groq chat request failed", error);
    return Response.json(
      { error: "Unable to get a response right now." },
      { status: 500 },
    );
  }
}