"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { v4 as uuidv4 } from "uuid"

// Define message type
interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

export function SimpleChatTest() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      // Call our API
      const response = await fetch("/api/chat-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || "Failed to get response")
      }

      const data = await response.json()

      if (data.message) {
        setMessages((prev) => [...prev, data.message])
      } else if (data.error) {
        throw new Error(data.error)
      }
    } catch (err) {
      console.error("Error sending message:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Simple Chat Test</h2>

      <div className="mb-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`p-3 rounded-lg ${message.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}>
            <p>
              <strong>{message.role}:</strong> {message.content}
            </p>
          </div>
        ))}

        {error && <div className="p-3 bg-red-100 text-red-800 rounded-lg">Error: {error}</div>}

        {isLoading && <div className="p-3 bg-yellow-100 rounded-lg">Loading response...</div>}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input value={input} onChange={handleInputChange} placeholder="Type a message..." className="flex-1" />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  )
}
