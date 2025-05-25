"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useThread } from "./thread-context"

// Define types for our chat data
interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  threadId: string
  agentType?: string
  isLoading?: boolean
  reactions?: string[]
}

interface ChatContextType {
  messages: Record<string, Message[]>
  addMessage: (threadId: string, message: Omit<Message, "id" | "timestamp" | "threadId">) => string
  updateMessage: (threadId: string, id: string, message: Partial<Message>) => void
  deleteMessage: (threadId: string, id: string) => void
  getThreadMessages: (threadId: string) => Message[]
  clearThreadMessages: (threadId: string) => void
  addReaction: (threadId: string, messageId: string, reaction: string) => void
  removeReaction: (threadId: string, messageId: string, reaction: string) => void
}

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Create the provider component
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { threads, currentThreadId } = useThread()
  const [messages, setMessages] = useState<Record<string, Message[]>>({})

  // Load messages from localStorage on mount
  useEffect(() => {
    const storedMessages = localStorage.getItem("chat-messages")
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages))
      } catch (error) {
        console.error("Failed to parse messages from localStorage:", error)
      }
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chat-messages", JSON.stringify(messages))
  }, [messages])

  // Initialize welcome messages for new threads
  useEffect(() => {
    threads.forEach((thread) => {
      const threadMessages = messages[thread.metadata.id] || []

      // Only add welcome message if thread has no messages
      if (threadMessages.length === 0) {
        const agentType = thread.metadata.agentType
        let welcomeMessage = ""

        switch (agentType) {
          case "project":
            welcomeMessage =
              "Hello! I'm your Project Assistant. I can help you plan and manage your project. What would you like to discuss today?"
            break
          case "task":
            welcomeMessage =
              "Hello! I'm your Task Agent. I can help you organize, prioritize, and track project tasks. How can I assist you today?"
            break
          case "feature":
            welcomeMessage =
              "Hello! I'm your Feature Agent. I specialize in defining product features and functionality. How can I help with your project features today?"
            break
          case "documentation":
            welcomeMessage =
              "Hello! I'm your Documentation Agent. I can help create and manage project documentation. What documentation needs do you have today?"
            break
          case "detail":
            welcomeMessage =
              "Hello! I'm your Detail Agent. I focus on gathering detailed requirements and specifications. What details would you like to discuss today?"
            break
          case "planning":
            welcomeMessage =
              "Hello! I'm your Planning Agent. I can assist with project scheduling and timeline planning. How can I help with your project planning today?"
            break
          default:
            welcomeMessage = "Hello! I'm your AI assistant. How can I help you today?"
        }

        addMessage(thread.metadata.id, {
          role: "assistant",
          content: welcomeMessage,
          agentType,
        })
      }
    })
  }, [threads])

  // Add a message to a thread
  const addMessage = (threadId: string, message: Omit<Message, "id" | "timestamp" | "threadId">): string => {
    const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const newMessage: Message = {
      ...message,
      id,
      timestamp: new Date().toISOString(),
      threadId,
    }

    setMessages((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), newMessage],
    }))

    return id
  }

  // Update a message in a thread
  const updateMessage = (threadId: string, id: string, message: Partial<Message>) => {
    setMessages((prev) => {
      const threadMessages = prev[threadId] || []
      return {
        ...prev,
        [threadId]: threadMessages.map((msg) => (msg.id === id ? { ...msg, ...message } : msg)),
      }
    })
  }

  // Delete a message from a thread
  const deleteMessage = (threadId: string, id: string) => {
    setMessages((prev) => {
      const threadMessages = prev[threadId] || []
      return {
        ...prev,
        [threadId]: threadMessages.filter((msg) => msg.id !== id),
      }
    })
  }

  // Get all messages for a thread
  const getThreadMessages = (threadId: string): Message[] => {
    return messages[threadId] || []
  }

  // Clear all messages in a thread
  const clearThreadMessages = (threadId: string) => {
    setMessages((prev) => {
      const newMessages = { ...prev }
      delete newMessages[threadId]
      return newMessages
    })
  }

  // Add a reaction to a message
  const addReaction = (threadId: string, messageId: string, reaction: string) => {
    setMessages((prev) => {
      const threadMessages = prev[threadId] || []
      return {
        ...prev,
        [threadId]: threadMessages.map((msg) => {
          if (msg.id === messageId) {
            const reactions = msg.reactions || []
            if (!reactions.includes(reaction)) {
              return { ...msg, reactions: [...reactions, reaction] }
            }
          }
          return msg
        }),
      }
    })
  }

  // Remove a reaction from a message
  const removeReaction = (threadId: string, messageId: string, reaction: string) => {
    setMessages((prev) => {
      const threadMessages = prev[threadId] || []
      return {
        ...prev,
        [threadId]: threadMessages.map((msg) => {
          if (msg.id === messageId && msg.reactions) {
            return { ...msg, reactions: msg.reactions.filter((r) => r !== reaction) }
          }
          return msg
        }),
      }
    })
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        updateMessage,
        deleteMessage,
        getThreadMessages,
        clearThreadMessages,
        addReaction,
        removeReaction,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

// Create a hook to use the context
export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
