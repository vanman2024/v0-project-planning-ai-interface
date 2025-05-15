"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"

interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
  avatar?: string
}

// Let's also update the Agent Console component to properly render markdown

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

export function AgentConsole() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "scoper-agent",
      content: "I've analyzed the requirements and generated an initial plan structure.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      avatar: "/abstract-geometric-sa.png",
    },
    {
      id: "2",
      sender: "doc-agent",
      content: "I've documented the Auth module. Should I proceed to the Product module?",
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      avatar: "/abstract-geometric-da.png",
    },
    {
      id: "3",
      sender: "You",
      content: "Yes, please document the Product module next.",
      timestamp: new Date(Date.now() - 1000 * 60 * 1),
    },
  ])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "You",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate agent response after a delay
    setTimeout(() => {
      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        sender: "doc-agent",
        content:
          "I'll start documenting the Product module right away. I'll analyze the requirements and create comprehensive documentation for the CRUD operations and data model. **This is bold text.** *This is italic text.* `This is inline code.`\n\n1.  First item\n2.  Second item\n\n- Bullet point 1\n- Bullet point 2",
        timestamp: new Date(),
        avatar: "/abstract-geometric-da.png",
      }

      setMessages((prev) => [...prev, agentMessage])
    }, 1000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
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
      <Card className="h-[500px] flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle>Agent Console</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-[380px] px-4">
            <div className="flex flex-col gap-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.sender === "You" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender !== "You" && (
                    <Avatar className="h-8 w-8">
                      <img src={message.avatar || "/placeholder.svg"} alt={message.sender} />
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "You" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{message.sender}</span>
                      <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                    </div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: parseMarkdown(message.content),
                      }}
                    />
                  </div>
                  {message.sender === "You" && (
                    <Avatar className="h-8 w-8">
                      <img src="/abstract-self-reflection.png" alt="You" />
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="flex w-full gap-2">
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}
