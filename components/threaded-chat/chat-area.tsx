"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, X, MessageSquare, Bot, Paperclip } from "lucide-react"
import { EnhancedMessageInput } from "./enhanced-message-input"
import { MessageReactions } from "./message-reactions"
import { MessageUtilityBar } from "./message-utility-bar"

// Mock data for messages
const mockMessages = [
  {
    id: "msg1",
    content:
      "Hello team! I've started working on the project planning interface. What do you think about the current design?",
    sender: { id: "user1", name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40&query=AJ", isBot: false },
    timestamp: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
    reactions: ["👍", "🎉"],
    hasThread: true,
    threadCount: 3,
    attachments: [],
  },
  {
    id: "msg2",
    content:
      "I've analyzed the requirements and created a preliminary task breakdown. Here are the main components we need to implement:\n\n1. Project dashboard\n2. Task management system\n3. Resource allocation tool\n4. Timeline visualization\n5. Collaboration features",
    sender: { id: "bot1", name: "Task Agent", avatar: "/placeholder.svg?height=40&width=40&query=TA", isBot: true },
    timestamp: new Date(Date.now() - 3600000 * 24), // 1 day ago
    reactions: ["👍"],
    hasThread: false,
    threadCount: 0,
    attachments: [],
  },
  {
    id: "msg3",
    content:
      "The design looks great! I especially like the dashboard layout. Could we add a section for project milestones?",
    sender: { id: "user2", name: "Sam Wilson", avatar: "/placeholder.svg?height=40&width=40&query=SW", isBot: false },
    timestamp: new Date(Date.now() - 3600000 * 12), // 12 hours ago
    reactions: [],
    hasThread: true,
    threadCount: 2,
    attachments: [],
  },
  {
    id: "msg4",
    content:
      "Based on the requirements, I've drafted some initial documentation for the project. You can find it in the shared folder. Let me know if you need any clarification.",
    sender: {
      id: "bot2",
      name: "Documentation Agent",
      avatar: "/placeholder.svg?height=40&width=40&query=DA",
      isBot: true,
    },
    timestamp: new Date(Date.now() - 3600000 * 6), // 6 hours ago
    reactions: ["👍", "🙏"],
    hasThread: false,
    threadCount: 0,
    attachments: [],
  },
  {
    id: "msg5",
    content: "I've reviewed the documentation and it looks comprehensive. Great job!",
    sender: { id: "user1", name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40&query=AJ", isBot: false },
    timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    reactions: [],
    hasThread: false,
    threadCount: 0,
    attachments: [],
  },
]

interface ChatAreaProps {
  onOpenThread: () => void
}

export function ChatArea({ onOpenThread }: ChatAreaProps) {
  const [messages, setMessages] = useState(mockMessages)
  const [messageInput, setMessageInput] = useState("")
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!messageInput.trim() && attachedFiles.length === 0) return

    const newMessage = {
      id: `msg${Date.now()}`,
      content: messageInput,
      sender: {
        id: "user1",
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40&query=AJ",
        isBot: false,
      },
      timestamp: new Date(),
      reactions: [],
      hasThread: false,
      threadCount: 0,
      attachments: attachedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
    }

    setMessages([...messages, newMessage])
    setMessageInput("")
    setAttachedFiles([])
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    const results = messages.filter((message) => message.content.toLowerCase().includes(searchQuery.toLowerCase()))
    setSearchResults(results)
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
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div>
          <h2 className="font-semibold">Project Planning</h2>
          <p className="text-sm text-muted-foreground">General discussion about project planning</p>
        </div>

        <div className="flex items-center gap-2">
          {isSearching ? (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search in thread"
                className="w-60 h-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => {
                  setIsSearching(false)
                  setSearchQuery("")
                  setSearchResults([])
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsSearching(true)}>
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          )}
        </div>
      </div>

      {/* Search results */}
      {isSearching && searchResults.length > 0 && (
        <div className="p-4 border-b bg-muted/50">
          <h3 className="text-sm font-medium mb-2">Search Results ({searchResults.length})</h3>
          <ScrollArea className="h-40">
            <div className="space-y-2">
              {searchResults.map((result) => (
                <div key={result.id} className="p-2 rounded bg-background">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <img src={result.sender.avatar || "/placeholder.svg"} alt={result.sender.name} />
                    </Avatar>
                    <span className="text-sm font-medium">{result.sender.name}</span>
                    <span className="text-xs text-muted-foreground">{formatTime(result.timestamp)}</span>
                  </div>
                  <div className="text-sm">
                    {result.content.replace(new RegExp(searchQuery, "gi"), (match) => `<mark>${match}</mark>`)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Messages area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-border"></div>
                <span className="text-xs font-medium text-muted-foreground">{date}</span>
                <div className="h-px flex-1 bg-border"></div>
              </div>

              <div className="space-y-4">
                {dateMessages.map((message) => (
                  <div key={message.id} className="group">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 mt-0.5">
                        <img src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium flex items-center gap-1">
                            {message.sender.name}
                            {message.sender.isBot && <Bot className="h-3 w-3 text-primary" />}
                          </span>
                          <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                        </div>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          {message.content.split("\n").map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                          ))}
                        </div>

                        {/* Display attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Paperclip className="h-3 w-3" />
                                <span>{attachment.name}</span>
                                <span className="text-xs">({(attachment.size / 1024).toFixed(1)} KB)</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Message reactions */}
                        {message.reactions.length > 0 && <MessageReactions reactions={message.reactions} />}

                        {/* Thread indicator */}
                        {message.hasThread && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-1 h-7 text-xs text-muted-foreground"
                            onClick={onOpenThread}
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            {message.threadCount} {message.threadCount === 1 ? "reply" : "replies"}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Message utility bar (appears on hover) */}
                    <MessageUtilityBar className="invisible group-hover:visible" onReply={onOpenThread} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message input */}
      <div className="p-3 border-t">
        <EnhancedMessageInput
          value={messageInput}
          onChange={setMessageInput}
          onSend={handleSendMessage}
          placeholder="Message #project-planning"
          files={attachedFiles}
          setFiles={setAttachedFiles}
        />
      </div>
    </div>
  )
}
