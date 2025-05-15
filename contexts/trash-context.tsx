"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { TrashItem } from "@/components/trash-manager"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface TrashContextType {
  trashItems: TrashItem[]
  addToTrash: (item: Omit<TrashItem, "deletedAt">) => void
  restoreItems: (items: TrashItem[]) => void
  permanentlyDeleteItems: (items: TrashItem[]) => void
  emptyTrash: () => void
  openTrashManager: () => void
  closeTrashManager: () => void
  isTrashManagerOpen: boolean
}

const TrashContext = createContext<TrashContextType | undefined>(undefined)

export function TrashProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [trashItems, setTrashItems] = useState<TrashItem[]>([])
  const [isTrashManagerOpen, setIsTrashManagerOpen] = useState(false)
  const [deletionHistory, setDeletionHistory] = useState<
    Array<{ action: "deleted" | "restored" | "permanently_deleted"; items: TrashItem[]; timestamp: string }>
  >([])

  // Load trash items from localStorage on mount
  useEffect(() => {
    const storedTrash = localStorage.getItem("trash-items")
    if (storedTrash) {
      try {
        setTrashItems(JSON.parse(storedTrash))
      } catch (error) {
        console.error("Failed to parse trash items from localStorage:", error)
      }
    }

    const storedHistory = localStorage.getItem("deletion-history")
    if (storedHistory) {
      try {
        setDeletionHistory(JSON.parse(storedHistory))
      } catch (error) {
        console.error("Failed to parse deletion history from localStorage:", error)
      }
    }

    // Set up automatic cleanup
    const cleanupInterval = setInterval(cleanupOldItems, 24 * 60 * 60 * 1000) // Check once a day
    return () => clearInterval(cleanupInterval)
  }, [])

  // Save trash items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("trash-items", JSON.stringify(trashItems))
  }, [trashItems])

  // Save deletion history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("deletion-history", JSON.stringify(deletionHistory))
  }, [deletionHistory])

  const addToTrash = (item: Omit<TrashItem, "deletedAt">) => {
    const trashItem: TrashItem = {
      ...item,
      deletedAt: new Date().toISOString(),
    }

    setTrashItems((prev) => [...prev, trashItem])

    // Add to deletion history
    setDeletionHistory((prev) => [
      ...prev,
      {
        action: "deleted",
        items: [trashItem],
        timestamp: new Date().toISOString(),
      },
    ])

    // Show toast with undo option
    toast({
      title: `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} deleted`,
      description: `"${item.title}" has been moved to trash.`,
      action: (
        <ToastAction altText="Undo" onClick={() => restoreItems([trashItem])}>
          Undo
        </ToastAction>
      ),
    })
  }

  const restoreItems = (items: TrashItem[]) => {
    // Remove from trash
    setTrashItems((prev) => prev.filter((item) => !items.some((i) => i.id === item.id)))

    // Add to deletion history
    setDeletionHistory((prev) => [
      ...prev,
      {
        action: "restored",
        items,
        timestamp: new Date().toISOString(),
      },
    ])

    // If only one item, show toast
    if (items.length === 1) {
      toast({
        title: `${items[0].type.charAt(0).toUpperCase() + items[0].type.slice(1)} restored`,
        description: `"${items[0].title}" has been restored.`,
      })
    }
  }

  const permanentlyDeleteItems = (items: TrashItem[]) => {
    // Remove from trash
    setTrashItems((prev) => prev.filter((item) => !items.some((i) => i.id === item.id)))

    // Add to deletion history
    setDeletionHistory((prev) => [
      ...prev,
      {
        action: "permanently_deleted",
        items,
        timestamp: new Date().toISOString(),
      },
    ])
  }

  const emptyTrash = () => {
    // Add all current trash items to deletion history
    if (trashItems.length > 0) {
      setDeletionHistory((prev) => [
        ...prev,
        {
          action: "permanently_deleted",
          items: trashItems,
          timestamp: new Date().toISOString(),
        },
      ])
    }

    // Clear trash
    setTrashItems([])
  }

  const cleanupOldItems = () => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const itemsToDelete = trashItems.filter((item) => {
      const deletedAt = new Date(item.deletedAt)
      return deletedAt < thirtyDaysAgo
    })

    if (itemsToDelete.length > 0) {
      // Add to deletion history
      setDeletionHistory((prev) => [
        ...prev,
        {
          action: "permanently_deleted",
          items: itemsToDelete,
          timestamp: new Date().toISOString(),
        },
      ])

      // Remove old items
      setTrashItems((prev) =>
        prev.filter((item) => {
          const deletedAt = new Date(item.deletedAt)
          return deletedAt >= thirtyDaysAgo
        }),
      )

      console.log(`Auto-cleanup: Removed ${itemsToDelete.length} items older than 30 days`)
    }
  }

  const openTrashManager = () => {
    setIsTrashManagerOpen(true)
  }

  const closeTrashManager = () => {
    setIsTrashManagerOpen(false)
  }

  return (
    <TrashContext.Provider
      value={{
        trashItems,
        addToTrash,
        restoreItems,
        permanentlyDeleteItems,
        emptyTrash,
        openTrashManager,
        closeTrashManager,
        isTrashManagerOpen,
      }}
    >
      {children}
    </TrashContext.Provider>
  )
}

export function useTrash() {
  const context = useContext(TrashContext)
  if (context === undefined) {
    throw new Error("useTrash must be used within a TrashProvider")
  }
  return context
}
