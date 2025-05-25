import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"

export type ProjectFeature = {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
}

export type ProjectRoadmap = {
  id: string
  title: string
  phases: {
    id: string
    title: string
    description: string
    duration: string
    features: string[] // Feature IDs
  }[]
}

/**
 * Infer project features from a conversation
 */
export async function inferProjectFeatures(
  projectDescription: string,
  conversation: { role: string; content: string }[],
): Promise<ProjectFeature[]> {
  try {
    const features = await generateObject({
      model: openai("gpt-4o"),
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            priority: { type: "string", enum: ["low", "medium", "high"] },
          },
          required: ["id", "title", "description", "priority"],
        },
        minItems: 3,
        maxItems: 10,
      },
      prompt: `Based on the following project description and conversation, infer the key features that should be included in this project:
      
      Project Description: ${projectDescription}
      
      Conversation:
      ${conversation.map((msg) => `${msg.role}: ${msg.content}`).join("\n\n")}
      
      Extract and list the main features that should be included in this project. For each feature:
      1. Provide a concise title
      2. Write a brief description explaining the feature
      3. Assign a priority level (low, medium, high)
      
      Focus on core features that would be essential for an MVP (Minimum Viable Product).
      Each feature should be distinct and provide clear value to users.`,
    })

    return features
  } catch (error) {
    console.error("Error inferring project features:", error)
    return []
  }
}

/**
 * Generate a project roadmap based on features
 */
export async function generateProjectRoadmap(
  projectName: string,
  projectDescription: string,
  features: ProjectFeature[],
): Promise<ProjectRoadmap> {
  try {
    const roadmap = await generateObject({
      model: openai("gpt-4o"),
      schema: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          phases: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                title: { type: "string" },
                description: { type: "string" },
                duration: { type: "string" },
                features: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["id", "title", "description", "duration", "features"],
            },
          },
        },
        required: ["id", "title", "phases"],
      },
      prompt: `Create a realistic project roadmap for the following project:
      
      Project Name: ${projectName}
      Project Description: ${projectDescription}
      
      Features to implement:
      ${features.map((f) => `- ${f.title} (Priority: ${f.priority}): ${f.description}`).join("\n")}
      
      The roadmap should:
      1. Have logical phases (e.g., Planning, MVP Development, Testing, etc.)
      2. Include estimated duration for each phase
      3. Assign features to appropriate phases based on their priorities
      4. Be realistic and achievable
      
      Provide a comprehensive roadmap that could be used for project planning.`,
    })

    return roadmap
  } catch (error) {
    console.error("Error generating project roadmap:", error)
    return {
      id: "default",
      title: "Project Roadmap",
      phases: [],
    }
  }
}
