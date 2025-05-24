"use client"

import type React from "react"
import { useState } from "react"
import type { Message } from "@/types"
import { EnhancedMessageInput } from "@/components/ui/enhanced-message-input"

interface ChatAreaProps {
  onSendMessage: (message: Message) => void
}

export const ChatArea: React.FC<ChatAreaProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("")
  const [files, setFiles] = useState<File[]>([])

  const handleSend = () => {
    if (message.trim() || files.length > 0) {
      // Handle file uploads here
      if (files.length > 0) {
        console.log("Files to upload:", files)
        // In a real app, you would upload files and get URLs
      }

      onSendMessage({
        id: Date.now().toString(),
        content: message,
        sender: "You",
        timestamp: new Date().toISOString(),
        reactions: [],
        threadCount: 0,
      })
      setMessage("")
      setFiles([])
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-4 overflow-y-auto">{/* Messages will be displayed here */}</div>
      <EnhancedMessageInput
        value={message}
        onChange={setMessage}
        onSend={handleSend}
        placeholder="Type a message..."
        files={files}
        setFiles={setFiles}
      />
    </div>
  )
}
