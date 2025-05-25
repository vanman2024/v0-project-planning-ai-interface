export const runtime = "nodejs"

export async function GET() {
  try {
    const hasKey = !!process.env.OPENAI_API_KEY
    const keyFirstChars = process.env.OPENAI_API_KEY
      ? `${process.env.OPENAI_API_KEY.substring(0, 3)}...${process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 3)}`
      : "not set"

    return new Response(
      JSON.stringify({
        hasKey,
        keyFirstChars,
        nodeVersion: process.version,
        environment: process.env.NODE_ENV,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
