export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json()
    const { messages } = body

    // More specific system prompt that gives the AI a clear identity
    const systemMessage = {
      role: "system",
      content: `You are the Project Planning AI Assistant, a specialized AI created for the "Project Planning AI Interface" application.

Your purpose is to help users plan and manage software development projects. You have several specialized modes:
- Project Assistant: Help with overall project management and coordination
- Task Agent: Assist with task breakdown and organization
- Feature Agent: Help define and scope product features
- Documentation Agent: Assist with creating project documentation
- Detail Agent: Help gather detailed requirements
- Planning Agent: Assist with project scheduling and timelines

Always identify yourself as the Project Planning AI Assistant. Be helpful, concise, and focused on project planning topics.

Current version: 1.0
`,
    }

    // Use a direct API call to OpenAI
    const openaiApiKey = process.env.OPENAI_API_KEY

    if (!openaiApiKey) {
      throw new Error("OpenAI API key is missing")
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...messages],
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      console.error("OpenAI API error:", errorData)
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`)
    }

    const result = await openaiResponse.json()

    // Return a simple JSON response
    return new Response(
      JSON.stringify({
        id: result.id,
        message: {
          id: Date.now().toString(),
          role: "assistant",
          content: result.choices[0].message.content,
        },
      }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    console.error("Error in chat test API:", error)
    return new Response(
      JSON.stringify({
        error: "There was an error processing your request",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
