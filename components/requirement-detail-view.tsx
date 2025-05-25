"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
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
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FileText,
  Flag,
  Link,
  MessageSquare,
  MoreHorizontal,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Edit,
  Trash2,
  Check,
  Clock,
  ExternalLink,
  Paperclip,
  Calendar,
  Users,
  Tag,
  GitBranch,
  FileCheck,
  Layers,
  ArrowRight,
  Unlink,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Types
export interface Requirement {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  status: "approved" | "pending" | "rejected"
  category: "functional" | "non-functional" | "technical" | "business"
  acceptanceCriteria: AcceptanceCriteria[]
  linkedItems: LinkedItem[]
  comments: Comment[]
  attachments: Attachment[]
  createdBy: string
  createdAt: string
  updatedAt: string
  completionPercentage: number
  assignees: string[]
  tags: string[]
  dueDate?: string
  parentId?: string
  children?: string[]
}

interface AcceptanceCriteria {
  id: string
  description: string
  completed: boolean
}

interface LinkedItem {
  id: string
  type: "task" | "feature" | "plan" | "document"
  title: string
  status: "completed" | "in-progress" | "planned" | "blocked"
}

interface Comment {
  id: string
  author: string
  authorAvatar?: string
  content: string
  timestamp: string
  reactions?: { [key: string]: number }
}

interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedBy: string
  uploadedAt: string
}

interface UserType {
  id: string
  name: string
  avatar?: string
  role: string
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

// Helper function to get user by ID
const getUserById = (id: string): UserType => {
  return users.find((user) => user.id === id) || { id: "", name: "Unknown User", role: "Unknown" }
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
      return <Clock className="h-4 w-4 text-blue-500" />
    case "blocked":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-400" />
  }
}

// Helper function to get requirement status icon
const getRequirementStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <FileCheck className="h-4 w-4 text-green-500" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "rejected":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <FileText className="h-4 w-4 text-gray-400" />
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

// Helper function to get category badge
const getCategoryBadge = (category: string) => {
  switch (category) {
    case "functional":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
          Functional
        </Badge>
      )
    case "non-functional":
      return (
        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
          Non-Functional
        </Badge>
      )
    case "technical":
      return (
        <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200">
          Technical
        </Badge>
      )
    case "business":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          Business
        </Badge>
      )
    default:
      return <Badge variant="outline">Other</Badge>
  }
}

interface RequirementDetailViewProps {
  isOpen: boolean
  onClose: () => void
  requirement: Requirement | null
  allRequirements: Requirement[]
  onUpdate?: (updatedRequirement: Requirement) => void
}

export function RequirementDetailView({
  isOpen,
  onClose,
  requirement,
  allRequirements,
  onUpdate,
}: RequirementDetailViewProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [isEditing, setIsEditing] = useState(false)
  const [editedRequirement, setEditedRequirement] = useState<Requirement | null>(null)
  const [newComment, setNewComment] = useState("")

  // Initialize edited requirement when the requirement changes
  useState(() => {
    if (requirement) {
      setEditedRequirement({ ...requirement })
    }
  })

  if (!requirement || !editedRequirement) return null

  // Get child requirements
  const childRequirements = allRequirements.filter((req) => req.parentId === requirement.id)

  // Get parent requirement
  const parentRequirement = requirement.parentId
    ? allRequirements.find((req) => req.id === requirement.parentId)
    : undefined

  const handleSave = () => {
    if (editedRequirement && onUpdate) {
      onUpdate(editedRequirement)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (requirement) {
      setEditedRequirement({ ...requirement })
    }
  }

  const handleChange = (field: keyof Requirement, value: any) => {
    if (editedRequirement) {
      setEditedRequirement({
        ...editedRequirement,
        [field]: value,
      })
    }
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: "Current User", // In a real app, this would be the current user
      content: newComment,
      timestamp: new Date().toISOString(),
    }

    if (editedRequirement) {
      const updatedComments = [...editedRequirement.comments, comment]
      handleChange("comments", updatedComments)
      setNewComment("")
    }
  }

  const toggleAcceptanceCriteria = (criteriaId: string, completed: boolean) => {
    if (editedRequirement) {
      const updatedCriteria = editedRequirement.acceptanceCriteria.map((criteria) =>
        criteria.id === criteriaId ? { ...criteria, completed } : criteria,
      )
      handleChange("acceptanceCriteria", updatedCriteria)

      // Update completion percentage
      const completedCount = updatedCriteria.filter((criteria) => criteria.completed).length
      const totalCount = updatedCriteria.length
      const newPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
      handleChange("completionPercentage", newPercentage)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getRequirementStatusIcon(requirement.status)}
              <DialogTitle className="text-xl">{requirement.title}</DialogTitle>
              {getCategoryBadge(requirement.category)}
              {getPriorityBadge(requirement.priority)}
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
                        Create Sub-Requirement
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link className="h-4 w-4 mr-2" />
                        Link to Task
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Requirement
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
            {parentRequirement && (
              <div className="text-sm text-muted-foreground mt-1">
                <span className="font-medium">Path:</span> {parentRequirement.title} &gt; {requirement.title}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <TabsList className="px-6 grid grid-cols-4 w-full">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="linked-items">
              Linked Items
              {requirement.linkedItems.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  {requirement.linkedItems.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="comments">
              Comments
              {requirement.comments.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  {requirement.comments.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="attachments">
              Attachments
              {requirement.attachments.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  {requirement.attachments.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-[calc(90vh-10rem)] md:h-[calc(90vh-8rem)]">
              <div className="p-6 pt-4">
                <TabsContent value="details" className="mt-0 space-y-4">
                  {!isEditing ? (
                    <>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="whitespace-pre-wrap">{requirement.description}</p>
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Dates
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Created:</span>
                              <span className="text-sm">{formatDate(requirement.createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Updated:</span>
                              <span className="text-sm">{formatDate(requirement.updatedAt)}</span>
                            </div>
                            {requirement.dueDate && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Due:</span>
                                <span className="text-sm">{formatDate(requirement.dueDate)}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              People
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Created by:</span>
                              <span className="text-sm">{getUserById(requirement.createdBy).name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Assignees:</span>
                              <div className="flex -space-x-2">
                                {requirement.assignees.map((userId) => {
                                  const user = getUserById(userId)
                                  return (
                                    <TooltipProvider key={userId}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Avatar className="h-6 w-6 border-2 border-background">
                                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                            <AvatarFallback>
                                              {user.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                            </AvatarFallback>
                                          </Avatar>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>
                                            {user.name} ({user.role})
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  )
                                })}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                              <Tag className="h-4 w-4" />
                              Tags
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-1">
                              {requirement.tags.length > 0 ? (
                                requirement.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-sm text-muted-foreground">No tags</span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-sm font-medium">Completion</CardTitle>
                            <span className="text-sm font-medium">{requirement.completionPercentage}%</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Progress value={requirement.completionPercentage} className="h-2" />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Acceptance Criteria</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {requirement.acceptanceCriteria.length > 0 ? (
                              requirement.acceptanceCriteria.map((criteria) => (
                                <div key={criteria.id} className="flex items-start gap-2">
                                  <Checkbox
                                    id={criteria.id}
                                    checked={criteria.completed}
                                    onCheckedChange={(checked) =>
                                      toggleAcceptanceCriteria(criteria.id, checked === true)
                                    }
                                    className="mt-0.5"
                                  />
                                  <label
                                    htmlFor={criteria.id}
                                    className={`text-sm ${
                                      criteria.completed ? "line-through text-muted-foreground" : ""
                                    }`}
                                  >
                                    {criteria.description}
                                  </label>
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-muted-foreground">No acceptance criteria defined</div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {childRequirements.length > 0 && (
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                              <Layers className="h-4 w-4" />
                              Sub-Requirements
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {childRequirements.map((childReq) => (
                                <div
                                  key={childReq.id}
                                  className="flex items-center justify-between border rounded-md p-3"
                                >
                                  <div className="flex items-center gap-2">
                                    {getRequirementStatusIcon(childReq.status)}
                                    <span className="font-medium">{childReq.title}</span>
                                    {getPriorityBadge(childReq.priority)}
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <ArrowRight className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  ) : (
                    // Edit mode
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={editedRequirement.title}
                          onChange={(e) => handleChange("title", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          rows={5}
                          value={editedRequirement.description}
                          onChange={(e) => handleChange("description", e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={editedRequirement.status}
                            onValueChange={(value) => handleChange("status", value)}
                          >
                            <SelectTrigger id="status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={editedRequirement.priority}
                            onValueChange={(value) => handleChange("priority", value)}
                          >
                            <SelectTrigger id="priority">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={editedRequirement.category}
                            onValueChange={(value) => handleChange("category", value)}
                          >
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="functional">Functional</SelectItem>
                              <SelectItem value="non-functional">Non-Functional</SelectItem>
                              <SelectItem value="technical">Technical</SelectItem>
                              <SelectItem value="business">Business</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={editedRequirement.dueDate?.split("T")[0] || ""}
                          onChange={(e) =>
                            handleChange("dueDate", e.target.value ? `${e.target.value}T00:00:00Z` : undefined)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Acceptance Criteria</Label>
                        <div className="border rounded-md p-3 space-y-2">
                          {editedRequirement.acceptanceCriteria.map((criteria, index) => (
                            <div key={criteria.id} className="flex items-center gap-2">
                              <Checkbox
                                id={`edit-${criteria.id}`}
                                checked={criteria.completed}
                                onCheckedChange={(checked) => toggleAcceptanceCriteria(criteria.id, checked === true)}
                              />
                              <Input
                                value={criteria.description}
                                onChange={(e) => {
                                  const updatedCriteria = [...editedRequirement.acceptanceCriteria]
                                  updatedCriteria[index] = {
                                    ...updatedCriteria[index],
                                    description: e.target.value,
                                  }
                                  handleChange("acceptanceCriteria", updatedCriteria)
                                }}
                                className="flex-1"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  const updatedCriteria = editedRequirement.acceptanceCriteria.filter(
                                    (_, i) => i !== index,
                                  )
                                  handleChange("acceptanceCriteria", updatedCriteria)
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newCriteria = {
                                id: `criteria-${Date.now()}`,
                                description: "",
                                completed: false,
                              }
                              handleChange("acceptanceCriteria", [...editedRequirement.acceptanceCriteria, newCriteria])
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Criteria
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2 border rounded-md p-3">
                          {editedRequirement.tags.map((tag, index) => (
                            <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                              <span className="text-sm">{tag}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0"
                                onClick={() => {
                                  const newTags = editedRequirement.tags.filter((_, i) => i !== index)
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
                                  handleChange("tags", [...editedRequirement.tags, newTag])
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

                <TabsContent value="linked-items" className="mt-0 space-y-4">
                  {requirement.linkedItems.length > 0 ? (
                    <div className="space-y-2">
                      {requirement.linkedItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border rounded-md p-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            <span className="font-medium">{item.title}</span>
                            <Badge variant="outline" className="capitalize">
                              {item.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Unlink className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Link className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>No linked items</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Plus className="h-4 w-4 mr-1" />
                        Link Item
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="comments" className="mt-0 space-y-4">
                  {requirement.comments.length > 0 ? (
                    <div className="space-y-4">
                      {requirement.comments.map((comment) => (
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
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                              <div className="font-medium">{comment.author}</div>
                              <div className="text-xs text-muted-foreground mt-1 sm:mt-0">
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
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>No comments yet</p>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add a comment..."
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Comment
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="attachments" className="mt-0 space-y-4">
                  {requirement.attachments.length > 0 ? (
                    <div className="space-y-2">
                      {requirement.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between border rounded-md p-3">
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4" />
                            <span className="font-medium">{attachment.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {(attachment.size / 1024).toFixed(0)} KB
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Paperclip className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>No attachments</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Attachment
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </div>
            </ScrollArea>
          </div>
        </Tabs>

        <DialogFooter className="p-6 pt-2">
          <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
            <div>ID: {requirement.id}</div>
            <div className="flex items-center gap-4">
              <div>Created: {formatDate(requirement.createdAt)}</div>
              <div>Updated: {formatDate(requirement.updatedAt)}</div>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
