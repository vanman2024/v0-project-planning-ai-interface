"use client"

import { useState } from "react"
import { useChat } from "@/contexts/chat-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MessageSquare,
  CheckSquare,
  Layers,
  MessageCircle,
  Plus,
  Search,
  MoreVertical,
  Pin,
  Pencil,
  Trash2,
} from "lucide-react"

export function ThreadSidebar() {
  const { threads, activeThreadId, setActiveThreadId, createThread, renameThread, pinThread, deleteThread } = useChat()

  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newThreadName, setNewThreadName] = useState("")
  const [newThreadDescription, setNewThreadDescription] = useState("")

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [threadToRename, setThreadToRename] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")

  const filteredThreads = threads.filter((thread) => thread.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const pinnedThreads = filteredThreads.filter((thread) => thread.pinned)
  const unpinnedThreads = filteredThreads.filter((thread) => !thread.pinned)

  const handleCreateThread = () => {
    if (!newThreadName.trim()) return

    const threadId = createThread(newThreadName, newThreadDescription)
    setActiveThreadId(threadId)
    setIsCreateDialogOpen(false)
    setNewThreadName("")
    setNewThreadDescription("")
  }

  const handleRenameThread = () => {
    if (!threadToRename || !renameValue.trim()) return

    renameThread(threadToRename, renameValue)
    setIsRenameDialogOpen(false)
    setThreadToRename(null)
    setRenameValue("")
  }

  const openRenameDialog = (threadId: string, currentName: string) => {
    setThreadToRename(threadId)
    setRenameValue(currentName)
    setIsRenameDialogOpen(true)
  }

  const getThreadIcon = (iconName: string) => {
    switch (iconName) {
      case "MessageSquare":
        return <MessageSquare className="h-4 w-4" />
      case "CheckSquare":
        return <CheckSquare className="h-4 w-4" />
      case "Layers":
        return <Layers className="h-4 w-4" />
      default:
        return <MessageCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="w-64 border-r flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold mb-2">Conversations</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search threads"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {pinnedThreads.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-medium text-muted-foreground mb-2 px-2">PINNED</h3>
              <div className="space-y-1">
                {pinnedThreads.map((thread) => (
                  <ThreadItem
                    key={thread.id}
                    thread={thread}
                    isActive={thread.id === activeThreadId}
                    onClick={() => setActiveThreadId(thread.id)}
                    onRename={() => openRenameDialog(thread.id, thread.name)}
                    onPin={() => pinThread(thread.id, false)}
                    onDelete={() => deleteThread(thread.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {unpinnedThreads.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground mb-2 px-2">THREADS</h3>
              <div className="space-y-1">
                {unpinnedThreads.map((thread) => (
                  <ThreadItem
                    key={thread.id}
                    thread={thread}
                    isActive={thread.id === activeThreadId}
                    onClick={() => setActiveThreadId(thread.id)}
                    onRename={() => openRenameDialog(thread.id, thread.name)}
                    onPin={() => pinThread(thread.id, true)}
                    onDelete={() => deleteThread(thread.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <Button variant="outline" className="w-full justify-start" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Thread
        </Button>
      </div>

      {/* Create Thread Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Thread</DialogTitle>
            <DialogDescription>Create a new conversation thread for a specific topic or project.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="thread-name">Thread Name</Label>
              <Input
                id="thread-name"
                placeholder="e.g., Frontend Discussion"
                value={newThreadName}
                onChange={(e) => setNewThreadName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="thread-description">Description (Optional)</Label>
              <Textarea
                id="thread-description"
                placeholder="What will this thread be used for?"
                value={newThreadDescription}
                onChange={(e) => setNewThreadDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateThread}>Create Thread</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Thread Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Thread</DialogTitle>
            <DialogDescription>Give this thread a new name.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rename-thread">Thread Name</Label>
              <Input id="rename-thread" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameThread}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ThreadItemProps {
  thread: {
    id: string
    name: string
    icon?: string
    unreadCount: number
  }
  isActive: boolean
  onClick: () => void
  onRename: () => void
  onPin: () => void
  onDelete: () => void
}

function ThreadItem({ thread, isActive, onClick, onRename, onPin, onDelete }: ThreadItemProps) {
  const getThreadIcon = (iconName?: string) => {
    switch (iconName) {
      case "MessageSquare":
        return <MessageSquare className="h-4 w-4" />
      case "CheckSquare":
        return <CheckSquare className="h-4 w-4" />
      case "Layers":
        return <Layers className="h-4 w-4" />
      default:
        return <MessageCircle className="h-4 w-4" />
    }
  }

  return (
    <div
      className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer group ${
        isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        {getThreadIcon(thread.icon)}
        <span className="truncate">{thread.name}</span>
      </div>

      <div className="flex items-center">
        {thread.unreadCount > 0 && (
          <Badge variant="secondary" className="h-5 min-w-5 flex items-center justify-center rounded-full px-1.5">
            {thread.unreadCount}
          </Badge>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Thread options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onRename()
              }}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onPin()
              }}
            >
              <Pin className="h-4 w-4 mr-2" />
              {thread.id === "general" ? "Cannot Unpin" : thread.id.includes("pinned") ? "Unpin" : "Pin"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              disabled={thread.id === "general"}
              className={thread.id === "general" ? "text-muted-foreground" : "text-destructive"}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {thread.id === "general" ? "Cannot Delete" : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
