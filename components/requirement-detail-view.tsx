"use client"

import { useState } from "react"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FileText,
  Edit,
  Trash2,
  Check,
  X,
  CheckCircle2,
  ClockIcon,
  MessageSquare,
  LinkIcon,
  ExternalLink,
  MoreHorizontal,
  GitBranch,
  Info,
  Plus,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Types
interface Requirement {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  status: "approved" | "pending" | "rejected"
  category: "functional" | "non-functional" | "technical" | "business"
  acceptanceCriteria?: string[]
  linkedTasks?: string[]
  createdBy: string
  createdAt: string
  updatedAt: string
  completionPercentage?: number
}

interface UserType {
  id: string
  name: string
  avatar?: string
  role: string
}

// Mock data for users (if needed)
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

// Helper function to get requirement status icon
const getRequirementStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case "pending":
      return <ClockIcon className="h-4 w-4 text-yellow-500" />
    case "rejected":
      return <X className="h-4 w-4 text-red-500" />
    default:
      return <FileText className="h-4 w-4 text-gray-400" />
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

export function RequirementDetailView({
  isOpen,
  onClose,
  requirement,
  allRequirements,
}: {
  isOpen: boolean
  onClose: () => void
  requirement: Requirement | null
  allRequirements: Requirement[]
}) {
  const [activeTab, setActiveTab] = useState("details")
  const [isEditing, setIsEditing] = useState(false)
  const [editedRequirement, setEditedRequirement] = useState<Requirement | null>(null)

  // Initialize edited requirement when the requirement changes
  useState(() => {
    if (requirement) {
      setEditedRequirement({ ...requirement })
    }
  })

  if (!requirement || !editedRequirement) return null

  // Get related requirements (those with similar categories)
  const relatedRequirements = allRequirements.filter(
    (req) => req.id !== requirement.id && req.category === requirement.category,
  )

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false)
    // Here we would update the requirement with the editedRequirement values
    console.log("Saving changes:", editedRequirement)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedRequirement({ ...requirement })
  }

  const handleChange = (field: keyof Requirement, value: any) => {
    if (editedRequirement) {
      setEditedRequirement({
        ...editedRequirement,
        [field]: value,
      })
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
              {getPriorityBadge(requirement.priority)}
              {getCategoryBadge(requirement.category)}
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
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Change Status
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <GitBranch className="h-4 w-4 mr-2" />
                        Create Sub-requirement
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <LinkIcon className="h-4 w-4 mr-2" />
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
            <div className="text-sm text-muted-foreground mt-1">
              Created by {getUserById(requirement.createdBy).name} on {formatDate(requirement.createdAt)}
            </div>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <TabsList className="px-6 grid grid-cols-3 w-full">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="acceptance">Acceptance Criteria</TabsTrigger>
            <TabsTrigger value="related">Related Items</TabsTrigger>
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Status & Priority</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Status:</span>
                              <div className="flex items-center">
                                {getRequirementStatusIcon(requirement.status)}
                                <span className="ml-1 capitalize">{requirement.status}</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Priority:</span>
                              {getPriorityBadge(requirement.priority)}
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Category:</span>
                              {getCategoryBadge(requirement.category)}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Progress</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {requirement.completionPercentage !== undefined ? (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Completion:</span>
                                  <span>{requirement.completionPercentage}%</span>
                                </div>
                                <Progress value={requirement.completionPercentage} className="h-2" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Not Started</span>
                                  <span>In Progress</span>
                                  <span>Complete</span>
                                </div>
                              </>
                            ) : (
                              <div className="text-muted-foreground">No progress data available</div>
                            )}
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Created By:</span>
                            <span>{getUserById(requirement.createdBy).name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Created Date:</span>
                            <span>{formatDate(requirement.createdAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Last Updated:</span>
                            <span>{formatDate(requirement.updatedAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Linked Tasks:</span>
                            <span>{requirement.linkedTasks?.length || 0}</span>
                          </div>
                        </CardContent>
                      </Card>
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
                            <SelectTrigger>
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

                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={editedRequirement.category}
                            onValueChange={(value) => handleChange("category", value)}
                          >
                            <SelectTrigger>
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
                        <Label htmlFor="completionPercentage">Completion Percentage</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="completionPercentage"
                            type="number"
                            min="0"
                            max="100"
                            value={editedRequirement.completionPercentage || 0}
                            onChange={(e) => handleChange("completionPercentage", Number.parseInt(e.target.value) || 0)}
                          />
                          <span>%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="acceptance" className="mt-0 space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm font-medium">Acceptance Criteria</CardTitle>
                        {isEditing && (
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Add Criteria
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {requirement.acceptanceCriteria && requirement.acceptanceCriteria.length > 0 ? (
                        <div className="space-y-2">
                          {requirement.acceptanceCriteria.map((criteria, index) => (
                            <div key={index} className="flex items-start gap-2 p-2 border rounded-md">
                              <Checkbox id={`criteria-${index}`} className="mt-0.5" />
                              {!isEditing ? (
                                <label
                                  htmlFor={`criteria-${index}`}
                                  className="text-sm leading-tight cursor-pointer flex-1"
                                >
                                  {criteria}
                                </label>
                              ) : (
                                <div className="flex-1 flex items-center gap-2">
                                  <Input
                                    value={criteria}
                                    onChange={(e) => {
                                      const newCriteria = [...(editedRequirement.acceptanceCriteria || [])]
                                      newCriteria[index] = e.target.value
                                      handleChange("acceptanceCriteria", newCriteria)
                                    }}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      const newCriteria = [...(editedRequirement.acceptanceCriteria || [])]
                                      newCriteria.splice(index, 1)
                                      handleChange("acceptanceCriteria", newCriteria)
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p>No acceptance criteria defined</p>
                          {isEditing && (
                            <Button variant="outline" size="sm" className="mt-2">
                              <Plus className="h-4 w-4 mr-1" />
                              Add First Criteria
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Verification Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 p-2 border rounded-md">
                          <Checkbox id="verification-1" className="mt-0.5" />
                          <label htmlFor="verification-1" className="text-sm leading-tight cursor-pointer">
                            Manual testing by QA team
                          </label>
                        </div>
                        <div className="flex items-start gap-2 p-2 border rounded-md">
                          <Checkbox id="verification-2" className="mt-0.5" />
                          <label htmlFor="verification-2" className="text-sm leading-tight cursor-pointer">
                            Automated test coverage
                          </label>
                        </div>
                        <div className="flex items-start gap-2 p-2 border rounded-md">
                          <Checkbox id="verification-3" className="mt-0.5" />
                          <label htmlFor="verification-3" className="text-sm leading-tight cursor-pointer">
                            User acceptance testing
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="related" className="mt-0 space-y-4">
                  {/* Linked Tasks */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Linked Tasks ({requirement.linkedTasks?.length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {requirement.linkedTasks && requirement.linkedTasks.length > 0 ? (
                        <div className="space-y-2">
                          {requirement.linkedTasks.map((taskId) => (
                            <div key={taskId} className="border rounded-md p-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span>Task {taskId}</span>
                              </div>
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          <GitBranch className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p>No tasks linked to this requirement</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Related Requirements */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Related Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {relatedRequirements.length > 0 ? (
                        <div className="space-y-2">
                          {relatedRequirements.slice(0, 3).map((req) => (
                            <div key={req.id} className="border rounded-md p-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {getRequirementStatusIcon(req.status)}
                                <span>{req.title}</span>
                                {getPriorityBadge(req.priority)}
                              </div>
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                          ))}
                          {relatedRequirements.length > 3 && (
                            <Button variant="outline" size="sm" className="w-full">
                              View all {relatedRequirements.length} related requirements
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          <Info className="h-12 w-12 mx-auto mb-2 opacity-20" />
                          <p>No related requirements found</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Comments */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Comments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-6 text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p>No comments yet</p>
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
