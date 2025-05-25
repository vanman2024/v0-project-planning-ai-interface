"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  Flag,
  GitBranch,
  GitMerge,
  GitPullRequest,
  Link,
  MessageSquare,
  MoreHorizontal,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowDown,
  Edit,
  Trash2,
  Check,
  Circle,
  ClockIcon,
  ArrowUp,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Types for plan items
export interface PlanItemDetail {
  id: string
  name: string
  description: string
  status: "completed" | "in-progress" | "planned" | "blocked"
  type: "milestone" | "phase" | "module" | "feature" | "task"
  priority: "high" | "medium" | "low"
  assignees?: string[]
  dueDate?: string
  startDate?: string
  estimatedHours?: number
  actualHours?: number
  tags?: string[]
  dependencies?: string[]
  children?: string[]
  parentId?: string
  taskType?: "pre_build" | "feature" | "post_build"
  requirements?: string[]
  comments?: Comment[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

interface Comment {
  id: string
  author: string
  authorAvatar?: string
  content: string
  timestamp: string
  reactions?: { [key: string]: number }
}

interface UserType {
  id: string
  name: string
  avatar?: string
  role: string
}

interface Requirement {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  status: "approved" | "pending" | "rejected"
}

// Mock data for users
const users: UserType[] = [
  {
    id: "user1",
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40&query=AJ",
    role: "Project Manager",
  },
  { id: "user2", name: "Sam Taylor", avatar: "/placeholder.svg?height=40&width=40&query=ST", role: "Developer" },
  { id: "user3", name: "Jamie Smith", avatar: "/placeholder.svg?height=40&width=40&query=JS", role: "Designer" },
  { id: "user4", name: "Morgan Lee", avatar: "/placeholder.svg?height=40&width=40&query=ML", role: "QA Engineer" },
]

// Mock data for requirements
const requirements: Requirement[] = [
  {
    id: "req1",
    title: "User Authentication",
    description: "System must support secure user authentication with email/password and social login options.",
    priority: "high",
    status: "approved",
  },
  {
    id: "req2",
    title: "Data Encryption",
    description: "All sensitive user data must be encrypted both in transit and at rest.",
    priority: "high",
    status: "approved",
  },
  {
    id: "req3",
    title: "Mobile Responsiveness",
    description: "All UI components must be fully responsive and work on mobile devices.",
    priority: "medium",
    status: "approved",
  },
  {
    id: "req4",
    title: "Performance Metrics",
    description: "System must load within 3 seconds on standard connections.",
    priority: "medium",
    status: "pending",
  },
]

// Helper function to get user by ID
const getUserById = (id: string): UserType => {
  return users.find((user) => user.id === id) || { id: "", name: "Unknown User", role: "Unknown" }
}

// Helper function to get requirement by ID
const getRequirementById = (id: string): Requirement => {
  return (
    requirements.find((req) => req.id === id) || {
      id: "",
      title: "Unknown Requirement",
      description: "",
      priority: "medium",
      status: "pending",
    }
  )
}

// Helper function to get plan item by ID
const getPlanItemById = (id: string, allItems: PlanItemDetail[]): PlanItemDetail | undefined => {
  return allItems.find((item) => item.id === id)
}

// Helper function to format date
const formatDate = (dateString?: string): string => {
  if (!dateString) return "Not set"
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Helper function to get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case "in-progress":
      return <ClockIcon className="h-4 w-4 text-blue-500" />
    case "blocked":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Circle className="h-4 w-4 text-gray-400" />
  }
}

// Helper function to get priority badge
const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          High
        </Badge>
      )
    case "medium":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          Medium
        </Badge>
      )
    case "low":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          Low
        </Badge>
      )
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

export function PlanDetailView({
  isOpen,
  onClose,
  planItem,
  allItems,
}: {
  isOpen: boolean
  onClose: () => void
  planItem: PlanItemDetail | null
  allItems: PlanItemDetail[]
}) {
  const [activeTab, setActiveTab] = useState("details")
  const [isEditing, setIsEditing] = useState(false)
  const [editedItem, setEditedItem] = useState<PlanItemDetail | null>(null)

  useEffect(() => {
    if (planItem) {
      setEditedItem({ ...planItem })
    }
  }, [planItem])

  if (!planItem || !editedItem) return null

  // Get direct children
  const children = allItems.filter((item) => item.parentId === planItem.id)

  // Get dependencies
  const dependencies = planItem.dependencies?.map((depId) => getPlanItemById(depId, allItems)) || []

  // Get dependent items (items that depend on this one)
  const dependentItems = allItems.filter((item) => item.dependencies?.includes(planItem.id))

  // Get parent item
  const parentItem = planItem.parentId ? getPlanItemById(planItem.parentId, allItems) : undefined

  // Get siblings (items with the same parent)
  const siblings = planItem.parentId
    ? allItems.filter((item) => item.parentId === planItem.parentId && item.id !== planItem.id)
    : []

  // Get requirements
  const linkedRequirements = planItem.requirements?.map((reqId) => getRequirementById(reqId)) || []

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false)
    // Here we would update the planItem with the editedItem values
    console.log("Saving changes:", editedItem)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedItem({ ...planItem })
  }

  const handleChange = (field: keyof PlanItemDetail, value: any) => {
    if (editedItem) {
      setEditedItem({
        ...editedItem,
        [field]: value,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(planItem.status)}
              <DialogTitle className="text-xl">{planItem.name}</DialogTitle>
              <Badge variant="outline" className="ml-2 capitalize">
                {planItem.type}
              </Badge>
              {planItem.taskType && (
                <Badge variant="outline" className="ml-1 capitalize">
                  {planItem.taskType.replace("_", " ")}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Flag className="h-4 w-4 mr-2" />
                        Change Status
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <GitBranch className="h-4 w-4 mr-2" />
                        Create Subtask
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link className="h-4 w-4 mr-2" />
                        Link Requirement
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Item
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="default" size="sm" onClick={handleSave}>
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
          <DialogDescription>
            {parentItem && (
              <div className="text-sm text-muted-foreground mt-1">
                <span className="font-medium">Path:</span> {parentItem.name} &gt; {planItem.name}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <TabsList className="px-6 grid grid-cols-4 w-full">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-[calc(90vh-10rem)]">
              <div className="p-6 pt-4">
                <TabsContent value="details" className="mt-0 space-y-4">
                  {!isEditing ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Status & Priority</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Status:</span>
                              <div className="flex items-center">
                                {getStatusIcon(planItem.status)}
                                <span className="ml-1 capitalize">{planItem.status}</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Priority:</span>
                              {getPriorityBadge(planItem.priority)}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Timing</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Start Date:</span>
                              <span>{formatDate(planItem.startDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Due Date:</span>
                              <span>{formatDate(planItem.dueDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Estimated Hours:</span>
                              <span>{planItem.estimatedHours || "Not set"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Actual Hours:</span>
                              <span>{planItem.actualHours || "Not set"}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="whitespace-pre-wrap">{planItem.description || "No description provided."}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Assignees</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {planItem.assignees && planItem.assignees.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {planItem.assignees.map((userId) => {
                                const user = getUserById(userId)
                                return (
                                  <div key={userId} className="flex items-center gap-2 p-2 border rounded-md">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                      <AvatarFallback>
                                        {user.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="text-sm font-medium">{user.name}</div>
                                      <div className="text-xs text-muted-foreground">{user.role}</div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          ) : (
                            <div className="text-muted-foreground">No assignees</div>
                          )}
                        </CardContent>
                      </Card>

                      {planItem.tags && planItem.tags.length > 0 && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Tags</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {planItem.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={users[0].avatar || "/placeholder.svg"} alt={users[0].name} />
                              <AvatarFallback>
                                {users[0].name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm">
                                <span className="font-medium">{users[0].name}</span> changed status from{" "}
                                <span className="font-medium">Planned</span> to{" "}
                                <span className="font-medium">In Progress</span>
                              </div>
                              <div className="text-xs text-muted-foreground">Yesterday at 2:30 PM</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={users[1].avatar || "/placeholder.svg"} alt={users[1].name} />
                              <AvatarFallback>
                                {users[1].name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm">
                                <span className="font-medium">{users[1].name}</span> added a comment
                              </div>
                              <div className="text-xs text-muted-foreground">2 days ago at 10:15 AM</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={users[2].avatar || "/placeholder.svg"} alt={users[2].name} />
                              <AvatarFallback>
                                {users[2].name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm">
                                <span className="font-medium">{users[2].name}</span> created this item
                              </div>
                              <div className="text-xs text-muted-foreground">3 days ago at 9:00 AM</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    // Edit mode
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              value={editedItem.name}
                              onChange={(e) => handleChange("name", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={editedItem.status} onValueChange={(value) => handleChange("status", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
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
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                              value={editedItem.priority}
                              onValueChange={(value) => handleChange("priority", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={editedItem.startDate}
                              onChange={(e) => handleChange("startDate", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input
                              id="dueDate"
                              type="date"
                              value={editedItem.dueDate}
                              onChange={(e) => handleChange("dueDate", e.target.value)}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label htmlFor="estimatedHours">Est. Hours</Label>
                              <Input
                                id="estimatedHours"
                                type="number"
                                value={editedItem.estimatedHours || ""}
                                onChange={(e) =>
                                  handleChange("estimatedHours", Number.parseInt(e.target.value) || undefined)
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="actualHours">Actual Hours</Label>
                              <Input
                                id="actualHours"
                                type="number"
                                value={editedItem.actualHours || ""}
                                onChange={(e) =>
                                  handleChange("actualHours", Number.parseInt(e.target.value) || undefined)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          rows={5}
                          value={editedItem.description}
                          onChange={(e) => handleChange("description", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Assignees</Label>
                        <div className="border rounded-md p-2">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {editedItem.assignees?.map((userId) => {
                              const user = getUserById(userId)
                              return (
                                <div key={userId} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                                  <span className="text-sm">{user.name}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0"
                                    onClick={() => {
                                      const newAssignees = editedItem.assignees?.filter((id) => id !== userId) || []
                                      handleChange("assignees", newAssignees)
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                          <Select
                            onValueChange={(value) => {
                              const newAssignees = [...(editedItem.assignees || []), value]
                              handleChange("assignees", newAssignees)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Add assignee" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem
                                  key={user.id}
                                  value={user.id}
                                  disabled={editedItem.assignees?.includes(user.id)}
                                >
                                  {user.name} ({user.role})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2 border rounded-md p-2">
                          {editedItem.tags?.map((tag) => (
                            <div key={tag} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                              <span className="text-sm">{tag}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0"
                                onClick={() => {
                                  const newTags = editedItem.tags?.filter((t) => t !== tag) || []
                                  handleChange("tags", newTags)
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add tag"
                              className="h-8"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && e.currentTarget.value) {
                                  const newTag = e.currentTarget.value
                                  const newTags = [...(editedItem.tags || []), newTag]
                                  handleChange("tags", newTags)
                                  e.currentTarget.value = ""
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="relationships" className="mt-0 space-y-6">
                  {/* Parent-Child Relationships */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Hierarchy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {parentItem && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Parent</h4>
                          <div className="border rounded-md p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(parentItem.status)}
                              <span>{parentItem.name}</span>
                              <Badge variant="outline" className="ml-1 capitalize">
                                {parentItem.type}
                              </Badge>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ArrowUp className="h-4 w-4" />
                              View
                            </Button>
                          </div>
                        </div>
                      )}

                      {siblings.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Siblings ({siblings.length})</h4>
                          <div className="space-y-2">
                            {siblings.slice(0, 3).map((sibling) => (
                              <div key={sibling.id} className="border rounded-md p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(sibling.status)}
                                  <span>{sibling.name}</span>
                                  <Badge variant="outline" className="ml-1 capitalize">
                                    {sibling.type}
                                  </Badge>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <ArrowRight className="h-4 w-4" />
                                  View
                                </Button>
                              </div>
                            ))}
                            {siblings.length > 3 && (
                              <Button variant="outline" size="sm" className="w-full">
                                View all {siblings.length} siblings
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {children.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Children ({children.length})</h4>
                          <div className="space-y-2">
                            {children.slice(0, 3).map((child) => (
                              <div key={child.id} className="border rounded-md p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(child.status)}
                                  <span>{child.name}</span>
                                  <Badge variant="outline" className="ml-1 capitalize">
                                    {child.type}
                                  </Badge>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <ArrowDown className="h-4 w-4" />
                                  View
                                </Button>
                              </div>
                            ))}
                            {children.length > 3 && (
                              <Button variant="outline" size="sm" className="w-full">
                                View all {children.length} children
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Dependencies */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Dependencies</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {dependencies.length > 0 ? (
                        <div>
                          <h4 className="text-sm font-medium mb-2">This item depends on:</h4>
                          <div className="space-y-2">
                            {dependencies.map(
                              (dep) =>
                                dep && (
                                  <div key={dep.id} className="border rounded-md p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      {getStatusIcon(dep.status)}
                                      <span>{dep.name}</span>
                                      <Badge variant="outline" className="ml-1 capitalize">
                                        {dep.type}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                              <GitMerge className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Dependency relationship</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <Button variant="ghost" size="sm">
                                        View
                                      </Button>
                                    </div>
                                  </div>
                                ),
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">No dependencies</div>
                      )}

                      {dependentItems.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Items that depend on this:</h4>
                          <div className="space-y-2">
                            {dependentItems.map((dep) => (
                              <div key={dep.id} className="border rounded-md p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(dep.status)}
                                  <span>{dep.name}</span>
                                  <Badge variant="outline" className="ml-1 capitalize">
                                    {dep.type}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <GitPullRequest className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Dependent relationship</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <Button variant="ghost" size="sm">
                                    View
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2">
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Dependency
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Logical Order */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Logical Order</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-md p-4">
                        <div className="flex flex-col items-center">
                          {/* Visualization of the logical order */}
                          <div className="flex flex-col items-center">
                            {dependencies.length > 0 && (
                              <>
                                <div className="text-center mb-2">
                                  <span className="text-sm font-medium">Dependencies</span>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2 mb-2">
                                  {dependencies.map(
                                    (dep) =>
                                      dep && (
                                        <Badge key={dep.id} variant="outline" className="flex items-center gap-1">
                                          {getStatusIcon(dep.status)}
                                          <span>{dep.name}</span>
                                        </Badge>
                                      ),
                                  )}
                                </div>
                                <div className="h-8 w-px bg-border"></div>
                              </>
                            )}

                            <div className="border-2 border-primary rounded-md px-4 py-2 my-2 text-center">
                              <span className="font-medium">{planItem.name}</span>
                            </div>

                            {children.length > 0 && (
                              <>
                                <div className="h-8 w-px bg-border"></div>
                                <div className="text-center mt-2 mb-2">
                                  <span className="text-sm font-medium">Children</span>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2">
                                  {children.map((child) => (
                                    <Badge key={child.id} variant="outline" className="flex items-center gap-1">
                                      {getStatusIcon(child.status)}
                                      <span>{child.name}</span>
                                    </Badge>
                                  ))}
                                </div>
                              </>
                            )}

                            {dependentItems.length > 0 && (
                              <>
                                <div className="h-8 w-px bg-border"></div>
                                <div className="text-center mt-2 mb-2">
                                  <span className="text-sm font-medium">Dependent Items</span>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2">
                                  {dependentItems.map((dep) => (
                                    <Badge key={dep.id} variant="outline" className="flex items-center gap-1">
                                      {getStatusIcon(dep.status)}
                                      <span>{dep.name}</span>
                                    </Badge>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="requirements" className="mt-0 space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Linked Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {linkedRequirements.length > 0 ? (
                        <div className="space-y-3">
                          {linkedRequirements.map((req) => (
                            <div key={req.id} className="border rounded-md p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-blue-500" />
                                  <span className="font-medium">{req.title}</span>
                                  {getPriorityBadge(req.priority)}
                                  <Badge variant={req.status === "approved" ? "default" : "outline"}>
                                    {req.status}
                                  </Badge>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Link className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </div>
                              <p className="mt-2 text-sm text-muted-foreground">{req.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p>No requirements linked to this item</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Plus className="h-4 w-4 mr-1" />
                            Link Requirement
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Available Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {requirements
                          .filter((req) => !planItem.requirements?.includes(req.id))
                          .map((req) => (
                            <div key={req.id} className="border rounded-md p-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-blue-500" />
                                  <span className="font-medium">{req.title}</span>
                                  {getPriorityBadge(req.priority)}
                                </div>
                                <Button variant="outline" size="sm">
                                  <Plus className="h-4 w-4 mr-1" />
                                  Link
                                </Button>
                              </div>
                              <p className="mt-2 text-sm text-muted-foreground">{req.description}</p>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="comments" className="mt-0">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {planItem.comments && planItem.comments.length > 0 ? (
                          planItem.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={comment.authorAvatar || "/placeholder.svg"} alt={comment.author} />
                                <AvatarFallback>
                                  {comment.author
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium">{comment.author}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {new Date(comment.timestamp).toLocaleString()}
                                  </div>
                                </div>
                                <div className="mt-1">{comment.content}</div>
                                {comment.reactions && Object.keys(comment.reactions).length > 0 && (
                                  <div className="flex gap-1 mt-2">
                                    {Object.entries(comment.reactions).map(([reaction, count]) => (
                                      <Badge key={reaction} variant="outline" className="text-xs">
                                        {reaction} {count}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>No comments yet</p>
                          </div>
                        )}
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-2">
                        <Textarea placeholder="Add a comment..." rows={3} />
                        <div className="flex justify-end">
                          <Button>
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Comment
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </ScrollArea>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
