"use client"

import type React from "react"
import { useState } from "react"
import { EnhancedMessageInput } from "../enhanced-message-input"

interface ThreadedChatProps {
  onSendMessage: (message: string) => void
}

export const ThreadedChat: React.FC<ThreadedChatProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("")
  const [files, setFiles] = useState<File[]>([])

  const handleSendMessage = () => {
    if (message.trim() || files.length > 0) {
      // In a real app, you would upload the files and get URLs
      // For now, we'll just log them
      if (files.length > 0) {
        console.log("Files to upload:", files)
      }

      onSendMessage(message)
      setMessage("")
      setFiles([])
    }
  }

  return (
    <div>
      <EnhancedMessageInput
        value={message}
        onChange={setMessage}
        onSend={handleSendMessage}
        placeholder="Type a message..."
        files={files}
        setFiles={setFiles}
      />
    </div>
  )
}
