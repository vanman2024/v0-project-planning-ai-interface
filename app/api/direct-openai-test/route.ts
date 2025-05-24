export const runtime = "nodejs"

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "OpenAI API key is missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Make a simple request to OpenAI's models endpoint to verify the key
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return new Response(
        JSON.stringify({
          error: "Failed to connect to OpenAI API",
          status: response.status,
          details: errorData,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      )
    }

    const data = await response.json()

    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully connected to OpenAI API",
        models: data.data.slice(0, 5).map((model: any) => model.id), // Just show first 5 models
      }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Error testing OpenAI connection",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
