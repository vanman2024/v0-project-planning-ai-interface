"use client"

import { useState, useRef, useEffect } from "react"
import { useUnifiedChat } from "@/contexts/unified-chat-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { parseMarkdown } from "@/utils/markdown"
import { Send, Search, X } from "lucide-react"

interface ChatAreaProps {
  compact?: boolean
  showProjectInfo?: boolean
}

export function ChatArea({ compact = false, showProjectInfo = false }: ChatAreaProps) {
  const { threads, activeThreadId, activeProjectId, messages, sendMessage, searchMessages } = useUnifiedChat()
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

    const results = searchMessages(searchQuery, { threadId: activeThreadId })
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
      <div className="flex items-center justify-between p-3 border-b">
        <div>
          <h2 className={`font-semibold ${compact ? "text-sm" : ""}`}>
            {activeThread?.name || "Select a thread"}
            {showProjectInfo && activeProjectId && ` (${activeProjectId})`}
          </h2>
          {activeThread?.description && (
            <p className={`text-muted-foreground ${compact ? "text-xs" : "text-sm"}`}>{activeThread.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isSearching ? (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search in thread"
                className={`${compact ? "w-40 h-7 text-xs" : "w-60"}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button size="icon" variant="ghost" className={compact ? "h-7 w-7" : ""} onClick={handleSearch}>
                <Search className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className={compact ? "h-7 w-7" : ""}
                onClick={() => {
                  setIsSearching(false)
                  setSearchQuery("")
                  setSearchResults([])
                }}
              >
                <X className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
              </Button>
            </div>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              className={compact ? "h-7 w-7" : ""}
              onClick={() => setIsSearching(true)}
            >
              <Search className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
              <span className="sr-only">Search</span>
            </Button>
          )}
        </div>
      </div>

      {/* Search results */}
      {isSearching && searchResults.length > 0 && (
        <div className="p-3 border-b bg-muted/50">
          <h3 className={`font-medium mb-2 ${compact ? "text-xs" : "text-sm"}`}>
            Search Results ({searchResults.length})
          </h3>
          <ScrollArea className={compact ? "h-32" : "h-40"}>
            <div className="space-y-2">
              {searchResults.map((result) => (
                <div key={result.id} className="p-2 rounded bg-background">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className={compact ? "h-5 w-5" : "h-6 w-6"}>
                      <img src={result.sender.avatar || "/placeholder.svg"} alt={result.sender.name} />
                    </Avatar>
                    <span className={`font-medium ${compact ? "text-xs" : "text-sm"}`}>{result.sender.name}</span>
                    <span className={`text-muted-foreground ${compact ? "text-[10px]" : "text-xs"}`}>
                      {formatTime(result.timestamp)}
                    </span>
                  </div>
                  <div
                    className={compact ? "text-xs" : "text-sm"}
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
      <ScrollArea className="flex-1 p-3">
        {activeThreadId ? (
          <div className="space-y-4">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-border"></div>
                  <span className={`font-medium text-muted-foreground ${compact ? "text-[10px]" : "text-xs"}`}>
                    {date}
                  </span>
                  <div className="h-px flex-1 bg-border"></div>
                </div>

                <div className="space-y-3">
                  {dateMessages.map((message) => (
                    <div key={message.id} className="flex items-start gap-2">
                      <Avatar className={compact ? "h-6 w-6 mt-0.5" : "h-8 w-8 mt-0.5"}>
                        <img src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-medium ${compact ? "text-xs" : "text-sm"}`}>
                            {message.sender.name}
                          </span>
                          <span className={`text-muted-foreground ${compact ? "text-[10px]" : "text-xs"}`}>
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <div
                          className={`prose max-w-none dark:prose-invert ${compact ? "prose-xs" : "prose-sm"}`}
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
            <p className={`text-muted-foreground ${compact ? "text-xs" : "text-sm"}`}>
              Select a thread to start chatting
            </p>
          </div>
        )}
      </ScrollArea>

      {/* Message input */}
      {activeThreadId && (
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Textarea
              placeholder="Type a message..."
              className={compact ? "min-h-[50px] text-sm" : "min-h-[60px]"}
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
              className={compact ? "h-[50px] w-[50px]" : "h-[60px] w-[60px]"}
              size="icon"
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
            >
              <Send className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
