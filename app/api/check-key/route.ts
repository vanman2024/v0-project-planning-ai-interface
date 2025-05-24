export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    // Check if the API key exists
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          status: "missing",
          message: "OpenAI API key is not set",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      )
    }

    // Check if the API key is valid by making a simple API call
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return new Response(
        JSON.stringify({
          status: "invalid",
          message: "OpenAI API key is invalid or has issues",
          details: error,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      )
    }

    // API key is valid
    return new Response(
      JSON.stringify({
        status: "valid",
        message: "OpenAI API key is valid",
        keyPrefix: apiKey.substring(0, 3) + "..." + apiKey.substring(apiKey.length - 4),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Error checking API key",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
