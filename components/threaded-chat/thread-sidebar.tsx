"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
  Hash,
  Plus,
  Search,
  MoreVertical,
  Pin,
  Pencil,
  Trash2,
  ChevronDown,
  Users,
  Bot,
  FileText,
  Settings,
  Inbox,
} from "lucide-react"

// Mock data for threads
const mockThreads = [
  { id: "general", name: "General", icon: "Hash", unreadCount: 0, pinned: true },
  { id: "project-planning", name: "Project Planning", icon: "Hash", unreadCount: 3, pinned: true },
  { id: "task-agent", name: "Task Agent", icon: "Bot", unreadCount: 0, pinned: false },
  { id: "feature-agent", name: "Feature Agent", icon: "Bot", unreadCount: 2, pinned: false },
  { id: "documentation", name: "Documentation", icon: "FileText", unreadCount: 0, pinned: false },
  { id: "team-chat", name: "Team Chat", icon: "Users", unreadCount: 5, pinned: false },
]

export function ThreadSidebar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newThreadName, setNewThreadName] = useState("")
  const [newThreadDescription, setNewThreadDescription] = useState("")
  const [activeThreadId, setActiveThreadId] = useState("general")

  const filteredThreads = mockThreads.filter((thread) => thread.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const pinnedThreads = filteredThreads.filter((thread) => thread.pinned)
  const unpinnedThreads = filteredThreads.filter((thread) => !thread.pinned)

  const handleCreateThread = () => {
    // In a real implementation, this would create a new thread
    setIsCreateDialogOpen(false)
    setNewThreadName("")
    setNewThreadDescription("")
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-lg">Project Planning AI</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="flex-1 justify-start h-8">
            <Inbox className="h-4 w-4 mr-2" />
            Inbox
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 justify-start h-8">
            <Users className="h-4 w-4 mr-2" />
            People
          </Button>
        </div>
      </div>

      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search threads"
            className="pl-8 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {pinnedThreads.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center px-2 mb-1">
                <ChevronDown className="h-4 w-4 mr-1" />
                <h3 className="text-xs font-medium text-muted-foreground">PINNED</h3>
              </div>
              <div className="space-y-1">
                {pinnedThreads.map((thread) => (
                  <ThreadItem
                    key={thread.id}
                    thread={thread}
                    isActive={thread.id === activeThreadId}
                    onClick={() => setActiveThreadId(thread.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {unpinnedThreads.length > 0 && (
            <div>
              <div className="flex items-center px-2 mb-1">
                <ChevronDown className="h-4 w-4 mr-1" />
                <h3 className="text-xs font-medium text-muted-foreground">THREADS</h3>
              </div>
              <div className="space-y-1">
                {unpinnedThreads.map((thread) => (
                  <ThreadItem
                    key={thread.id}
                    thread={thread}
                    isActive={thread.id === activeThreadId}
                    onClick={() => setActiveThreadId(thread.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t mt-auto">
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
    </div>
  )
}

interface ThreadItemProps {
  thread: {
    id: string
    name: string
    icon: string
    unreadCount: number
  }
  isActive: boolean
  onClick: () => void
}

function ThreadItem({ thread, isActive, onClick }: ThreadItemProps) {
  const getThreadIcon = (iconName: string) => {
    switch (iconName) {
      case "Hash":
        return <Hash className="h-4 w-4" />
      case "Bot":
        return <Bot className="h-4 w-4" />
      case "Users":
        return <Users className="h-4 w-4" />
      case "FileText":
        return <FileText className="h-4 w-4" />
      default:
        return <Hash className="h-4 w-4" />
    }
  }

  return (
    <button
      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer group text-left ${
        isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
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
            <DropdownMenuItem>
              <Pencil className="h-4 w-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pin className="h-4 w-4 mr-2" />
              {thread.id === "general" ? "Cannot Unpin" : thread.id.includes("pinned") ? "Unpin" : "Pin"}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={thread.id === "general"}
              className={thread.id === "general" ? "text-muted-foreground" : "text-destructive"}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {thread.id === "general" ? "Cannot Delete" : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </button>
  )
}
