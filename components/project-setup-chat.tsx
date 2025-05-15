"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MessageSquare, CheckSquare, Layers, FileText, Info, Calendar, Plus, Search, Send } from "lucide-react"
import { parseMarkdown } from "@/utils/markdown"
import type { AgentType } from "@/contexts/unified-chat-context"

interface ProjectSetupChatProps {
  projectId: string
  projectName: string
}

export function ProjectSetupChat({ projectId, projectName }: ProjectSetupChatProps) {
  const [activeAgent, setActiveAgent] = useState<AgentType>("main")
  const [searchQuery, setSearchQuery] = useState("")
  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock data for demonstration
  const threads = [
    { id: "main", name: `${projectName} - Main`, agentType: "main", pinned: true, unreadCount: 0 },
    { id: "tasks", name: `${projectName} - Tasks`, agentType: "task", pinned: false, unreadCount: 0 },
    { id: "features", name: `${projectName} - Features`, agentType: "feature", pinned: false, unreadCount: 0 },
    { id: "docs", name: `${projectName} - Documentation`, agentType: "documentation", pinned: false, unreadCount: 0 },
  ]

  // Mock messages
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: { name: "Main Agent", avatar: "", isAgent: true },
      content: `How can I help you with the project for ${projectName}?`,
      timestamp: new Date(),
    },
  ])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSwitchAgent = (agentType: AgentType) => {
    setActiveAgent(agentType)
    // Update messages for the new agent
    setMessages([
      {
        id: Date.now().toString(),
        sender: { name: `${getAgentDisplayName(agentType)} Agent`, avatar: "", isAgent: true },
        content: `How can I help you with ${getAgentTask(agentType)} for ${projectName}?`,
        timestamp: new Date(),
      },
    ])
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: { name: "You", avatar: "", isAgent: false },
      content: messageInput,
      timestamp: new Date(),
    }

    // Add agent response (simulated)
    const agentResponse = {
      id: (Date.now() + 1).toString(),
      sender: { name: `${getAgentDisplayName(activeAgent)} Agent`, avatar: "", isAgent: true },
      content: `I'm processing your request about "${messageInput}" for ${projectName}.`,
      timestamp: new Date(Date.now() + 1000),
    }

    setMessages([...messages, userMessage, agentResponse])
    setMessageInput("")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

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

  // Group messages by date
  const groupedMessages: { [key: string]: typeof messages } = {}

  messages.forEach((message) => {
    const dateKey = formatDate(message.timestamp)
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = []
    }
    groupedMessages[dateKey].push(message)
  })

  return (
    <div className="flex h-[500px] border rounded-md overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r flex flex-col h-full">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search threads"
              className="pl-8 h-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 border-b">
          <h3 className="text-xs font-medium text-muted-foreground mb-3">AGENTS</h3>
          <TooltipProvider>
            <div className="grid grid-cols-2 gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeAgent === "main" ? "default" : "outline"}
                    size="sm"
                    className="justify-start text-xs h-9 w-full"
                    onClick={() => handleSwitchAgent("main")}
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-2" />
                    Main
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px]">
                  <p>General project assistant for overall guidance and coordination</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeAgent === "task" ? "default" : "outline"}
                    size="sm"
                    className="justify-start text-xs h-9 w-full"
                    onClick={() => handleSwitchAgent("task")}
                  >
                    <CheckSquare className="h-3.5 w-3.5 mr-2" />
                    Tasks
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px]">
                  <p>Helps create, organize, and prioritize project tasks and deliverables</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeAgent === "feature" ? "default" : "outline"}
                    size="sm"
                    className="justify-start text-xs h-9 w-full"
                    onClick={() => handleSwitchAgent("feature")}
                  >
                    <Layers className="h-3.5 w-3.5 mr-2" />
                    Features
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px]">
                  <p>Specializes in defining and planning product features and functionality</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeAgent === "documentation" ? "default" : "outline"}
                    size="sm"
                    className="justify-start text-xs h-9 w-full"
                    onClick={() => handleSwitchAgent("documentation")}
                  >
                    <FileText className="h-3.5 w-3.5 mr-2" />
                    Docs
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px]">
                  <p>Creates and manages project documentation, guides, and references</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeAgent === "detail" ? "default" : "outline"}
                    size="sm"
                    className="justify-start text-xs h-9 w-full"
                    onClick={() => handleSwitchAgent("detail")}
                  >
                    <Info className="h-3.5 w-3.5 mr-2" />
                    Details
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px]">
                  <p>Focuses on gathering detailed requirements and specifications</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeAgent === "planner" ? "default" : "outline"}
                    size="sm"
                    className="justify-start text-xs h-9 w-full"
                    onClick={() => handleSwitchAgent("planner")}
                  >
                    <Calendar className="h-3.5 w-3.5 mr-2" />
                    Planning
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[200px]">
                  <p>Assists with project scheduling, milestones, and timeline planning</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-3">
            <div className="mb-4">
              <h3 className="text-xs font-medium text-muted-foreground mb-2 px-2">PINNED</h3>
              <div className="space-y-1">
                {threads
                  .filter((thread) => thread.pinned)
                  .map((thread) => (
                    <ThreadItem
                      key={thread.id}
                      thread={thread}
                      isActive={thread.agentType === activeAgent}
                      onClick={() => handleSwitchAgent(thread.agentType as AgentType)}
                    />
                  ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-2 px-2">THREADS</h3>
              <div className="space-y-1">
                {threads
                  .filter((thread) => !thread.pinned)
                  .map((thread) => (
                    <ThreadItem
                      key={thread.id}
                      thread={thread}
                      isActive={thread.agentType === activeAgent}
                      onClick={() => handleSwitchAgent(thread.agentType as AgentType)}
                    />
                  ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-3 border-t">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-xs h-9">
                  <Plus className="h-3.5 w-3.5 mr-2" />
                  New Thread
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <p>Create a new conversation thread for this project</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-3">
          <h2 className="font-medium">
            {projectName} - {getAgentDisplayName(activeAgent)}
          </h2>
          <p className="text-xs text-muted-foreground">{getAgentDescription(activeAgent, projectName)}</p>
        </div>

        <ScrollArea className="flex-1 p-3">
          <div className="space-y-4">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-border"></div>
                  <span className="font-medium text-muted-foreground text-xs">{date}</span>
                  <div className="h-px flex-1 bg-border"></div>
                </div>

                <div className="space-y-3">
                  {dateMessages.map((message) => (
                    <div key={message.id} className="flex items-start gap-2">
                      <Avatar className="h-8 w-8 mt-0.5">
                        {message.sender.isAgent ? (
                          <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {getAgentInitial(activeAgent)}
                          </div>
                        ) : (
                          <img src="/placeholder.svg" alt="You" />
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{message.sender.name}</span>
                          <span className="text-muted-foreground text-xs">{formatTime(message.timestamp)}</span>
                        </div>
                        <div
                          className="prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{
                            __html: parseMarkdown(message.content),
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-3 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Textarea
              placeholder="Type a message..."
              className="min-h-[60px] flex-1"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="submit" className="h-[60px] w-[60px]" size="icon" disabled={!messageInput.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Send message (Enter)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </form>
        </div>
      </div>
    </div>
  )
}

interface ThreadItemProps {
  thread: {
    id: string
    name: string
    agentType: string
    unreadCount: number
  }
  isActive: boolean
  onClick: () => void
}

function ThreadItem({ thread, isActive, onClick }: ThreadItemProps) {
  const getThreadIcon = (agentType: string) => {
    switch (agentType) {
      case "task":
        return <CheckSquare className="h-4 w-4" />
      case "feature":
        return <Layers className="h-4 w-4" />
      case "documentation":
        return <FileText className="h-4 w-4" />
      case "detail":
        return <Info className="h-4 w-4" />
      case "planner":
        return <Calendar className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getThreadTooltip = (agentType: string): string => {
    switch (agentType) {
      case "task":
        return "Task management conversation thread"
      case "feature":
        return "Feature planning and implementation thread"
      case "documentation":
        return "Documentation creation and management thread"
      case "detail":
        return "Detailed specifications thread"
      case "planner":
        return "Project planning and scheduling thread"
      default:
        return "Main project discussion thread"
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer group ${
              isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted"
            }`}
            onClick={onClick}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              {getThreadIcon(thread.agentType)}
              <span className="truncate text-sm">{thread.name}</span>
            </div>

            {thread.unreadCount > 0 && (
              <div className="h-5 min-w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs px-1.5">
                {thread.unreadCount}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[200px]">
          <p>{getThreadTooltip(thread.agentType)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function getAgentDisplayName(agentType: AgentType): string {
  switch (agentType) {
    case "task":
      return "Tasks"
    case "feature":
      return "Features"
    case "documentation":
      return "Documentation"
    case "detail":
      return "Details"
    case "planner":
      return "Planning"
    default:
      return "Main"
  }
}

function getAgentDescription(agentType: AgentType, projectName: string): string {
  switch (agentType) {
    case "task":
      return `Task management and tracking for ${projectName}`
    case "feature":
      return `Feature planning and implementation for ${projectName}`
    case "documentation":
      return `Documentation creation and management for ${projectName}`
    case "detail":
      return `Detailed specifications and requirements for ${projectName}`
    case "planner":
      return `Project planning and scheduling for ${projectName}`
    default:
      return `Main discussion for ${projectName}`
  }
}

function getAgentInitial(agentType: AgentType): string {
  switch (agentType) {
    case "task":
      return "T"
    case "feature":
      return "F"
    case "documentation":
      return "D"
    case "detail":
      return "D"
    case "planner":
      return "P"
    default:
      return "M"
  }
}

function getAgentTask(agentType: AgentType): string {
  switch (agentType) {
    case "task":
      return "tasks"
    case "feature":
      return "features"
    case "documentation":
      return "documentation"
    case "detail":
      return "details"
    case "planner":
      return "planning"
    default:
      return "the project"
  }
}
