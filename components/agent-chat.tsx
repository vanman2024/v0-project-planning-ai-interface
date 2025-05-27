"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Paperclip, Bot, User, Sparkles, CheckSquare, FileText, Lightbulb, Zap } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

type AgentChatProps = {}

export function AgentChat({}: AgentChatProps) {
  const [activeAgent, setActiveAgent] = useState("project-assistant")
  const [message, setMessage] = useState("")
  const [conversations, setConversations] = useState<Record<string, any[]>>({
    "project-assistant": [
      {
        id: "1",
        sender: "agent",
        content: "Hi there! I'm your Project Assistant. How can I help you plan your project today?",
        timestamp: new Date().toISOString(),
      },
    ],
    "task-agent": [
      {
        id: "1",
        sender: "agent",
        content: "Hello! I'm your Task Agent. I can help you organize, prioritize, and track your tasks.",
        timestamp: new Date().toISOString(),
      },
    ],
    "feature-agent": [
      {
        id: "1",
        sender: "agent",
        content: "Welcome! I'm your Feature Agent. I specialize in defining product features and functionality.",
        timestamp: new Date().toISOString(),
      },
    ],
    "documentation-agent": [
      {
        id: "1",
        sender: "agent",
        content: "Greetings! I'm your Documentation Agent. I can help create and manage project documentation.",
        timestamp: new Date().toISOString(),
      },
    ],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversations, activeAgent])

  const agents = [
    {
      id: "project-assistant",
      name: "Project Assistant",
      icon: Sparkles,
      color: "text-purple-500",
      description: "General guidance and coordination",
    },
    {
      id: "task-agent",
      name: "Task Agent",
      icon: CheckSquare,
      color: "text-blue-500",
      description: "Organize and track tasks",
    },
    {
      id: "feature-agent",
      name: "Feature Agent",
      icon: Zap,
      color: "text-orange-500",
      description: "Define product features",
    },
    {
      id: "documentation-agent",
      name: "Documentation Agent",
      icon: FileText,
      color: "text-green-500",
      description: "Create documentation",
    },
  ]

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: message,
      timestamp: new Date().toISOString(),
    }

    setConversations((prev) => ({
      ...prev,
      [activeAgent]: [...prev[activeAgent], userMessage],
    }))

    setMessage("")

    // Simulate agent response after a short delay
    setTimeout(() => {
      const agentResponses: Record<string, string> = {
        "project-assistant":
          "I can help you plan your project! Would you like me to suggest a project structure or help you define your project goals?",
        "task-agent":
          "I'll help you organize those tasks. Would you like me to create a task list or help you prioritize your existing tasks?",
        "feature-agent":
          "That's a great feature idea! Let me help you define it better. What problem does this feature solve for your users?",
        "documentation-agent":
          "I can help with that documentation. Would you like me to create a template or suggest what sections to include?",
      }

      const agentMessage = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        content: agentResponses[activeAgent] || "I'm here to help! What would you like to know?",
        timestamp: new Date().toISOString(),
      }

      setConversations((prev) => ({
        ...prev,
        [activeAgent]: [...prev[activeAgent], agentMessage],
      }))
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold mb-1">AI Assistant 🤖</h1>
        <p className="text-muted-foreground">Chat with specialized AI agents to help with your project</p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Agent Sidebar */}
        <div className="w-64 border-r hidden md:block">
          <div className="p-4 border-b">
            <h2 className="font-medium">Your Agents</h2>
          </div>
          <div className="p-2">
            {agents.map((agent) => {
              const AgentIcon = agent.icon
              return (
                <Button
                  key={agent.id}
                  variant={activeAgent === agent.id ? "default" : "ghost"}
                  className="w-full justify-start mb-1 h-auto py-3"
                  onClick={() => setActiveAgent(agent.id)}
                >
                  <AgentIcon className={`w-5 h-5 mr-2 ${agent.color}`} />
                  <div className="text-left">
                    <div>{agent.name}</div>
                    <div className="text-xs font-normal text-muted-foreground">{agent.description}</div>
                  </div>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Mobile Agent Selector */}
        <div className="md:hidden p-2 border-b">
          <Tabs defaultValue={activeAgent} value={activeAgent} onValueChange={setActiveAgent}>
            <TabsList className="w-full">
              {agents.map((agent) => (
                <TabsTrigger key={agent.id} value={agent.id} className="flex-1">
                  {agent.name.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {conversations[activeAgent].map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className={msg.sender === "user" ? "bg-blue-100" : "bg-purple-100"}>
                      {msg.sender === "user" ? (
                        <User className="h-5 w-5 text-blue-700" />
                      ) : (
                        <Bot className="h-5 w-5 text-purple-700" />
                      )}
                      <AvatarFallback>{msg.sender === "user" ? "U" : "A"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div
                        className={`rounded-lg p-3 ${
                          msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{formatTime(msg.timestamp)}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Suggestion Chips */}
          <div className="p-2 border-t">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setMessage("Help me plan my project")}>
                <Lightbulb className="w-3.5 h-3.5 mr-1" />
                Plan my project
              </Button>
              <Button variant="outline" size="sm" onClick={() => setMessage("Create a task list for me")}>
                <CheckSquare className="w-3.5 h-3.5 mr-1" />
                Create tasks
              </Button>
              <Button variant="outline" size="sm" onClick={() => setMessage("Help me define a feature")}>
                <Zap className="w-3.5 h-3.5 mr-1" />
                Define feature
              </Button>
              <Button variant="outline" size="sm" onClick={() => setMessage("Create project documentation")}>
                <FileText className="w-3.5 h-3.5 mr-1" />
                Documentation
              </Button>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                placeholder={`Ask the ${agents.find((a) => a.id === activeAgent)?.name} anything...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!message.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
