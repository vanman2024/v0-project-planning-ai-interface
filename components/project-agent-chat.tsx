"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Send } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ProjectAgentChatProps {
  projectContext: {
    name: string
    description: string
    techStack: string[]
    files: any[]
    repositories: any[]
    links: any[]
  }
  compact?: boolean
}

// First, add the parseMarkdown function
const parseMarkdown = (text: string): string => {
  if (!text) return ""

  // Process bold text
  let processed = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

  // Process italic text
  processed = processed.replace(/\*(.*?)\*/g, "<em>$1</em>")

  // Process inline code
  processed = processed.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')

  // Process numbered lists (preserve the numbers)
  processed = processed.replace(
    /^\s*(\d+)\.\s+(.*?)$/gm,
    '<div class="list-item"><span class="list-number">$1.</span> $2</div>',
  )

  // Process bullet points
  processed = processed.replace(/^\s*-\s+(.*?)$/gm, '<div class="list-item">• $1</div>')

  // Add some basic styling
  processed = `<div class="markdown-content">${processed}</div>`

  return processed
}

export function ProjectAgentChat({ projectContext, compact = false }: ProjectAgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm your project planning assistant. I'll help you plan and organize your "${
        projectContext.name || "new project"
      }". What would you like to know?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: generateResponse(input, projectContext),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Simple response generation based on project context
  const generateResponse = (query: string, context: ProjectAgentChatProps["projectContext"]): string => {
    const queryLower = query.toLowerCase()

    if (queryLower.includes("tech stack") || queryLower.includes("technology")) {
      return `Based on your project description, I recommend using ${context.techStack.join(", ")} for your project. These technologies work well together and should meet your requirements.`
    }

    if (queryLower.includes("file") || queryLower.includes("upload")) {
      return `You have ${context.files.length} files uploaded. If you need to upload more files, you can go back to the Import Resources tab.`
    }

    if (queryLower.includes("repository") || queryLower.includes("github")) {
      return `You have ${context.repositories.length} repositories imported. If you need to import more repositories, you can go back to the Import Resources tab.`
    }

    if (queryLower.includes("link") || queryLower.includes("website")) {
      return `You have ${context.links.length} external links added. If you need to add more links, you can go back to the Import Resources tab.`
    }

    if (queryLower.includes("plan") || queryLower.includes("next step")) {
      return `For your ${context.name} project, I recommend starting with setting up the basic project structure using ${
        context.techStack[0] || "your preferred framework"
      }. Then, you can implement the core features described in your project description.`
    }

    return `I'm here to help with your ${context.name || "project"}. Could you provide more details about what you'd like to know or what you're trying to accomplish?`
  }

  return (
    <>
      <style jsx global>{`
        .markdown-content .list-item {
          display: flex;
          margin-bottom: 0.25rem;
        }
        .markdown-content .list-number {
          margin-right: 0.5rem;
          font-weight: 500;
        }
        .markdown-content strong {
          font-weight: 600;
        }
        .markdown-content code.inline-code {
          background-color: rgba(0, 0, 0, 0.1);
          padding: 0.1rem 0.2rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.9em;
        }
      `}</style>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Chat with Project Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className={`h-[400px] pr-4`}>
            <div className={`flex flex-col ${compact ? "h-[400px]" : "h-[600px]"}`}>
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8">
                        <div className="bg-primary text-primary-foreground h-full w-full flex items-center justify-center text-sm font-medium">
                          AI
                        </div>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: parseMarkdown(message.content),
                        }}
                      />
                      <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <Avatar className="h-8 w-8">
                      <div className="bg-primary text-primary-foreground h-full w-full flex items-center justify-center text-sm font-medium">
                        AI
                      </div>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 bg-muted">
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex gap-2 mt-4">
            <Textarea
              placeholder="Ask a question about your project..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[60px]"
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="h-[60px] w-[60px]"
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
