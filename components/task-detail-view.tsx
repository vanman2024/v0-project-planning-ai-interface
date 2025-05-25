"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Check, Clock, AlertCircle, Circle, Link, FileText, Plus, Send } from "lucide-react"

interface TaskDetailViewProps {
  isOpen: boolean
  onClose: () => void
  task: {
    id: string
    name: string
    description?: string
    status: "completed" | "in-progress" | "blocked" | "planned"
    type: "pre_build" | "feature" | "post_build"
    linkedRequirements?: string[]
    assignee?: string
    dueDate?: string
    priority?: "high" | "medium" | "low"
    tags?: string[]
    createdAt: string
    updatedAt: string
  }
  onUpdate: (updatedTask: any) => void
}

export function TaskDetailView({ isOpen, onClose, task, onUpdate }: TaskDetailViewProps) {
  const [editedTask, setEditedTask] = useState({ ...task })
  const [activeTab, setActiveTab] = useState("details")
  const [comment, setComment] = useState("")

  // Mock data for demonstration
  const comments = [
    {
      id: "comment-1",
      author: "Jane Smith",
      content: "I've started working on this. Should be done by tomorrow.",
      timestamp: "2023-08-15T14:30:00Z",
    },
    {
      id: "comment-2",
      author: "John Doe",
      content: "Let me know if you need any help with the API integration part.",
      timestamp: "2023-08-15T15:45:00Z",
    },
  ]

  const requirements = [
    {
      id: "req-1",
      title: "User Authentication",
      description: "Users should be able to register, login, and manage their accounts",
    },
    {
      id: "req-2",
      title: "Product Catalog",
      description: "System should display products with filtering and sorting options",
    },
  ]

  const handleSaveChanges = () => {
    onUpdate(editedTask)
    onClose()
  }

  const handleAddComment = () => {
    if (!comment.trim()) return
    // In a real app, this would call an API to add the comment
    console.log("Adding comment:", comment)
    setComment("")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "blocked":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {getStatusIcon(task.status)}
            <DialogTitle className="text-xl">{task.name}</DialogTitle>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant="outline"
              className={`
                ${task.type === "pre_build" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : ""}
                ${task.type === "feature" ? "bg-blue-100 text-blue-800 border-blue-200" : ""}
                ${task.type === "post_build" ? "bg-purple-100 text-purple-800 border-purple-200" : ""}
              `}
            >
              {task.type.replace("_", " ")}
            </Badge>
            {task.priority && (
              <Badge
                className={`
                  ${task.priority === "high" ? "bg-red-100 text-red-800" : ""}
                  ${task.priority === "medium" ? "bg-yellow-100 text-yellow-800" : ""}
                  ${task.priority === "low" ? "bg-green-100 text-green-800" : ""}
                `}
              >
                {task.priority} priority
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1">
              <div className="space-y-4 p-1">
                <div className="space-y-2">
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea
                    id="task-description"
                    value={editedTask.description || ""}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    placeholder="Add a detailed description..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-status">Status</Label>
                    <Select
                      value={editedTask.status}
                      onValueChange={(value) => setEditedTask({ ...editedTask, status: value as any })}
                    >
                      <SelectTrigger id="task-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-priority">Priority</Label>
                    <Select
                      value={editedTask.priority || "medium"}
                      onValueChange={(value) => setEditedTask({ ...editedTask, priority: value as any })}
                    >
                      <SelectTrigger id="task-priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-assignee">Assignee</Label>
                    <Select
                      value={editedTask.assignee || ""}
                      onValueChange={(value) => setEditedTask({ ...editedTask, assignee: value })}
                    >
                      <SelectTrigger id="task-assignee">
                        <SelectValue placeholder="Assign to..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        <SelectItem value="user-1">Jane Smith</SelectItem>
                        <SelectItem value="user-2">John Doe</SelectItem>
                        <SelectItem value="user-3">Alex Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="task-due-date">Due Date</Label>
                    <Input
                      id="task-due-date"
                      type="date"
                      value={editedTask.dueDate || ""}
                      onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Tags</Label>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Plus className="h-4 w-4" />
                      <span>Add Tag</span>
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(editedTask.tags || []).length > 0 ? (
                      (editedTask.tags || []).map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">No tags added yet</div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Avatar className="h-8 w-8">
                        <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          U
                        </div>
                      </Avatar>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">You</span> created this task
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(task.createdAt)} at {formatTime(task.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Avatar className="h-8 w-8">
                        <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          U
                        </div>
                      </Avatar>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">You</span> updated the status to{" "}
                          <span className="font-medium">{task.status}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(task.updatedAt)} at {formatTime(task.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="comments" className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1">
              <div className="space-y-4 p-1">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2 p-3 border rounded-md">
                      <Avatar className="h-8 w-8">
                        <div className="h-full w-full rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {comment.author.charAt(0)}
                        </div>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{comment.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(comment.timestamp)} at {formatTime(comment.timestamp)}
                          </p>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No comments yet</div>
                )}
              </div>
            </ScrollArea>

            <div className="mt-4 border-t pt-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button className="h-[80px]" onClick={handleAddComment} disabled={!comment.trim()}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send comment</span>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requirements" className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1">
              <div className="space-y-4 p-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Linked Requirements</h3>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Link className="h-4 w-4" />
                    <span>Link Requirement</span>
                  </Button>
                </div>

                {requirements.map((req) => (
                  <div key={req.id} className="p-3 border rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">{req.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{req.description}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="border-t pt-4 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
