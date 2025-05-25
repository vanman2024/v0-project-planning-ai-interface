"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FileText,
  Flag,
  GitBranch,
  Link,
  MoreHorizontal,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Edit,
  Trash2,
  Check,
  Circle,
  ClockIcon,
  Unlink,
  FileCheck,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { RequirementDetailView, type Requirement } from "./requirement-detail-view"

// Types for task items
export interface TaskDetail {
  id: string
  name: string
  description: string
  status: "completed" | "in-progress" | "planned" | "blocked"
  type: "task" | "feature" | "milestone"
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

// Enhanced mock data for requirements with more details
const mockRequirements: Requirement[] = [
  {
    id: "req1",
    title: "User Authentication",
    description: "System must support secure user authentication with email/password and social login options.",
    priority: "high",
    status: "approved",
    category: "functional",
    acceptanceCriteria: [
      {
        id: "ac1",
        description: "Users can register with email and password",
        completed: true,
      },
      {
        id: "ac2",
        description: "Password must meet security requirements (8+ chars, special chars)",
        completed: true,
      },
      {
        id: "ac3",
        description: "Users can login with Google and GitHub OAuth",
        completed: false,
      },
      {
        id: "ac4",
        description: "Session management with JWT tokens",
        completed: true,
      },
      {
        id: "ac5",
        description: "Password reset functionality via email",
        completed: false,
      },
    ],
    linkedItems: [
      {
        id: "task1",
        type: "task",
        title: "Implement user registration",
        status: "completed",
      },
      {
        id: "task2",
        type: "task",
        title: "Implement password validation",
        status: "completed",
      },
      {
        id: "task5",
        type: "task",
        title: "Implement OAuth providers",
        status: "in-progress",
      },
    ],
    comments: [
      {
        id: "comment1",
        author: "Alex Johnson",
        authorAvatar: "/placeholder.svg?height=40&width=40&query=AJ",
        content: "We should prioritize the OAuth implementation for the next sprint.",
        timestamp: "2024-04-10T14:30:00Z",
        reactions: { "👍": 2, "🚀": 1 },
      },
    ],
    attachments: [],
    createdBy: "user1",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    completionPercentage: 75,
    assignees: ["user2", "user4"],
    tags: ["security", "user-experience", "core-feature"],
  },
  {
    id: "req2",
    title: "Data Encryption",
    description: "All sensitive user data must be encrypted both in transit and at rest.",
    priority: "high",
    status: "approved",
    category: "technical",
    acceptanceCriteria: [
      {
        id: "ac2.1",
        description: "Use AES-256 encryption for data at rest",
        completed: true,
      },
      {
        id: "ac2.2",
        description: "Implement TLS 1.3 for all API communications",
        completed: true,
      },
      {
        id: "ac2.3",
        description: "Encrypt PII fields in database",
        completed: false,
      },
      {
        id: "ac2.4",
        description: "Secure key management system",
        completed: false,
      },
    ],
    linkedItems: [
      {
        id: "task3",
        type: "task",
        title: "Implement database encryption",
        status: "in-progress",
      },
      {
        id: "task4",
        type: "task",
        title: "Configure TLS for API endpoints",
        status: "completed",
      },
    ],
    comments: [],
    attachments: [],
    createdBy: "user2",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T11:00:00Z",
    completionPercentage: 60,
    assignees: ["user2"],
    tags: ["security", "compliance"],
  },
]

// Helper function to get user by ID
const getUserById = (id: string): UserType => {
  return users.find((user) => user.id === id) || { id: "", name: "Unknown User", role: "Unknown" }
}

// Helper function to get requirement by ID
const getRequirementById = (id: string): Requirement => {
  return (
    mockRequirements.find((req) => req.id === id) || {
      id: "",
      title: "Unknown Requirement",
      description: "",
      priority: "medium",
      status: "pending",
      category: "functional",
      acceptanceCriteria: [],
      linkedItems: [],
      comments: [],
      attachments: [],
      createdBy: "",
      createdAt: "",
      updatedAt: "",
      completionPercentage: 0,
      assignees: [],
      tags: [],
    }
  )
}

// Helper function to get task item by ID
const getTaskById = (id: string, allItems: TaskDetail[]): TaskDetail | undefined => {
  if (!allItems) return undefined
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

// Helper function to get requirement status icon
const getRequirementStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <FileCheck className="h-4 w-4 text-green-500" />
    case "pending":
      return <ClockIcon className="h-4 w-4 text-yellow-500" />
    case "rejected":
      return <X className="h-4 w-4 text-red-500" />
    default:
      return <FileText className="h-4 w-4 text-gray-400" />
  }
}

export function TaskDetailView({
  isOpen,
  onClose,
  task,
  allTasks,
}: {
  isOpen: boolean
  onClose: () => void
  task: TaskDetail | null
  allTasks: TaskDetail[]
}) {
  const [activeTab, setActiveTab] = useState("details")
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<TaskDetail | null>(null)
  const [expandedRequirements, setExpandedRequirements] = useState<Record<string, boolean>>({})
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null)
  const [isRequirementDetailOpen, setIsRequirementDetailOpen] = useState(false)

  useEffect(() => {
    if (task) {
      setEditedTask({ ...task })

      // Initialize expanded state for requirements
      if (task.requirements) {
        const initialExpandedState: Record<string, boolean> = {}
        task.requirements.forEach((reqId) => {
          initialExpandedState[reqId] = false
        })
        setExpandedRequirements(initialExpandedState)
      }
    }
  }, [task])

  if (!task || !editedTask) return null

  if (!allTasks) {
    console.error("TaskDetailView: allTasks prop is undefined")
    return null
  }

  // Get direct children
  const children = allTasks?.filter((item) => item.parentId === task.id) || []

  // Get dependencies
  const dependencies = task.dependencies?.map((depId) => getTaskById(depId, allTasks)) || []

  // Get dependent items (items that depend on this one)
  const dependentItems = allTasks?.filter((item) => item.dependencies?.includes(task.id)) || []

  // Get parent item
  const parentTask = task.parentId ? getTaskById(task.parentId, allTasks) : undefined

  // Get siblings (items with the same parent)
  const siblings = task.parentId
    ? allTasks?.filter((item) => item.parentId === task.parentId && item.id !== task.id) || []
    : []

  // Get requirements
  const linkedRequirements = task.requirements?.map((reqId) => getRequirementById(reqId)) || []

  const toggleRequirementExpanded = (reqId: string) => {
    setExpandedRequirements((prev) => ({
      ...prev,
      [reqId]: !prev[reqId],
    }))
  }

  const handleRequirementClick = (requirement: Requirement) => {
    setSelectedRequirement(requirement)
    setIsRequirementDetailOpen(true)
  }

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false)
    // Here we would update the task with the editedTask values
    console.log("Saving changes:", editedTask)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedTask({ ...task })
  }

  const handleChange = (field: keyof TaskDetail, value: any) => {
    if (editedTask) {
      setEditedTask({
        ...editedTask,
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
              {getStatusIcon(task.status)}
              <DialogTitle className="text-xl">{task.name}</DialogTitle>
              <Badge variant="outline" className="ml-2 capitalize">
                {task.type}
              </Badge>
              {task.taskType && (
                <Badge variant="outline" className="ml-1 capitalize">
                  {task.taskType.replace("_", " ")}
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
            {parentTask && (
              <div className="text-sm text-muted-foreground mt-1">
                <span className="font-medium">Path:</span> {parentTask.name} &gt; {task.name}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <TabsList className="px-6 grid grid-cols-2 sm:grid-cols-4 w-full">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
            <TabsTrigger value="requirements" className="relative">
              Requirements
              {linkedRequirements.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  {linkedRequirements.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-[calc(90vh-10rem)] md:h-[calc(90vh-8rem)]">
              <div className="p-6 pt-4">
                <TabsContent value="details" className="mt-0 space-y-4">
                  {/* Details tab content */}
                </TabsContent>

                <TabsContent value="relationships" className="mt-0 space-y-6">
                  {/* Relationships tab content */}
                </TabsContent>

                <TabsContent value="requirements" className="mt-0 space-y-4">
                  {linkedRequirements.length > 0 ? (
                    <div className="space-y-4">
                      {linkedRequirements.map((req) => (
                        <Card
                          key={req.id}
                          className="border-l-4 hover:shadow-md transition-shadow cursor-pointer"
                          style={{
                            borderLeftColor:
                              req.priority === "high" ? "#ef4444" : req.priority === "medium" ? "#f59e0b" : "#22c55e",
                          }}
                          onClick={() => handleRequirementClick(req)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleRequirementExpanded(req.id)
                                  }}
                                  className="p-1 rounded-md hover:bg-muted"
                                >
                                  {expandedRequirements[req.id] ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </button>
                                <div className="flex items-center gap-2">
                                  {getRequirementStatusIcon(req.status)}
                                  <CardTitle className="text-lg">{req.title}</CardTitle>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">{getPriorityBadge(req.priority)}</div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Unlink requirement logic would go here
                                    console.log("Unlink requirement:", req.id)
                                  }}
                                >
                                  <Unlink className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <CardDescription>{req.description}</CardDescription>
                          </CardHeader>

                          <Collapsible open={expandedRequirements[req.id]}>
                            <CollapsibleContent>
                              <CardContent className="pt-0 space-y-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <h4 className="text-sm font-medium">Completion</h4>
                                    <span className="text-sm font-medium">{req.completionPercentage}%</span>
                                  </div>
                                  <Progress value={req.completionPercentage} className="h-2" />
                                </div>

                                {req.acceptanceCriteria && req.acceptanceCriteria.length > 0 && (
                                  <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Acceptance Criteria:</h4>
                                    <div className="space-y-1 border rounded-md p-3">
                                      {req.acceptanceCriteria.map((criteria) => (
                                        <div key={criteria.id} className="flex items-start gap-2">
                                          <Checkbox className="mt-0.5" checked={criteria.completed} disabled />
                                          <span
                                            className={`text-sm ${
                                              criteria.completed ? "line-through text-muted-foreground" : ""
                                            }`}
                                          >
                                            {criteria.description}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </CollapsibleContent>
                          </Collapsible>

                          <CardFooter className="py-2 text-xs text-muted-foreground">
                            <div className="flex items-center justify-between w-full">
                              <div>ID: {req.id}</div>
                              <div className="flex items-center gap-2">
                                {req.linkedItems.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Link className="h-3 w-3" />
                                    <span>{req.linkedItems.length}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}

                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Link More Requirements
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>No requirements linked to this task</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        <Plus className="h-4 w-4 mr-1" />
                        Link Requirements
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="comments" className="mt-0">
                  {/* Comments tab content */}
                </TabsContent>
              </div>
            </ScrollArea>
          </div>
        </Tabs>
      </DialogContent>

      {/* Requirement Detail View */}
      <RequirementDetailView
        isOpen={isRequirementDetailOpen}
        onClose={() => setIsRequirementDetailOpen(false)}
        requirement={selectedRequirement}
        allRequirements={mockRequirements}
      />
    </Dialog>
  )
}
