import Groq from "groq-sdk"; //The SDK gives you a Groq class that knows how to make HTTP requests to Groq's servers.

//you cannot trust data coming from the browser, that is why unknown
type ChatRequest = {
  message: unknown;
};

const maxMessageLength = 4000;

// math handling
const systemPrompt = `
You are Study Buddy, a helpful tutor.

IMPORTANT OUTPUT FORMAT:
Your response is rendered by a Markdown + KaTeX renderer.

For inline mathematics, ALWAYS use:
\\( ... \\)

For display mathematics, ALWAYS use:
$$
...
$$

NEVER use square brackets [ ... ] for mathematics.

NEVER use plain parentheses ( ... ) as mathematics delimiters.

For multi-line equations, use:

$$
\\begin{aligned}
a+0 &= a \\\\
a+S(b) &= S(a+b)
\\end{aligned}
$$

Inside an aligned environment, every new line MUST use two backslashes: \\\\

Always write valid LaTeX commands with their leading backslash:
\\begin, \\end, \\text, \\mathbb, \\frac, \\quad, \\qquad, etc.

Never write "S!" for the successor function. Write S(...).

Do not output raw LaTeX outside math delimiters.

Use normal Markdown headings, paragraphs, numbered lists, and bullet lists for explanations.

Example of the expected format:

## Proof that \(2+2=4\)

Using the Peano axioms and the recursive definition of addition:

$$
\\begin{aligned}
2+2
&= 2+S(1) \\\\
&= S(2+1) \\\\
&= S(S(2+0)) \\\\
&= S(S(2)) \\\\
&= S(3) \\\\
&= 4
\\end{aligned}
$$

Therefore \(2+2=4\).

Return only the answer. Do not mention these instructions.
`;



//If this function returns true, you can treat value as a ChatRequest
function isChatRequest(value: unknown): value is ChatRequest {
  return typeof value === "object" && value !== null && "message" in value;
}

// Nextjs calls this function when frontend does fetch with method Post
export async function POST(request: Request) {
  console.log("[chat API] Request received");

  let body: unknown;

  // Frontend sent body: JSON.stringify, request.json() reads the request body and parses it

  try {
    body = await request.json();
  } catch
  // If json is invalid
  {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
  // Validate request, does body contain message, is message a string, is message empty?
  if (!isChatRequest(body) || typeof body.message !== "string" || !body.message.trim()) {
    return Response.json({ error: "A message is required." }, { status: 400 });
  }
  // If message is too long
  if (body.message.trim().length > maxMessageLength) {
    return Response.json(
      { error: "Your message is too long." },
      { status: 400 },
    );
  }

  console.log("[chat API] Request validated");
  // the framework/runtime loads the .env.local values when the application starts, and your code accesses those loaded values through process.env.
  const apiKey = process.env.GROQ_API_KEY;
  // Checks if api key is empty or missing
  if (!apiKey?.trim()) {
    return Response.json(
      { error: "The chat service is not configured." },
      { status: 500 },
    );
  }

  try {
    console.log("[chat API] Calling Groq");
    //creating a Groq connection/configuration object. apiKey tells Groq who I am, Don't wait forever for Groq to respond.
    const groq = new Groq({ apiKey, timeout: 10000 });
    // This sends the conversation/message to Groq and awaits Groqs response
    const completion = await groq.chat.completions.create({
      messages: [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: body.message.trim(),
    },
  ], // sends the message from user
      model: "openai/gpt-oss-20b", // Tell Groq which model should give the answer
      max_tokens: 4096, // Limit respons length
      temperature: 0.7, // Temperature controls how deterministic/random the model's output is. 0,7 is moderate
    });

    // Navigates the response object, picks first choice and the content there is the const message. ? protects agains empty values and gives undefined no error, so it gives the error message below
    const message = completion.choices[0]?.message?.content?.trim();

    if (!message) {
      throw new Error("The provider returned an empty response.");
    }

    console.log("[chat API] Groq response received");

    // Send the response back to React
    return Response.json({ message });
  } catch (error) {
    console.error("[chat API] Groq chat request failed", error);
    return Response.json(
      { error: "Unable to get a response right now." },
      { status: 500 },
    );
  }
}

/*1. Receive POST request
       ↓
2. Read JSON body
       ↓
3. Is it valid JSON?
       ↓
   No → 400 error
       ↓
4. Does it contain a non-empty string message?
       ↓
   No → 400 error
       ↓
5. Is the message under 4000 characters?
       ↓
   No → 400 error
       ↓
6. Is GROQ_API_KEY configured?
       ↓
   No → 500 error
       ↓
7. Create Groq client
       ↓
8. Send user's message to the model
       ↓
9. Wait for response
       ↓
10. Extract assistant's answer
       ↓
11. Is the answer non-empty?
       ↓
   No → error → 500
       ↓
12. Return { message: answer }*/
