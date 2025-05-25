import { NextResponse } from "next/server"
import { generateProjectDocumentation } from "@/lib/ai-utils"
import type { ProjectFeature } from "@/lib/ai-utils"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { projectName, projectDescription, features } = await req.json()

    if (!projectDescription || !features) {
      return NextResponse.json({ error: "Project description and features are required" }, { status: 400 })
    }

    const documentation = await generateProjectDocumentation(
      projectName || "Unnamed Project",
      projectDescription,
      features as ProjectFeature[],
    )

    return NextResponse.json({ documentation })
  } catch (error) {
    console.error("Error generating documentation:", error)
    return NextResponse.json({ error: "There was an error generating documentation" }, { status: 500 })
  }
}
