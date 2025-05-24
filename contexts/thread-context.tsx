"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useProject } from "./project-context"

// Define types for our thread data
interface ThreadMetadata {
  id: string
  name: string
  agentType: "project" | "task" | "feature" | "documentation" | "detail" | "planning"
  createdAt: string
  updatedAt: string
  isPinned: boolean
}

interface ThreadContext {
  topic: string
  relatedFeatureIds: string[]
  relatedTaskIds: string[]
  currentFocus: string
  projectStage: string
}

interface Thread {
  metadata: ThreadMetadata
  context: ThreadContext
  messages: any[] // We'll use the message type from chat-context
}

interface ThreadContextType {
  threads: Thread[]
  currentThreadId: string | null
  setCurrentThreadId: (id: string | null) => void
  createThread: (name: string, agentType: ThreadMetadata["agentType"]) => string
  updateThreadMetadata: (id: string, metadata: Partial<ThreadMetadata>) => void
  updateThreadContext: (id: string, context: Partial<ThreadContext>) => void
  deleteThread: (id: string) => void
  pinThread: (id: string) => void
  unpinThread: (id: string) => void
  getCurrentThread: () => Thread | null
}

// Create the context
const ThreadContext = createContext<ThreadContextType | undefined>(undefined)

// Create the provider component
export function ThreadProvider({ children }: { children: React.ReactNode }) {
  const { currentProject } = useProject()
  const [threads, setThreads] = useState<Thread[]>([])
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null)

  // Load threads from localStorage on mount
  useEffect(() => {
    const storedThreads = localStorage.getItem("threads")
    if (storedThreads) {
      try {
        setThreads(JSON.parse(storedThreads))
      } catch (error) {
        console.error("Failed to parse threads from localStorage:", error)
      }
    } else {
      // Create a default thread if none exist
      const defaultThread = createDefaultThread()
      setThreads([defaultThread])
      setCurrentThreadId(defaultThread.metadata.id)
    }
  }, [])

  // Save threads to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("threads", JSON.stringify(threads))
  }, [threads])

  // Create a default thread
  const createDefaultThread = (): Thread => {
    const id = `thread-${Date.now()}`
    return {
      metadata: {
        id,
        name: "Project Assistant",
        agentType: "project",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: false,
      },
      context: {
        topic: "Project Overview",
        relatedFeatureIds: [],
        relatedTaskIds: [],
        currentFocus: "project setup",
        projectStage: currentProject?.metadata.stage || "planning",
      },
      messages: [],
    }
  }

  // Create a new thread
  const createThread = (name: string, agentType: ThreadMetadata["agentType"]): string => {
    const id = `thread-${Date.now()}`
    const newThread: Thread = {
      metadata: {
        id,
        name,
        agentType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: false,
      },
      context: {
        topic: name,
        relatedFeatureIds: [],
        relatedTaskIds: [],
        currentFocus: "initial discussion",
        projectStage: currentProject?.metadata.stage || "planning",
      },
      messages: [],
    }

    setThreads((prev) => [...prev, newThread])
    setCurrentThreadId(id)
    return id
  }

  // Update thread metadata
  const updateThreadMetadata = (id: string, metadata: Partial<ThreadMetadata>) => {
    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.metadata.id === id) {
          return {
            ...thread,
            metadata: {
              ...thread.metadata,
              ...metadata,
              updatedAt: new Date().toISOString(),
            },
          }
        }
        return thread
      }),
    )
  }

  // Update thread context
  const updateThreadContext = (id: string, context: Partial<ThreadContext>) => {
    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.metadata.id === id) {
          return {
            ...thread,
            context: {
              ...thread.context,
              ...context,
            },
            metadata: {
              ...thread.metadata,
              updatedAt: new Date().toISOString(),
            },
          }
        }
        return thread
      }),
    )
  }

  // Delete a thread
  const deleteThread = (id: string) => {
    setThreads((prev) => prev.filter((thread) => thread.metadata.id !== id))
    if (currentThreadId === id) {
      const remainingThreads = threads.filter((thread) => thread.metadata.id !== id)
      setCurrentThreadId(remainingThreads.length > 0 ? remainingThreads[0].metadata.id : null)
    }
  }

  // Pin a thread
  const pinThread = (id: string) => {
    updateThreadMetadata(id, { isPinned: true })
  }

  // Unpin a thread
  const unpinThread = (id: string) => {
    updateThreadMetadata(id, { isPinned: false })
  }

  // Get the current thread
  const getCurrentThread = (): Thread | null => {
    if (!currentThreadId) return null
    return threads.find((thread) => thread.metadata.id === currentThreadId) || null
  }

  return (
    <ThreadContext.Provider
      value={{
        threads,
        currentThreadId,
        setCurrentThreadId,
        createThread,
        updateThreadMetadata,
        updateThreadContext,
        deleteThread,
        pinThread,
        unpinThread,
        getCurrentThread,
      }}
    >
      {children}
    </ThreadContext.Provider>
  )
}

// Create a hook to use the context
export function useThread() {
  const context = useContext(ThreadContext)
  if (context === undefined) {
    throw new Error("useThread must be used within a ThreadProvider")
  }
  return context
}
