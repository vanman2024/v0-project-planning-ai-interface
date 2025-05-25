"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { X, Bot } from "lucide-react"
import { EnhancedMessageInput } from "./enhanced-message-input"
import { MessageReactions } from "./message-reactions"

// Mock data for the parent message
const parentMessage = {
  id: "parent1",
  content:
    "Hello team! I've started working on the project planning interface. What do you think about the current design?",
  sender: { id: "user1", name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40&query=AJ", isBot: false },
  timestamp: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
  reactions: ["👍", "🎉"],
}

// Mock data for thread replies
const threadReplies = [
  {
    id: "reply1",
    content: "I like the layout! The dashboard view is especially intuitive.",
    sender: { id: "user2", name: "Sam Wilson", avatar: "/placeholder.svg?height=40&width=40&query=SW", isBot: false },
    timestamp: new Date(Date.now() - 3600000 * 24 * 1.5), // 1.5 days ago
    reactions: ["👍"],
  },
  {
    id: "reply2",
    content:
      "Based on the initial design, I've identified some potential improvements for the user flow. We should consider adding a quick access toolbar for frequently used features.",
    sender: { id: "bot1", name: "UX Agent", avatar: "/placeholder.svg?height=40&width=40&query=UX", isBot: true },
    timestamp: new Date(Date.now() - 3600000 * 24), // 1 day ago
    reactions: [],
  },
  {
    id: "reply3",
    content: "That's a great suggestion! I'll incorporate that in the next iteration.",
    sender: { id: "user1", name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40&query=AJ", isBot: false },
    timestamp: new Date(Date.now() - 3600000 * 12), // 12 hours ago
    reactions: [],
  },
]

interface ThreadPanelProps {
  onClose: () => void
}

export function ThreadPanel({ onClose }: ThreadPanelProps) {
  const [replies, setReplies] = useState(threadReplies)
  const [replyInput, setReplyInput] = useState("")
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
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
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${formatTime(date)}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${formatTime(date)}`
    } else {
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="flex items-center justify-between p-3 border-b">
        <h2 className="font-semibold">Thread</h2>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close thread</span>
        </Button>
      </div>

      {/* Parent message */}
      <div className="p-4 border-b">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8 mt-0.5">
            <img src={parentMessage.sender.avatar || "/placeholder.svg"} alt={parentMessage.sender.name} />
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{parentMessage.sender.name}</span>
              <span className="text-xs text-muted-foreground">{formatDate(parentMessage.timestamp)}</span>
            </div>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p>{parentMessage.content}</p>
            </div>

            {/* Message reactions */}
            {parentMessage.reactions.length > 0 && <MessageReactions reactions={parentMessage.reactions} />}
          </div>
        </div>
      </div>

      {/* Thread replies */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {replies.map((reply) => (
          <div key={reply.id} className="flex items-start gap-3">
            <Avatar className="h-8 w-8 mt-0.5">
              <img src={reply.sender.avatar || "/placeholder.svg"} alt={reply.sender.name} />
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium flex items-center gap-1">
                  {reply.sender.name}
                  {reply.sender.isBot && <Bot className="h-3 w-3 text-primary" />}
                </span>
                <span className="text-xs text-muted-foreground">{formatTime(reply.timestamp)}</span>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p>{reply.content}</p>
              </div>

              {/* Message reactions */}
              {reply.reactions.length > 0 && <MessageReactions reactions={reply.reactions} />}
            </div>
          </div>
        ))}
        <div ref={repliesEndRef} />
      </div>

      {/* Reply input */}
      <div className="p-3 border-t">
        <EnhancedMessageInput
          value={replyInput}
          onChange={setReplyInput}
          onSend={handleSendReply}
          placeholder="Reply in thread"
          files={attachedFiles}
          setFiles={setAttachedFiles}
        />
      </div>
    </div>
  )
}
