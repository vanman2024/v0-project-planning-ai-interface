import { openai } from "@ai-sdk/openai"

export const runtime = "nodejs"

export async function POST(req: Request) {
  console.log("Chat non-streaming API called")

  try {
    // Parse the request body
    const body = await req.json()
    console.log("Request body:", JSON.stringify(body, null, 2))

    const { messages, threadId, agentType = "project", projectName } = body

    // Validate messages array
    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages format:", messages)
      return new Response(JSON.stringify({ error: "Invalid messages format. Expected an array of messages." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Simple system prompt
    const systemMessage = {
      role: "system",
      content: `You are the Project Assistant, a specialized AI for the Project Planning AI Interface application.
      
Your role is to help users plan, organize, and track their software projects.
Provide guidance on project structure, timelines, and resource allocation.
Be concise, practical, and focus on actionable advice.

Always identify yourself as the Project Assistant for the Project Planning AI Interface.`,
    }

    // Log OpenAI API key status (without revealing the key)
    console.log("OpenAI API key available:", !!process.env.OPENAI_API_KEY)
    console.log("OpenAI API key length:", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0)

    try {
      // Generate the response using the AI SDK (non-streaming)
      console.log("Calling OpenAI API with model: gpt-3.5-turbo")

      const completion = await openai("gpt-3.5-turbo").chat({
        messages: [systemMessage, ...messages],
        temperature: 0.7,
      })

      console.log("OpenAI API response received")

      // Return the response
      return new Response(JSON.stringify({ content: completion.choices[0].message.content }), {
        headers: { "Content-Type": "application/json" },
      })
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError)
      return new Response(
        JSON.stringify({
          error: "Error communicating with OpenAI API",
          details: openaiError instanceof Error ? openaiError.message : String(openaiError),
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      )
    }
  } catch (error) {
    console.error("General error in chat API:", error)
    return new Response(
      JSON.stringify({
        error: "There was an error processing your request",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
