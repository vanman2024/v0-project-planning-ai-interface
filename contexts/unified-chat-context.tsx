"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

// Define types for our chat system
export interface ChatMessage {
  id: string
  threadId: string
  projectId: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
    isBot?: boolean
    agentType?: string
  }
  timestamp: Date
  read: boolean
}

export interface ChatThread {
  id: string
  name: string
  description?: string
  icon?: string
  projectId: string
  agentType?: string
  unreadCount: number
  lastActivity?: Date
  participants: {
    id: string
    name: string
    avatar?: string
    isBot?: boolean
    agentType?: string
  }[]
  pinned?: boolean
}

export type AgentType = "main" | "task" | "feature" | "documentation" | "detail" | "planner"

interface UnifiedChatContextProps {
  threads: ChatThread[]
  activeThreadId: string | null
  activeProjectId: string | null
  messages: Record<string, ChatMessage[]>
  setActiveThreadId: (id: string) => void
  setActiveProjectId: (id: string) => void
  sendMessage: (threadId: string, content: string) => void
  createThread: (
    name: string,
    projectId: string,
    options?: {
      description?: string
      agentType?: AgentType
      icon?: string
    },
  ) => string
  markThreadAsRead: (threadId: string) => void
  searchMessages: (query: string, options?: { threadId?: string; projectId?: string }) => ChatMessage[]
  renameThread: (threadId: string, newName: string) => void
  pinThread: (threadId: string, pinned: boolean) => void
  deleteThread: (threadId: string) => void
  getThreadsByProject: (projectId: string) => ChatThread[]
  getThreadsByAgent: (agentType: AgentType, projectId?: string) => ChatThread[]
  getProjectThreads: () => ChatThread[]
  switchToAgentThread: (agentType: AgentType) => string
}

const UnifiedChatContext = createContext<UnifiedChatContextProps | undefined>(undefined)

// Mock user data
const currentUser = {
  id: "user-1",
  name: "You",
  avatar: "/abstract-self-reflection.png",
}

const botUsers = [
  {
    id: "bot-main",
    name: "Project Assistant",
    avatar: "/abstract-geometric-sa.png",
    isBot: true,
    agentType: "main",
  },
  {
    id: "bot-task",
    name: "Task Agent",
    avatar: "/abstract-geometric-da.png",
    isBot: true,
    agentType: "task",
  },
  {
    id: "bot-feature",
    name: "Feature Agent",
    avatar: "/placeholder-e6kjs.png",
    isBot: true,
    agentType: "feature",
  },
  {
    id: "bot-documentation",
    name: "Documentation Agent",
    avatar: "/placeholder.svg",
    isBot: true,
    agentType: "documentation",
  },
  {
    id: "bot-detail",
    name: "Detail Agent",
    avatar: "/placeholder.svg",
    isBot: true,
    agentType: "detail",
  },
  {
    id: "bot-planner",
    name: "Planning Agent",
    avatar: "/placeholder.svg",
    isBot: true,
    agentType: "planner",
  },
]

export function UnifiedChatProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: "project-1-main",
      name: "Project Alpha - Main",
      description: "Main discussion for Project Alpha",
      icon: "MessageSquare",
      projectId: "project-1",
      agentType: "main",
      unreadCount: 1,
      lastActivity: new Date(Date.now() - 1000 * 60 * 15),
      participants: [currentUser, botUsers[0]],
      pinned: true,
    },
    {
      id: "project-1-tasks",
      name: "Project Alpha - Tasks",
      description: "Task planning for Project Alpha",
      icon: "CheckSquare",
      projectId: "project-1",
      agentType: "task",
      unreadCount: 0,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 5),
      participants: [currentUser, botUsers[1]],
    },
    {
      id: "project-1-features",
      name: "Project Alpha - Features",
      description: "Feature planning for Project Alpha",
      icon: "Layers",
      projectId: "project-1",
      agentType: "feature",
      unreadCount: 0,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 8),
      participants: [currentUser, botUsers[2]],
    },
    {
      id: "project-1-docs",
      name: "Project Alpha - Documentation",
      description: "Documentation for Project Alpha",
      icon: "FileText",
      projectId: "project-1",
      agentType: "documentation",
      unreadCount: 0,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 12),
      participants: [currentUser, botUsers[3]],
    },
    {
      id: "project-2-main",
      name: "Project Beta - Main",
      description: "Main discussion for Project Beta",
      icon: "MessageSquare",
      projectId: "project-2",
      agentType: "main",
      unreadCount: 2,
      lastActivity: new Date(Date.now() - 1000 * 60 * 30),
      participants: [currentUser, botUsers[0]],
      pinned: true,
    },
    {
      id: "project-2-tasks",
      name: "Project Beta - Tasks",
      description: "Task planning for Project Beta",
      icon: "CheckSquare",
      projectId: "project-2",
      agentType: "task",
      unreadCount: 0,
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 3),
      participants: [currentUser, botUsers[1]],
    },
  ])

  const [activeThreadId, setActiveThreadId] = useState<string | null>("project-1-main")
  const [activeProjectId, setActiveProjectId] = useState<string | null>("project-1")

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    "project-1-main": [
      {
        id: "p1-msg-1",
        threadId: "project-1-main",
        projectId: "project-1",
        content: "Welcome to Project Alpha! I'm your project assistant. How can I help you today?",
        sender: botUsers[0],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: true,
      },
      {
        id: "p1-msg-2",
        threadId: "project-1-main",
        projectId: "project-1",
        content: "I need help defining the project scope.",
        sender: currentUser,
        timestamp: new Date(Date.now() - 1000 * 60 * 16),
        read: true,
      },
      {
        id: "p1-msg-3",
        threadId: "project-1-main",
        projectId: "project-1",
        content:
          "I'd be happy to help with that! Let's start by identifying the key objectives and deliverables for Project Alpha.",
        sender: botUsers[0],
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        read: false,
      },
    ],
    "project-1-tasks": [
      {
        id: "p1-task-msg-1",
        threadId: "project-1-tasks",
        projectId: "project-1",
        content: "I'll help you organize tasks for Project Alpha. What's the first milestone you want to achieve?",
        sender: botUsers[1],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        read: true,
      },
    ],
    "project-1-features": [
      {
        id: "p1-feature-msg-1",
        threadId: "project-1-features",
        projectId: "project-1",
        content:
          "Let's discuss the key features for Project Alpha. What are the main capabilities you want to include?",
        sender: botUsers[2],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
        read: true,
      },
    ],
    "project-1-docs": [
      {
        id: "p1-docs-msg-1",
        threadId: "project-1-docs",
        projectId: "project-1",
        content: "I can help you create documentation for Project Alpha. What type of documentation do you need?",
        sender: botUsers[3],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
        read: true,
      },
    ],
    "project-2-main": [
      {
        id: "p2-msg-1",
        threadId: "project-2-main",
        projectId: "project-2",
        content: "Welcome to Project Beta! I'm your project assistant. How can I help you today?",
        sender: botUsers[0],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        read: true,
      },
      {
        id: "p2-msg-2",
        threadId: "project-2-main",
        projectId: "project-2",
        content: "I need to plan the development timeline.",
        sender: currentUser,
        timestamp: new Date(Date.now() - 1000 * 60 * 31),
        read: true,
      },
      {
        id: "p2-msg-3",
        threadId: "project-2-main",
        projectId: "project-2",
        content: "I can help with that! Let's break down the project into phases and estimate the time for each.",
        sender: botUsers[0],
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
      },
    ],
    "project-2-tasks": [
      {
        id: "p2-task-msg-1",
        threadId: "project-2-tasks",
        projectId: "project-2",
        content: "I'll help you organize tasks for Project Beta. What's the first milestone you want to achieve?",
        sender: botUsers[1],
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

  // When active project changes, set the active thread to the main thread of that project
  useEffect(() => {
    if (activeProjectId) {
      const projectThreads = getThreadsByProject(activeProjectId)
      if (projectThreads.length > 0) {
        // Find the main thread for this project
        const mainThread = projectThreads.find((thread) => thread.agentType === "main")
        if (mainThread) {
          setActiveThreadId(mainThread.id)
        } else {
          // If no main thread, use the first thread
          setActiveThreadId(projectThreads[0].id)
        }
      } else {
        // If no threads exist for this project, create a main thread
        const threadId = createThread(`${activeProjectId} - Main`, activeProjectId, {
          description: `Main discussion for ${activeProjectId}`,
          agentType: "main",
          icon: "MessageSquare",
        })
        setActiveThreadId(threadId)
      }
    }
  }, [activeProjectId])

  const sendMessage = (threadId: string, content: string) => {
    if (!content.trim() || !threadId) return

    const thread = threads.find((t) => t.id === threadId)
    if (!thread) return

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      threadId,
      projectId: thread.projectId,
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
      const botUser = thread.participants.find((p) => p.isBot) || botUsers[0]

      const botResponse: ChatMessage = {
        id: `msg-${Date.now()}`,
        threadId,
        projectId: thread.projectId,
        content: generateBotResponse(content, botUser.name, thread.agentType || "main", thread.projectId),
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

  const createThread = (
    name: string,
    projectId: string,
    options: {
      description?: string
      agentType?: AgentType
      icon?: string
    } = {},
  ) => {
    const { description, agentType, icon } = options
    const newThreadId = `thread-${Date.now()}`

    // Find the appropriate bot based on agent type
    const botUser = agentType ? botUsers.find((bot) => bot.agentType === agentType) || botUsers[0] : botUsers[0]

    const newThread: ChatThread = {
      id: newThreadId,
      name,
      description,
      projectId,
      agentType,
      icon: icon || "MessageCircle",
      unreadCount: 0,
      lastActivity: new Date(),
      participants: [currentUser, botUser],
    }

    setThreads((prev) => [...prev, newThread])

    // Add initial bot message
    const initialMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      threadId: newThreadId,
      projectId,
      content: `Welcome to the ${name} thread! I'm here to help with your project. How can I assist you with ${description || "this topic"}?`,
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

  const searchMessages = (query: string, options: { threadId?: string; projectId?: string } = {}) => {
    if (!query.trim()) return []

    const { threadId, projectId } = options
    const lowerQuery = query.toLowerCase()
    let results: ChatMessage[] = []

    if (threadId) {
      // Search in specific thread
      const threadMessages = messages[threadId] || []
      results = threadMessages.filter((msg) => msg.content.toLowerCase().includes(lowerQuery))
    } else if (projectId) {
      // Search in all threads for a specific project
      Object.values(messages).forEach((threadMessages) => {
        results = [
          ...results,
          ...threadMessages.filter(
            (msg) => msg.projectId === projectId && msg.content.toLowerCase().includes(lowerQuery),
          ),
        ]
      })
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
    const thread = threads.find((t) => t.id === threadId)
    if (!thread) return

    // Don't allow deleting the main thread of a project
    if (thread.agentType === "main") return

    setThreads((prev) => prev.filter((thread) => thread.id !== threadId))

    // If the active thread is being deleted, switch to the main thread of the project
    if (activeThreadId === threadId) {
      const projectThreads = getThreadsByProject(thread.projectId)
      const mainThread = projectThreads.find((t) => t.agentType === "main")
      if (mainThread) {
        setActiveThreadId(mainThread.id)
      }
    }

    // Remove messages for this thread
    setMessages((prev) => {
      const { [threadId]: _, ...rest } = prev
      return rest
    })
  }

  const getThreadsByProject = (projectId: string) => {
    return threads.filter((thread) => thread.projectId === projectId)
  }

  const getThreadsByAgent = (agentType: AgentType, projectId?: string) => {
    return threads.filter(
      (thread) => thread.agentType === agentType && (projectId ? thread.projectId === projectId : true),
    )
  }

  const getProjectThreads = () => {
    if (!activeProjectId) return []
    return threads.filter((thread) => thread.projectId === activeProjectId)
  }

  // Switch to a specific agent thread for the current project, creating one if it doesn't exist
  const switchToAgentThread = (agentType: AgentType) => {
    if (!activeProjectId) return ""

    // Find existing thread for this agent type in the current project
    const existingThread = threads.find(
      (thread) => thread.projectId === activeProjectId && thread.agentType === agentType,
    )

    if (existingThread) {
      setActiveThreadId(existingThread.id)
      return existingThread.id
    }

    // Create a new thread for this agent type
    const agentInfo = botUsers.find((bot) => bot.agentType === agentType)
    const threadName = `${activeProjectId} - ${agentInfo?.name || agentType}`

    const newThreadId = createThread(threadName, activeProjectId, {
      agentType,
      description: `${agentInfo?.name || agentType} for ${activeProjectId}`,
    })

    setActiveThreadId(newThreadId)
    return newThreadId
  }

  // Helper function to generate bot responses
  const generateBotResponse = (message: string, botName: string, agentType: string, projectId: string): string => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return `Hello! How can I assist you with ${projectId} today?`
    }

    if (lowerMessage.includes("thank")) {
      return `You're welcome! Is there anything else I can help with for ${projectId}?`
    }

    switch (agentType) {
      case "task":
        if (lowerMessage.includes("task") || lowerMessage.includes("todo")) {
          return `I can help break down ${projectId} into tasks. Here's a suggested approach:\n\n1. **Research Phase**\n   - Gather requirements\n   - Analyze existing solutions\n\n2. **Implementation Phase**\n   - Set up development environment\n   - Implement core functionality\n   - Add tests\n\n3. **Deployment Phase**\n   - Prepare deployment pipeline\n   - Deploy to staging\n   - Deploy to production`
        }
        return `I've analyzed your request for ${projectId} and can help organize this into actionable tasks. Would you like me to create a task breakdown for this?`

      case "feature":
        if (lowerMessage.includes("feature") || lowerMessage.includes("functionality")) {
          return `Based on ${projectId}'s goals, I recommend these key features:\n\n- User authentication and profiles\n- Data visualization dashboard\n- Real-time notifications\n- Search and filtering capabilities\n- Export and reporting tools`
        }
        return `I can help define the features needed for ${projectId}. Would you like me to suggest some key features?`

      case "documentation":
        return `For ${projectId}'s documentation, I recommend structuring it with these sections:\n\n1. **Overview**\n2. **Getting Started**\n3. **API Reference**\n4. **Examples**\n5. **Troubleshooting**\n\nWhich section would you like to work on first?`

      case "detail":
        return `To gather more details about ${projectId}, I'd need to know about your target audience, business goals, key requirements, and any specific constraints. Which of these would you like to define first?`

      case "planner":
        return `For ${projectId}, I recommend a 2-3 month timeline with these key milestones:\n\n1. **Discovery & Planning** (2 weeks)\n2. **Design** (2-3 weeks)\n3. **Development** (6-8 weeks)\n4. **Testing** (2 weeks)\n5. **Deployment** (1 week)\n\nWould you like me to create a detailed project schedule?`

      default: // main agent
        return `I understand you're interested in discussing "${message.substring(0, 30)}${message.length > 30 ? "..." : ""}" for ${projectId}. Can you provide more details about what you're looking to accomplish?`
    }
  }

  return (
    <UnifiedChatContext.Provider
      value={{
        threads,
        activeThreadId,
        activeProjectId,
        messages,
        setActiveThreadId,
        setActiveProjectId,
        sendMessage,
        createThread,
        markThreadAsRead,
        searchMessages,
        renameThread,
        pinThread,
        deleteThread,
        getThreadsByProject,
        getThreadsByAgent,
        getProjectThreads,
        switchToAgentThread,
      }}
    >
      {children}
    </UnifiedChatContext.Provider>
  )
}

export const useUnifiedChat = () => {
  const context = useContext(UnifiedChatContext)
  if (context === undefined) {
    throw new Error("useUnifiedChat must be used within a UnifiedChatProvider")
  }
  return context
}
