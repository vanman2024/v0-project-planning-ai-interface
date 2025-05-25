"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Send, Sparkles, Bot, User, FileText, Info, Calendar, CheckCircle, CheckSquare } from "lucide-react"
import { MessageContent, type SuggestionOption, type FeatureGroup } from "./message-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { parseMarkdown } from "@/lib/utils"

// Define message types
type MessageType = "text" | "suggestion" | "feature-selection" | "clarifying-question"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  type: MessageType
  timestamp: Date
  suggestions?: SuggestionOption[]
  featureGroups?: FeatureGroup[]
  clarifyingQuestions?: string[]
  agentType?: AgentType
}

type AgentType = "main" | "task" | "feature" | "documentation" | "detail" | "planner"

interface ProjectAssistantProps {
  projectId: string
  projectName: string
  projectDescription?: string
  onUpdateProject?: (updates: any) => void
}

export function ProjectAssistant({
  projectId,
  projectName,
  projectDescription,
  onUpdateProject,
}: ProjectAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi there! I'm your Project Assistant for **${projectName}**. I can help you plan and organize your project. What would you like to focus on today?`,
      type: "text",
      timestamp: new Date(),
      suggestions: [
        {
          id: "define-features",
          title: "Define project features",
          description: "Identify and plan the key features for your project",
        },
        {
          id: "create-tasks",
          title: "Create project tasks",
          description: "Break down your project into manageable tasks",
        },
        {
          id: "plan-timeline",
          title: "Plan project timeline",
          description: "Create a timeline with milestones for your project",
        },
        {
          id: "tech-stack",
          title: "Choose technology stack",
          description: "Select the technologies for your project",
        },
      ],
      agentType: "main",
    },
  ])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeAgent, setActiveAgent] = useState<AgentType>("main")
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      type: "text",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage = generateResponse(input, activeAgent)
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestionSelect = (suggestion: SuggestionOption) => {
    // Add user message indicating selection
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: `I want to ${suggestion.title.toLowerCase()}`,
      type: "text",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Determine which agent to use based on suggestion
    let newAgent: AgentType = "main"
    if (suggestion.id.includes("feature")) {
      newAgent = "feature"
    } else if (suggestion.id.includes("task")) {
      newAgent = "task"
    } else if (suggestion.id.includes("timeline")) {
      newAgent = "planner"
    } else if (suggestion.id.includes("tech")) {
      newAgent = "detail"
    }

    // Switch agent if needed
    if (newAgent !== activeAgent) {
      setActiveAgent(newAgent)

      // Add system message about agent switch
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        role: "system",
        content: `Switching to ${getAgentName(newAgent)} to help with this request.`,
        type: "text",
        timestamp: new Date(),
        agentType: newAgent,
      }

      setMessages((prev) => [...prev, systemMessage])
    }

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage = generateResponseForSuggestion(suggestion, newAgent)
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleFeatureSelect = (featureId: string, selected: boolean) => {
    if (selected) {
      setSelectedFeatures((prev) => [...prev, featureId])
    } else {
      setSelectedFeatures((prev) => prev.filter((id) => id !== featureId))
    }
  }

  const handleAnswerQuestion = (question: string, answer: string) => {
    // Add user message with the answer
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: answer,
      type: "text",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI response to the answer
    setTimeout(() => {
      const assistantMessage = generateResponseToAnswer(question, answer, activeAgent)
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleConfirmFeatures = () => {
    if (selectedFeatures.length === 0) return

    // Add user message confirming features
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: `I'd like to confirm these ${selectedFeatures.length} features for the project.`,
      type: "text",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `Great! I've confirmed the ${selectedFeatures.length} features you selected for ${projectName}. Would you like me to help you break these down into tasks or would you prefer to focus on something else now?`,
        type: "text",
        timestamp: new Date(),
        suggestions: [
          {
            id: "create-tasks-from-features",
            title: "Break features into tasks",
            description: "Create tasks based on the selected features",
          },
          {
            id: "estimate-timeline",
            title: "Estimate timeline",
            description: "Create a timeline based on the selected features",
          },
          {
            id: "tech-requirements",
            title: "Define technical requirements",
            description: "Specify technical requirements for implementation",
          },
        ],
        agentType: "main",
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)

      // Reset selected features after confirmation
      setSelectedFeatures([])

      // Notify parent component about the update
      if (onUpdateProject) {
        onUpdateProject({
          features: selectedFeatures,
        })
      }
    }, 1500)
  }

  const switchAgent = (agentType: AgentType) => {
    if (agentType === activeAgent) return

    setActiveAgent(agentType)

    // Add system message about agent switch
    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      role: "system",
      content: `Switching to ${getAgentName(agentType)} to help with your project.`,
      type: "text",
      timestamp: new Date(),
      agentType,
    }

    // Add assistant message from the new agent
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: getAgentWelcomeMessage(agentType, projectName),
      type: "text",
      timestamp: new Date(Date.now() + 100),
      suggestions: getAgentSuggestions(agentType),
      agentType,
    }

    setMessages((prev) => [...prev, systemMessage, assistantMessage])
  }

  // Helper function to generate responses based on user input
  const generateResponse = (userInput: string, agentType: AgentType): Message => {
    const lowerInput = userInput.toLowerCase()

    // Check for feature-related queries
    if (
      lowerInput.includes("feature") ||
      lowerInput.includes("functionality") ||
      lowerInput.includes("capability") ||
      lowerInput.includes("what can it do")
    ) {
      return {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "Based on your project description, here are some suggested features you might want to include:",
        type: "feature-selection",
        timestamp: new Date(),
        featureGroups: [
          {
            id: "core-features",
            title: "Core Features",
            options: [
              {
                id: "user-auth",
                title: "User Authentication",
                description: "Allow users to sign up, log in, and manage their accounts",
              },
              {
                id: "project-management",
                title: "Project Management",
                description: "Create, edit, and organize projects with metadata",
              },
              {
                id: "file-upload",
                title: "File Upload & Management",
                description: "Upload, store, and organize project-related files",
              },
              {
                id: "search",
                title: "Search Functionality",
                description: "Search across projects, files, and conversations",
              },
            ],
          },
          {
            id: "ai-features",
            title: "AI Features",
            options: [
              {
                id: "ai-suggestions",
                title: "AI-Powered Suggestions",
                description: "Get intelligent suggestions for project planning",
              },
              {
                id: "auto-categorization",
                title: "Automatic Categorization",
                description: "AI categorizes and organizes project elements",
              },
              {
                id: "content-generation",
                title: "Content Generation",
                description: "AI generates project descriptions and documentation",
              },
              {
                id: "requirement-analysis",
                title: "Requirement Analysis",
                description: "AI analyzes and refines project requirements",
              },
            ],
          },
        ],
        agentType: "feature",
      }
    }

    // Check for task-related queries
    if (
      lowerInput.includes("task") ||
      lowerInput.includes("todo") ||
      lowerInput.includes("work item") ||
      lowerInput.includes("milestone")
    ) {
      return {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          "I can help you break down your project into tasks. Let me ask a few questions to better understand what you need:",
        type: "clarifying-question",
        timestamp: new Date(),
        clarifyingQuestions: [
          "What's the main goal you want to achieve with these tasks?",
          "Do you have a specific timeline or deadline in mind?",
          "Are there any dependencies or prerequisites I should be aware of?",
        ],
        agentType: "task",
      }
    }

    // Check for timeline-related queries
    if (
      lowerInput.includes("timeline") ||
      lowerInput.includes("schedule") ||
      lowerInput.includes("deadline") ||
      lowerInput.includes("when")
    ) {
      return {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          "I can help you plan a timeline for your project. To create an effective schedule, I need to understand a few things:",
        type: "clarifying-question",
        timestamp: new Date(),
        clarifyingQuestions: [
          "What's the overall deadline for your project?",
          "How many team members will be working on this project?",
          "Are there any fixed dates or milestones that can't be moved?",
        ],
        agentType: "planner",
      }
    }

    // Default response with suggestions
    return {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: `I understand you're interested in "${userInput.substring(0, 40)}${userInput.length > 40 ? "..." : ""}". How would you like to proceed with your project?`,
      type: "text",
      timestamp: new Date(),
      suggestions: [
        {
          id: "define-features",
          title: "Define project features",
          description: "Identify and plan the key features for your project",
        },
        {
          id: "create-tasks",
          title: "Create project tasks",
          description: "Break down your project into manageable tasks",
        },
        {
          id: "plan-timeline",
          title: "Plan project timeline",
          description: "Create a timeline with milestones for your project",
        },
      ],
      agentType,
    }
  }

  // Helper function to generate responses for suggestions
  const generateResponseForSuggestion = (suggestion: SuggestionOption, agentType: AgentType): Message => {
    switch (suggestion.id) {
      case "define-features":
        return {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            "Let's define the key features for your project. Based on your project description, here are some suggested features you might want to include:",
          type: "feature-selection",
          timestamp: new Date(),
          featureGroups: [
            {
              id: "core-features",
              title: "Core Features",
              options: [
                {
                  id: "user-auth",
                  title: "User Authentication",
                  description: "Allow users to sign up, log in, and manage their accounts",
                },
                {
                  id: "project-management",
                  title: "Project Management",
                  description: "Create, edit, and organize projects with metadata",
                },
                {
                  id: "file-upload",
                  title: "File Upload & Management",
                  description: "Upload, store, and organize project-related files",
                },
                {
                  id: "search",
                  title: "Search Functionality",
                  description: "Search across projects, files, and conversations",
                },
              ],
            },
            {
              id: "ai-features",
              title: "AI Features",
              options: [
                {
                  id: "ai-suggestions",
                  title: "AI-Powered Suggestions",
                  description: "Get intelligent suggestions for project planning",
                },
                {
                  id: "auto-categorization",
                  title: "Automatic Categorization",
                  description: "AI categorizes and organizes project elements",
                },
                {
                  id: "content-generation",
                  title: "Content Generation",
                  description: "AI generates project descriptions and documentation",
                },
                {
                  id: "requirement-analysis",
                  title: "Requirement Analysis",
                  description: "AI analyzes and refines project requirements",
                },
              ],
            },
          ],
          agentType: "feature",
        }

      case "create-tasks":
        return {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            "I can help you break down your project into tasks. Let me ask a few questions to better understand what you need:",
          type: "clarifying-question",
          timestamp: new Date(),
          clarifyingQuestions: [
            "What's the main goal you want to achieve with these tasks?",
            "Do you have a specific timeline or deadline in mind?",
            "Are there any dependencies or prerequisites I should be aware of?",
          ],
          agentType: "task",
        }

      case "plan-timeline":
        return {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            "I can help you plan a timeline for your project. To create an effective schedule, I need to understand a few things:",
          type: "clarifying-question",
          timestamp: new Date(),
          clarifyingQuestions: [
            "What's the overall deadline for your project?",
            "How many team members will be working on this project?",
            "Are there any fixed dates or milestones that can't be moved?",
          ],
          agentType: "planner",
        }

      case "tech-stack":
        return {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            "Let's choose the right technology stack for your project. I'll need to understand your requirements better:",
          type: "clarifying-question",
          timestamp: new Date(),
          clarifyingQuestions: [
            "What type of application are you building? (web, mobile, desktop, etc.)",
            "Do you have any specific performance requirements?",
            "Are there any technologies your team is already familiar with?",
            "Do you have any specific integration requirements?",
          ],
          agentType: "detail",
        }

      default:
        return {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: `I'll help you with "${suggestion.title}". What specific aspects would you like to focus on?`,
          type: "text",
          timestamp: new Date(),
          agentType,
        }
    }
  }

  // Helper function to generate responses to answers
  const generateResponseToAnswer = (question: string, answer: string, agentType: AgentType): Message => {
    // Task agent responses
    if (agentType === "task") {
      if (question.includes("main goal")) {
        return {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: `Thanks for sharing your goal: "${answer}". Based on this, I recommend breaking down your project into these key task categories:`,
          type: "text",
          timestamp: new Date(),
          suggestions: [
            {
              id: "research-tasks",
              title: "Research & Planning Tasks",
              description: "Initial research and planning activities",
            },
            {
              id: "development-tasks",
              title: "Development Tasks",
              description: "Core implementation work",
            },
            {
              id: "testing-tasks",
              title: "Testing & QA Tasks",
              description: "Quality assurance and testing activities",
            },
            {
              id: "deployment-tasks",
              title: "Deployment Tasks",
              description: "Activities related to launching the project",
            },
          ],
          agentType: "task",
        }
      }
    }

    // Planner agent responses
    if (agentType === "planner") {
      if (question.includes("overall deadline")) {
        return {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: `I see your deadline is "${answer}". Let me suggest a high-level timeline working backwards from this date:`,
          type: "text",
          timestamp: new Date(),
          suggestions: [
            {
              id: "detailed-timeline",
              title: "Create detailed timeline",
              description: "Break down the project into weekly milestones",
            },
            {
              id: "critical-path",
              title: "Identify critical path",
              description: "Determine the most important sequence of tasks",
            },
            {
              id: "resource-allocation",
              title: "Plan resource allocation",
              description: "Assign resources to different project phases",
            },
          ],
          agentType: "planner",
        }
      }
    }

    // Detail agent responses
    if (agentType === "detail") {
      if (question.includes("type of application")) {
        return {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: `For a ${answer} application, here are some technology stack recommendations:`,
          type: "text",
          timestamp: new Date(),
          suggestions: [
            {
              id: "frontend-tech",
              title: "Frontend technologies",
              description: "Choose frontend frameworks and libraries",
            },
            {
              id: "backend-tech",
              title: "Backend technologies",
              description: "Select backend frameworks and services",
            },
            {
              id: "database-tech",
              title: "Database solutions",
              description: "Pick the right database for your needs",
            },
            {
              id: "devops-tech",
              title: "DevOps & infrastructure",
              description: "Plan your deployment infrastructure",
            },
          ],
          agentType: "detail",
        }
      }
    }

    // Default response
    return {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: `Thank you for your answer: "${answer}". This helps me understand your needs better. What else would you like to know about your project?`,
      type: "text",
      timestamp: new Date(),
      suggestions: [
        {
          id: "more-details",
          title: "Provide more details",
          description: "Share additional information about your project",
        },
        {
          id: "next-steps",
          title: "Discuss next steps",
          description: "Plan what to do next in your project",
        },
        {
          id: "switch-topic",
          title: "Switch to another topic",
          description: "Discuss a different aspect of your project",
        },
      ],
      agentType,
    }
  }

  // Helper functions for agent information
  const getAgentName = (agentType: AgentType): string => {
    switch (agentType) {
      case "task":
        return "Task Agent"
      case "feature":
        return "Feature Agent"
      case "documentation":
        return "Documentation Agent"
      case "detail":
        return "Detail Agent"
      case "planner":
        return "Planning Agent"
      default:
        return "Project Assistant"
    }
  }

  const getAgentWelcomeMessage = (agentType: AgentType, projectName: string): string => {
    switch (agentType) {
      case "task":
        return `I'm the Task Agent for ${projectName}. I can help you break down your project into manageable tasks, set priorities, and track progress. What would you like to focus on?`
      case "feature":
        return `I'm the Feature Agent for ${projectName}. I can help you define, prioritize, and plan the features for your project. What kind of features are you considering?`
      case "documentation":
        return `I'm the Documentation Agent for ${projectName}. I can help you create and organize documentation for your project. What type of documentation do you need?`
      case "detail":
        return `I'm the Detail Agent for ${projectName}. I can help you gather and organize detailed requirements and specifications. What details would you like to define?`
      case "planner":
        return `I'm the Planning Agent for ${projectName}. I can help you create timelines, set milestones, and plan your project schedule. When would you like your project to be completed?`
      default:
        return `I'm your Project Assistant for ${projectName}. I can help you plan and organize your project. What would you like to focus on today?`
    }
  }

  const getAgentSuggestions = (agentType: AgentType): SuggestionOption[] => {
    switch (agentType) {
      case "task":
        return [
          {
            id: "create-task-list",
            title: "Create task list",
            description: "Create a list of tasks for your project",
          },
          {
            id: "prioritize-tasks",
            title: "Prioritize tasks",
            description: "Determine which tasks are most important",
          },
          {
            id: "estimate-effort",
            title: "Estimate effort",
            description: "Estimate the effort required for each task",
          },
        ]
      case "feature":
        return [
          {
            id: "brainstorm-features",
            title: "Brainstorm features",
            description: "Generate ideas for potential features",
          },
          {
            id: "define-mvp",
            title: "Define MVP features",
            description: "Identify the minimum viable product features",
          },
          {
            id: "feature-dependencies",
            title: "Map feature dependencies",
            description: "Understand how features depend on each other",
          },
        ]
      case "documentation":
        return [
          {
            id: "create-readme",
            title: "Create README",
            description: "Draft a README file for your project",
          },
          {
            id: "api-docs",
            title: "API documentation",
            description: "Document your project's APIs",
          },
          {
            id: "user-guide",
            title: "User guide",
            description: "Create a guide for end users",
          },
        ]
      case "detail":
        return [
          {
            id: "technical-requirements",
            title: "Technical requirements",
            description: "Define technical requirements",
          },
          {
            id: "user-stories",
            title: "User stories",
            description: "Create detailed user stories",
          },
          {
            id: "acceptance-criteria",
            title: "Acceptance criteria",
            description: "Define acceptance criteria for features",
          },
        ]
      case "planner":
        return [
          {
            id: "create-timeline",
            title: "Create timeline",
            description: "Create a project timeline",
          },
          {
            id: "set-milestones",
            title: "Set milestones",
            description: "Define key project milestones",
          },
          {
            id: "resource-planning",
            title: "Resource planning",
            description: "Plan resource allocation",
          },
        ]
      default:
        return [
          {
            id: "define-features",
            title: "Define project features",
            description: "Identify and plan the key features for your project",
          },
          {
            id: "create-tasks",
            title: "Create project tasks",
            description: "Break down your project into manageable tasks",
          },
          {
            id: "plan-timeline",
            title: "Plan project timeline",
            description: "Create a timeline with milestones for your project",
          },
        ]
    }
  }

  const getAgentIcon = (agentType: AgentType) => {
    switch (agentType) {
      case "task":
        return <CheckSquare className="h-4 w-4" />
      case "feature":
        return <Sparkles className="h-4 w-4" />
      case "documentation":
        return <FileText className="h-4 w-4" />
      case "detail":
        return <Info className="h-4 w-4" />
      case "planner":
        return <Calendar className="h-4 w-4" />
      default:
        return <Bot className="h-4 w-4" />
    }
  }

  // Format date for messages
  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      })
    }
  }

  // Format time for messages
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {}
  messages.forEach((message) => {
    const dateKey = formatDate(message.timestamp)
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = []
    }
    groupedMessages[dateKey].push(message)
  })

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Project Assistant</CardTitle>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Bot className="h-3 w-3" />
                  <span>{getAgentName(activeAgent)}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Currently speaking with {getAgentName(activeAgent)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[600px]">
          {/* Agent selector */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b">
            <p className="text-sm text-muted-foreground mr-2">Switch agent:</p>
            <TooltipProvider>
              <div className="flex flex-wrap gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeAgent === "main" ? "default" : "outline"}
                      size="sm"
                      className="h-8"
                      onClick={() => switchAgent("main")}
                    >
                      <Bot className="h-3.5 w-3.5 mr-1" />
                      <span>Main</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>General project assistant</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeAgent === "feature" ? "default" : "outline"}
                      size="sm"
                      className="h-8"
                      onClick={() => switchAgent("feature")}
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1" />
                      <span>Features</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Define project features</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeAgent === "task" ? "default" : "outline"}
                      size="sm"
                      className="h-8"
                      onClick={() => switchAgent("task")}
                    >
                      <CheckSquare className="h-3.5 w-3.5 mr-1" />
                      <span>Tasks</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Manage project tasks</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeAgent === "planner" ? "default" : "outline"}
                      size="sm"
                      className="h-8"
                      onClick={() => switchAgent("planner")}
                    >
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>Planning</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Plan project timeline</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeAgent === "detail" ? "default" : "outline"}
                      size="sm"
                      className="h-8"
                      onClick={() => switchAgent("detail")}
                    >
                      <Info className="h-3.5 w-3.5 mr-1" />
                      <span>Details</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Define project details</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>

          {/* Messages area */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-px flex-1 bg-border"></div>
                    <span className="font-medium text-muted-foreground text-xs">{date}</span>
                    <div className="h-px flex-1 bg-border"></div>
                  </div>

                  <div className="space-y-4">
                    {dateMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "system" ? "justify-center" : "items-start gap-3"}`}
                      >
                        {message.role === "system" ? (
                          <div className="bg-muted/50 text-muted-foreground text-xs py-1 px-3 rounded-full">
                            {message.content}
                          </div>
                        ) : (
                          <>
                            <Avatar className="h-8 w-8 mt-0.5">
                              {message.role === "assistant" ? (
                                <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                  {message.agentType ? getAgentIcon(message.agentType) : <Bot className="h-4 w-4" />}
                                </div>
                              ) : (
                                <div className="h-full w-full rounded-full bg-muted flex items-center justify-center">
                                  <User className="h-4 w-4" />
                                </div>
                              )}
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">
                                  {message.role === "assistant"
                                    ? message.agentType
                                      ? getAgentName(message.agentType)
                                      : "Project Assistant"
                                    : "You"}
                                </span>
                                <span className="text-muted-foreground text-xs">{formatTime(message.timestamp)}</span>
                              </div>

                              {message.role === "assistant" ? (
                                <MessageContent
                                  content={message.content}
                                  suggestions={message.suggestions}
                                  featureGroups={message.featureGroups}
                                  onSuggestionSelect={handleSuggestionSelect}
                                  onFeatureSelect={handleFeatureSelect}
                                  selectedFeatures={selectedFeatures}
                                  clarifyingQuestions={message.clarifyingQuestions}
                                  onAnswerQuestion={handleAnswerQuestion}
                                />
                              ) : (
                                <div
                                  className="prose prose-sm max-w-none dark:prose-invert"
                                  dangerouslySetInnerHTML={{
                                    __html: parseMarkdown(message.content),
                                  }}
                                />
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Show loading indicator */}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 mt-0.5">
                    <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {getAgentIcon(activeAgent)}
                    </div>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{getAgentName(activeAgent)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse"></div>
                      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-150"></div>
                      <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-300"></div>
                      <span className="text-sm text-muted-foreground ml-1">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Feature confirmation button */}
          {selectedFeatures.length > 0 && (
            <div className="py-2 border-t border-b my-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  <Badge variant="outline" className="mr-2">
                    {selectedFeatures.length}
                  </Badge>
                  features selected
                </span>
                <Button size="sm" onClick={handleConfirmFeatures}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Features
                </Button>
              </div>
            </div>
          )}

          {/* Message input */}
          <div className="pt-3">
            <div className="flex gap-2">
              <Textarea
                placeholder="Type a message..."
                className="min-h-[60px] flex-1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <Button
                className="h-[60px] w-[60px]"
                size="icon"
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
