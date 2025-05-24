import { NextResponse } from "next/server"
import { generateTasksForFeature } from "@/lib/ai-utils"
import type { ProjectFeature } from "@/lib/ai-utils"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { feature, projectContext } = await req.json()

    if (!feature) {
      return NextResponse.json({ error: "Feature is required" }, { status: 400 })
    }

    const tasks = await generateTasksForFeature(feature as ProjectFeature, projectContext || "")

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error generating tasks:", error)
    return NextResponse.json({ error: "There was an error generating tasks" }, { status: 500 })
  }
}
