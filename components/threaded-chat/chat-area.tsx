"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@/contexts/chat-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Send, Search, X } from "lucide-react"

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

export function ChatArea() {
  const { threads, activeThreadId, messages, sendMessage, searchMessages } = useChat()
  const [messageInput, setMessageInput] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeThread = threads.find((t) => t.id === activeThreadId)
  const threadMessages = activeThreadId ? messages[activeThreadId] || [] : []

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [threadMessages])

  const handleSendMessage = () => {
    if (!activeThreadId || !messageInput.trim()) return

    sendMessage(activeThreadId, messageInput)
    setMessageInput("")
  }

  const handleSearch = () => {
    if (!searchQuery.trim() || !activeThreadId) return

    const results = searchMessages(searchQuery, activeThreadId)
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
  const groupedMessages: { [key: string]: typeof threadMessages } = {}

  threadMessages.forEach((message) => {
    const dateKey = formatDate(message.timestamp)
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = []
    }
    groupedMessages[dateKey].push(message)
  })

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="font-semibold">{activeThread?.name || "Select a thread"}</h2>
          {activeThread?.description && <p className="text-sm text-muted-foreground">{activeThread.description}</p>}
        </div>

        <div className="flex items-center gap-2">
          {isSearching ? (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search in thread"
                className="w-60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button size="icon" variant="ghost" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
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
            <Button size="icon" variant="ghost" onClick={() => setIsSearching(true)}>
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
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{
                      __html: parseMarkdown(
                        result.content.replace(new RegExp(searchQuery, "gi"), (match) => `<mark>${match}</mark>`),
                      ),
                    }}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Messages area */}
      <ScrollArea className="flex-1 p-4">
        {activeThreadId ? (
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
                    <div key={message.id} className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 mt-0.5">
                        <img src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{message.sender.name}</span>
                          <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
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
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a thread to start chatting</p>
          </div>
        )}
      </ScrollArea>

      {/* Message input */}
      {activeThreadId && (
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              placeholder="Type a message..."
              className="min-h-[60px]"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <Button
              className="h-[60px] w-[60px]"
              size="icon"
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
