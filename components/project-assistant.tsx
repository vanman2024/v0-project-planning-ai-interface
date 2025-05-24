"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Bot, Send, User } from "lucide-react"

interface ProjectAssistantProps {
  projectId?: string
  projectName?: string
  projectDescription?: string
  onUpdateProject?: (updates: any) => void
}

export function ProjectAssistant({
  projectId = "new-project",
  projectName = "New Project",
  projectDescription = "",
  onUpdateProject,
}: ProjectAssistantProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  // Initialize chat with the Vercel AI SDK
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: {
      projectId,
      projectName,
      projectDescription,
    },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Hi there! I'm your Project Assistant for "${projectName}". I'll help you define the features for your project and develop a roadmap. What's your project about?`,
      },
    ],
    onFinish: (message) => {
      // Here we could parse the message for any inferred features or tasks
      // and update the project context accordingly
      if (onUpdateProject && message.content.includes("FEATURES:")) {
        // This is a simplified example - in a real implementation, we would
        // parse the message content to extract structured data
        const features = extractFeaturesFromMessage(message.content)
        onUpdateProject({ features })
      }
    },
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  }, [messages, autoScroll])

  // Extract features from message content (simplified example)
  const extractFeaturesFromMessage = (content: string): any[] => {
    // In a real implementation, this would parse the message to extract
    // structured feature data. This is just a placeholder.
    return []
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role !== "user" && (
                <Avatar className="h-8 w-8 mr-2">
                  <Bot className="h-4 w-4" />
                </Avatar>
              )}

              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <div className="prose prose-sm dark:prose-invert">{message.content}</div>
              </div>

              {message.role === "user" && (
                <Avatar className="h-8 w-8 ml-2">
                  <User className="h-4 w-4" />
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <Avatar className="h-8 w-8 mr-2">
                <Bot className="h-4 w-4" />
              </Avatar>
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce delay-75" />
                  <div className="w-2 h-2 rounded-full bg-foreground/30 animate-bounce delay-150" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Describe your project or ask questions..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
