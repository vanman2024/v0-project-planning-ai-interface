"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { ChatMessage, ChatThread } from "@/types/chat"
import { useToast } from "@/components/ui/use-toast"

interface ChatContextProps {
  threads: ChatThread[]
  activeThreadId: string | null
  messages: Record<string, ChatMessage[]>
  setActiveThreadId: (id: string) => void
  sendMessage: (threadId: string, content: string) => void
  createThread: (name: string, description?: string) => string
  markThreadAsRead: (threadId: string) => void
  searchMessages: (query: string, threadId?: string) => ChatMessage[]
  renameThread: (threadId: string, newName: string) => void
  pinThread: (threadId: string, pinned: boolean) => void
  deleteThread: (threadId: string) => void
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined)

// Mock user data
const currentUser = {
  id: "user-1",
  name: "You",
  avatar: "/abstract-self-reflection.png",
}

const botUsers = [
  {
    id: "bot-1",
    name: "Project Assistant",
    avatar: "/abstract-geometric-sa.png",
    isBot: true,
  },
  {
    id: "bot-2",
    name: "Task Agent",
    avatar: "/abstract-geometric-da.png",
    isBot: true,
  },
  {
    id: "bot-3",
    name: "Feature Agent",
    avatar: "/placeholder-e6kjs.png",
    isBot: true,
  },
]

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: "general",
      name: "General",
      description: "General project discussion",
      icon: "MessageSquare",
      unreadCount: 0,
      lastActivity: new Date(),
      participants: [currentUser, botUsers[0]],
      pinned: true,
    },
    {
      id: "tasks",
      name: "Tasks",
      description: "Task planning and management",
      icon: "CheckSquare",
      unreadCount: 2,
      lastActivity: new Date(Date.now() - 1000 * 60 * 30),
      participants: [currentUser, botUsers[1]],
    },
    {
      id: "features",
      name: "Features",
      description: "Feature planning and discussion",
      icon: "Layers",
      unreadCount: 0,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
      participants: [currentUser, botUsers[2]],
    },
  ])

  const [activeThreadId, setActiveThreadId] = useState<string | null>("general")

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    general: [
      {
        id: "msg-1",
        threadId: "general",
        content: "Welcome to the project planning chat! How can I help you today?",
        sender: botUsers[0],
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: true,
      },
      {
        id: "msg-2",
        threadId: "general",
        content: "I'd like to discuss the overall project structure.",
        sender: currentUser,
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: true,
      },
      {
        id: "msg-3",
        threadId: "general",
        content:
          "Great! Let's start by defining the main components of your project. What kind of application are you building?",
        sender: botUsers[0],
        timestamp: new Date(Date.now() - 1000 * 60 * 29),
        read: true,
      },
    ],
    tasks: [
      {
        id: "task-msg-1",
        threadId: "tasks",
        content:
          "I can help you break down your project into actionable tasks. What's the first feature you want to implement?",
        sender: botUsers[1],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: true,
      },
      {
        id: "task-msg-2",
        threadId: "tasks",
        content: "Let's start with the user authentication system.",
        sender: currentUser,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
        read: true,
      },
      {
        id: "task-msg-3",
        threadId: "tasks",
        content:
          "I've analyzed the requirements and here's a breakdown of tasks for the authentication system:\n\n1. **Setup Auth Provider**\n   - Configure authentication service\n   - Set up user roles and permissions\n\n2. **Implement Login/Signup UI**\n   - Create login form\n   - Create signup form\n   - Add password reset functionality\n\n3. **Backend Integration**\n   - Create API endpoints for auth\n   - Implement JWT token handling\n   - Set up secure session management",
        sender: botUsers[1],
        timestamp: new Date(Date.now() - 1000 * 60 * 31),
        read: false,
      },
      {
        id: "task-msg-4",
        threadId: "tasks",
        content: "Would you like me to add these tasks to your project plan?",
        sender: botUsers[1],
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
      },
    ],
    features: [
      {
        id: "feature-msg-1",
        threadId: "features",
        content:
          "I can help you define and prioritize features for your project. What's the main goal of your application?",
        sender: botUsers[2],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        read: true,
      },
    ],
  })

  // Update thread unread counts when messages change
  useEffect(() => {
    const updatedThreads = threads.map((thread) => {
      const threadMessages = messages[thread.id] || []
      const unreadCount = threadMessages.filter((msg) => !msg.read && msg.sender.id !== currentUser.id).length

      return {
        ...thread,
        unreadCount,
        lastActivity:
          threadMessages.length > 0 ? threadMessages[threadMessages.length - 1].timestamp : thread.lastActivity,
      }
    })

    setThreads(updatedThreads)
  }, [messages])

  // Mark thread as read when it becomes active
  useEffect(() => {
    if (activeThreadId) {
      markThreadAsRead(activeThreadId)
    }
  }, [activeThreadId])

  const sendMessage = (threadId: string, content: string) => {
    if (!content.trim()) return

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      threadId,
      content,
      sender: currentUser,
      timestamp: new Date(),
      read: true,
    }

    setMessages((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), newMessage],
    }))

    // Simulate bot response
    setTimeout(() => {
      const thread = threads.find((t) => t.id === threadId)
      if (!thread) return

      const botUser = thread.participants.find((p) => p.isBot) || botUsers[0]

      const botResponse: ChatMessage = {
        id: `msg-${Date.now()}`,
        threadId,
        content: generateBotResponse(content, botUser.name),
        sender: botUser,
        timestamp: new Date(),
        read: activeThreadId === threadId, // Only mark as read if this thread is active
      }

      setMessages((prev) => ({
        ...prev,
        [threadId]: [...(prev[threadId] || []), botResponse],
      }))

      // Show notification if thread is not active
      if (activeThreadId !== threadId) {
        toast({
          title: `New message in ${thread.name}`,
          description: `${botUser.name}: ${botResponse.content.substring(0, 60)}${botResponse.content.length > 60 ? "..." : ""}`,
          duration: 5000,
        })
      }
    }, 1000)
  }

  const createThread = (name: string, description?: string) => {
    const newThreadId = `thread-${Date.now()}`

    const newThread: ChatThread = {
      id: newThreadId,
      name,
      description,
      icon: "MessageCircle",
      unreadCount: 0,
      lastActivity: new Date(),
      participants: [currentUser, botUsers[Math.floor(Math.random() * botUsers.length)]],
    }

    setThreads((prev) => [...prev, newThread])

    // Add initial bot message
    const botUser = newThread.participants.find((p) => p.isBot) || botUsers[0]

    const initialMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      threadId: newThreadId,
      content: `Welcome to the ${name} thread! How can I assist you with ${description || "this topic"}?`,
      sender: botUser,
      timestamp: new Date(),
      read: false,
    }

    setMessages((prev) => ({
      ...prev,
      [newThreadId]: [initialMessage],
    }))

    return newThreadId
  }

  const markThreadAsRead = (threadId: string) => {
    setMessages((prev) => {
      const threadMessages = prev[threadId] || []

      const updatedMessages = threadMessages.map((msg) => ({
        ...msg,
        read: true,
      }))

      return {
        ...prev,
        [threadId]: updatedMessages,
      }
    })
  }

  const searchMessages = (query: string, threadId?: string) => {
    if (!query.trim()) return []

    const lowerQuery = query.toLowerCase()
    let results: ChatMessage[] = []

    if (threadId) {
      // Search in specific thread
      const threadMessages = messages[threadId] || []
      results = threadMessages.filter((msg) => msg.content.toLowerCase().includes(lowerQuery))
    } else {
      // Search in all threads
      Object.values(messages).forEach((threadMessages) => {
        results = [...results, ...threadMessages.filter((msg) => msg.content.toLowerCase().includes(lowerQuery))]
      })
    }

    return results
  }

  const renameThread = (threadId: string, newName: string) => {
    setThreads((prev) => prev.map((thread) => (thread.id === threadId ? { ...thread, name: newName } : thread)))
  }

  const pinThread = (threadId: string, pinned: boolean) => {
    setThreads((prev) => prev.map((thread) => (thread.id === threadId ? { ...thread, pinned } : thread)))
  }

  const deleteThread = (threadId: string) => {
    // Don't allow deleting the general thread
    if (threadId === "general") return

    setThreads((prev) => prev.filter((thread) => thread.id !== threadId))

    // If the active thread is being deleted, switch to general
    if (activeThreadId === threadId) {
      setActiveThreadId("general")
    }

    // Remove messages for this thread
    setMessages((prev) => {
      const { [threadId]: _, ...rest } = prev
      return rest
    })
  }

  // Helper function to generate bot responses
  const generateBotResponse = (message: string, botName: string): string => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return `Hello! How can I assist you today?`
    }

    if (lowerMessage.includes("thank")) {
      return `You're welcome! Is there anything else I can help with?`
    }

    if (botName.includes("Task")) {
      if (lowerMessage.includes("task") || lowerMessage.includes("todo")) {
        return `I can help break down this into tasks. Here's a suggested approach:\n\n1. **Research Phase**\n   - Gather requirements\n   - Analyze existing solutions\n\n2. **Implementation Phase**\n   - Set up development environment\n   - Implement core functionality\n   - Add tests\n\n3. **Deployment Phase**\n   - Prepare deployment pipeline\n   - Deploy to staging\n   - Deploy to production`
      }

      return `I've analyzed your request and can help organize this into actionable tasks. Would you like me to create a task breakdown for this?`
    }

    if (botName.includes("Feature")) {
      if (lowerMessage.includes("feature") || lowerMessage.includes("functionality")) {
        return `Based on your project goals, I recommend these key features:\n\n- User authentication and profiles\n- Data visualization dashboard\n- Real-time notifications\n- Search and filtering capabilities\n- Export and reporting tools`
      }

      return `I can help define the features needed for this requirement. Would you like me to suggest some key features?`
    }

    // Default response
    return `I understand you're interested in discussing "${message.substring(0, 30)}${message.length > 30 ? "..." : ""}". Can you provide more details about what you're looking to accomplish?`
  }

  return (
    <ChatContext.Provider
      value={{
        threads,
        activeThreadId,
        messages,
        setActiveThreadId,
        sendMessage,
        createThread,
        markThreadAsRead,
        searchMessages,
        renameThread,
        pinThread,
        deleteThread,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
