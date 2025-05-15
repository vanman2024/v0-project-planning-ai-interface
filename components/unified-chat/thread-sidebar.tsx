"use client"

import { useState } from "react"
import { useUnifiedChat, type AgentType } from "@/contexts/unified-chat-context"
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
  MessageCircle,
  Plus,
  Search,
  MoreVertical,
  Pin,
  Pencil,
  Trash2,
  CheckSquare,
  Layers,
  FileText,
  Info,
  Calendar,
  MessageSquare,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AgentSelector } from "@/components/agent-selector"

interface ThreadSidebarProps {
  compact?: boolean
  showProjectSelector?: boolean
}

export function ThreadSidebar({ compact = false, showProjectSelector = false }: ThreadSidebarProps) {
  const {
    threads,
    activeThreadId,
    activeProjectId,
    setActiveThreadId,
    setActiveProjectId,
    createThread,
    renameThread,
    pinThread,
    deleteThread,
    getProjectThreads,
    switchToAgentThread,
    activeAgentType,
  } = useUnifiedChat()

  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newThreadName, setNewThreadName] = useState("")
  const [newThreadDescription, setNewThreadDescription] = useState("")
  const [newThreadAgentType, setNewThreadAgentType] = useState<AgentType>("main")

  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [threadToRename, setThreadToRename] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")

  // Get all unique project IDs (only needed for project selector)
  const projectIds = showProjectSelector ? Array.from(new Set(threads.map((thread) => thread.projectId))) : []

  // Get threads for the current project
  const projectThreads = getProjectThreads()

  // Filter threads based on search query
  const filteredThreads = projectThreads.filter((thread) =>
    thread.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const pinnedThreads = filteredThreads.filter((thread) => thread.pinned)
  const unpinnedThreads = filteredThreads.filter((thread) => !thread.pinned)

  const handleCreateThread = () => {
    if (!newThreadName.trim() || !activeProjectId) return

    const threadId = createThread(newThreadName, activeProjectId, {
      description: newThreadDescription,
      agentType: newThreadAgentType,
    })

    setActiveThreadId(threadId)
    setIsCreateDialogOpen(false)
    setNewThreadName("")
    setNewThreadDescription("")
    setNewThreadAgentType("main")
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

  const handleSwitchProject = (projectId: string) => {
    setActiveProjectId(projectId)
  }

  const handleSwitchAgent = (agentType: AgentType) => {
    switchToAgentThread(agentType)
  }

  return (
    <div className={`${compact ? "w-48" : "w-64"} border-r flex flex-col h-full`}>
      <div className="p-3 border-b">
        {showProjectSelector && (
          <Select value={activeProjectId || undefined} onValueChange={handleSwitchProject}>
            <SelectTrigger className="w-full mb-2">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {projectIds.map((projectId) => (
                <SelectItem key={projectId} value={projectId}>
                  {projectId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search threads"
            className="pl-8 h-8 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="p-3">
        <AgentSelector onSelectAgent={handleSwitchAgent} activeAgent={activeAgentType} compact={compact} />
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
                    compact={compact}
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
                    compact={compact}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <Button
          variant="outline"
          className="w-full justify-start text-xs h-8"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="h-3.5 w-3.5 mr-2" />
          New Thread
        </Button>
      </div>

      {/* Create Thread Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Thread</DialogTitle>
            <DialogDescription>Create a new conversation thread for a specific topic or agent.</DialogDescription>
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
            <div className="grid gap-2">
              <Label htmlFor="thread-agent">Agent Type</Label>
              <select
                id="thread-agent"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newThreadAgentType}
                onChange={(e) => setNewThreadAgentType(e.target.value as AgentType)}
              >
                <option value="main">Main Assistant</option>
                <option value="task">Task Agent</option>
                <option value="feature">Feature Agent</option>
                <option value="documentation">Documentation Agent</option>
                <option value="detail">Detail Agent</option>
                <option value="planner">Planning Agent</option>
              </select>
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
    agentType?: string
    unreadCount: number
  }
  isActive: boolean
  onClick: () => void
  onRename: () => void
  onPin: () => void
  onDelete: () => void
  compact?: boolean
}

function ThreadItem({ thread, isActive, onClick, onRename, onPin, onDelete, compact = false }: ThreadItemProps) {
  const getThreadIcon = (iconName?: string, agentType?: string) => {
    if (agentType) {
      switch (agentType) {
        case "task":
          return <CheckSquare className="h-4 w-4" />
        case "feature":
          return <Layers className="h-4 w-4" />
        case "documentation":
          return <FileText className="h-4 w-4" />
        case "detail":
          return <Info className="h-4 w-4" />
        case "planner":
          return <Calendar className="h-4 w-4" />
        default:
          return <MessageSquare className="h-4 w-4" />
      }
    }

    switch (iconName) {
      case "MessageSquare":
        return <MessageSquare className="h-4 w-4" />
      case "CheckSquare":
        return <CheckSquare className="h-4 w-4" />
      case "Layers":
        return <Layers className="h-4 w-4" />
      case "FileText":
        return <FileText className="h-4 w-4" />
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
        {getThreadIcon(thread.icon, thread.agentType)}
        <span className={`truncate ${compact ? "text-xs" : "text-sm"}`}>{thread.name}</span>
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
              {thread.agentType === "main" ? "Cannot Unpin" : thread.id.includes("pinned") ? "Unpin" : "Pin"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              disabled={thread.agentType === "main"}
              className={thread.agentType === "main" ? "text-muted-foreground" : "text-destructive"}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {thread.agentType === "main" ? "Cannot Delete" : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
