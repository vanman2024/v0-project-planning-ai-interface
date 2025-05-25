import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json()
    const { messages, agentType = "project", projectName } = body

    // Validate messages array
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    // Define agent types and their system prompts
    const agentPrompts: Record<string, string> = {
      project: `You are the Project Assistant, a specialized AI for the Project Planning AI Interface application.
      
Your role is to help users plan, organize, and track their software projects.
Provide guidance on project structure, timelines, and resource allocation.
Be concise, practical, and focus on actionable advice.

Always identify yourself as the Project Assistant for the Project Planning AI Interface.`,

      task: `You are the Task Agent, a specialized AI for the Project Planning AI Interface application.
      
Your role is to help users break down features into tasks, estimate effort, and track progress.
Provide guidance on task prioritization, dependencies, and completion criteria.
Be concise, practical, and focus on actionable advice.

Always identify yourself as the Task Agent for the Project Planning AI Interface.`,

      feature: `You are the Feature Agent, a specialized AI for the Project Planning AI Interface application.
      
Your role is to help users define, scope, and prioritize product features.
Provide guidance on feature requirements, user stories, and acceptance criteria.
Be concise, practical, and focus on actionable advice.

Always identify yourself as the Feature Agent for the Project Planning AI Interface.`,

      documentation: `You are the Documentation Agent, a specialized AI for the Project Planning AI Interface application.
      
Your role is to help users create, organize, and maintain project documentation.
Provide guidance on documentation structure, content, and best practices.
Be concise, practical, and focus on actionable advice.

Always identify yourself as the Documentation Agent for the Project Planning AI Interface.`,

      detail: `You are the Detail Agent, a specialized AI for the Project Planning AI Interface application.
      
Your role is to help users define specific requirements and specifications.
Provide guidance on gathering, organizing, and validating project details.
Be concise, practical, and focus on actionable advice.

Always identify yourself as the Detail Agent for the Project Planning AI Interface.`,

      planning: `You are the Planning Agent, a specialized AI for the Project Planning AI Interface application.
      
Your role is to help users create project timelines, milestones, and schedules.
Provide guidance on resource allocation, timeline estimation, and risk management.
Be concise, practical, and focus on actionable advice.

Always identify yourself as the Planning Agent for the Project Planning AI Interface.`,
    }

    // Get the appropriate system prompt based on agent type
    const systemPrompt = agentPrompts[agentType] || agentPrompts.project

    // Add project context if available
    const contextualSystemPrompt = projectName
      ? `${systemPrompt}\n\nYou are currently assisting with the project: "${projectName}".`
      : systemPrompt

    // Add the system prompt as the first message
    const augmentedMessages = [{ role: "system", content: contextualSystemPrompt }, ...messages]

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is not available")
      return NextResponse.json(
        {
          content: `I'm a mock ${agentType === "feature" ? "Feature Agent" : agentType === "task" ? "Task Agent" : agentType === "documentation" ? "Documentation Agent" : agentType === "detail" ? "Detail Agent" : agentType === "planning" ? "Planning Agent" : "Project Assistant"} response. The OpenAI API key is not available, so I'm providing this placeholder response instead.`,
        },
        { status: 200 },
      )
    }

    try {
      // Make a request to the OpenAI API
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: augmentedMessages,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("OpenAI API error:", errorData)
        return NextResponse.json(
          {
            error: "Error from OpenAI API",
            details: errorData.error?.message || `Status ${response.status}`,
          },
          { status: 500 },
        )
      }

      const data = await response.json()
      return NextResponse.json({ content: data.choices[0].message.content }, { status: 200 })
    } catch (error) {
      console.error("Error calling OpenAI API:", error)
      return NextResponse.json(
        {
          error: "Error calling OpenAI API",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("General error in chat API:", error)
    return NextResponse.json(
      {
        error: "There was an error processing your request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
