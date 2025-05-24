import { NextResponse } from "next/server"
import { generateProjectFeatures } from "@/lib/ai-utils"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { projectName, projectDescription } = await req.json()

    if (!projectDescription) {
      return NextResponse.json({ error: "Project description is required" }, { status: 400 })
    }

    const features = await generateProjectFeatures(projectDescription, projectName || "Unnamed Project")

    return NextResponse.json({ features })
  } catch (error) {
    console.error("Error generating features:", error)
    return NextResponse.json({ error: "There was an error generating features" }, { status: 500 })
  }
}
