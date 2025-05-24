"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { X } from "lucide-react"
import { EnhancedMessageInput } from "./enhanced-message-input"
import { MessageReactions } from "./message-reactions"

// Mock data for the parent message and thread replies
const mockParentMessage = {
  id: "msg1",
  content:
    "Hello team! I've started working on the project planning interface. What do you think about the current design?",
  sender: { id: "user1", name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40&query=AJ", isBot: false },
  timestamp: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
  reactions: ["👍", "🎉"],
}

const mockThreadReplies = [
  {
    id: "reply1",
    content: "I think the design looks great! The layout is intuitive and the color scheme works well.",
    sender: { id: "user2", name: "Sam Wilson", avatar: "/placeholder.svg?height=40&width=40&query=SW", isBot: false },
    timestamp: new Date(Date.now() - 3600000 * 24 * 1.5), // 1.5 days ago
    reactions: ["👍"],
  },
  {
    id: "reply2",
    content:
      "I've analyzed the design and it aligns well with user experience best practices. The navigation flow is logical and the information hierarchy is clear.",
    sender: { id: "bot1", name: "Design Agent", avatar: "/placeholder.svg?height=40&width=40&query=DA", isBot: true },
    timestamp: new Date(Date.now() - 3600000 * 24), // 1 day ago
    reactions: [],
  },
  {
    id: "reply3",
    content: "Could we add a section for quick actions on the dashboard? That would make common tasks more accessible.",
    sender: { id: "user3", name: "Jamie Lee", avatar: "/placeholder.svg?height=40&width=40&query=JL", isBot: false },
    timestamp: new Date(Date.now() - 3600000 * 12), // 12 hours ago
    reactions: ["💡"],
  },
]

interface ThreadPanelProps {
  onClose: () => void
}

export function ThreadPanel({ onClose }: ThreadPanelProps) {
  const [replies, setReplies] = useState(mockThreadReplies)
  const [replyInput, setReplyInput] = useState("")
  const repliesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when replies change
  useEffect(() => {
    if (repliesEndRef.current) {
      repliesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [replies])

  const handleSendReply = () => {
    if (!replyInput.trim()) return

    const newReply = {
      id: `reply${Date.now()}`,
      content: replyInput,
      sender: {
        id: "user1",
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40&query=AJ",
        isBot: false,
      },
      timestamp: new Date(),
      reactions: [],
    }

    setReplies([...replies, newReply])
    setReplyInput("")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: new Date().getFullYear() !== date.getFullYear() ? "numeric" : undefined,
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-semibold">Thread</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close thread</span>
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Parent message */}
          <div className="mb-6">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 mt-0.5">
                <img src={mockParentMessage.sender.avatar || "/placeholder.svg"} alt={mockParentMessage.sender.name} />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{mockParentMessage.sender.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(mockParentMessage.timestamp)} at {formatTime(mockParentMessage.timestamp)}
                  </span>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">{mockParentMessage.content}</div>

                {/* Message reactions */}
                {mockParentMessage.reactions.length > 0 && <MessageReactions reactions={mockParentMessage.reactions} />}
              </div>
            </div>
          </div>

          {/* Thread replies */}
          <div className="space-y-4">
            {replies.map((reply) => (
              <div key={reply.id}>
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 mt-0.5">
                    <img src={reply.sender.avatar || "/placeholder.svg"} alt={reply.sender.name} />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{reply.sender.name}</span>
                      <span className="text-xs text-muted-foreground">{formatTime(reply.timestamp)}</span>
                    </div>
                    <div className="prose prose-sm max-w-none dark:prose-invert">{reply.content}</div>

                    {/* Message reactions */}
                    {reply.reactions.length > 0 && <MessageReactions reactions={reply.reactions} />}
                  </div>
                </div>
              </div>
            ))}
            <div ref={repliesEndRef} />
          </div>
        </div>
      </ScrollArea>

      {/* Reply input */}
      <div className="p-3 border-t">
        <EnhancedMessageInput
          value={replyInput}
          onChange={setReplyInput}
          onSend={handleSendReply}
          placeholder="Reply in thread..."
        />
      </div>
    </div>
  )
}
