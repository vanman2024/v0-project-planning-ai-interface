"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FileText,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Link,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileCheck,
  MoreHorizontal,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  MessageSquare,
  Calendar,
  Users,
  Tag,
  Paperclip,
  Layers,
  GitBranch,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"

// Types
interface Requirement {
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

// Mock data for requirements
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
    attachments: [
      {
        id: "attach1",
        name: "auth-flow-diagram.png",
        type: "image/png",
        size: 256000,
        url: "/placeholder.svg?height=200&width=300&query=auth-flow-diagram",
        uploadedBy: "user1",
        uploadedAt: "2024-04-05T10:15:00Z",
      },
    ],
    createdBy: "user1",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
    completionPercentage: 75,
    assignees: ["user2", "user4"],
    tags: ["security", "user-experience", "core-feature"],
    dueDate: "2024-05-15T00:00:00Z",
    children: ["req1.1", "req1.2"],
  },
  {
    id: "req1.1",
    title: "Password Strength Requirements",
    description: "Password must meet specific strength criteria to ensure security.",
    priority: "medium",
    status: "approved",
    category: "functional",
    acceptanceCriteria: [
      {
        id: "ac1.1.1",
        description: "Minimum 8 characters",
        completed: true,
      },
      {
        id: "ac1.1.2",
        description: "At least one uppercase letter",
        completed: true,
      },
      {
        id: "ac1.1.3",
        description: "At least one number",
        completed: true,
      },
      {
        id: "ac1.1.4",
        description: "At least one special character",
        completed: true,
      },
    ],
    linkedItems: [
      {
        id: "task2",
        type: "task",
        title: "Implement password validation",
        status: "completed",
      },
    ],
    comments: [],
    attachments: [],
    createdBy: "user2",
    createdAt: "2024-01-16T11:00:00Z",
    updatedAt: "2024-01-18T09:30:00Z",
    completionPercentage: 100,
    assignees: ["user2"],
    tags: ["security"],
    parentId: "req1",
  },
  {
    id: "req1.2",
    title: "Social Login Integration",
    description: "System must support login via popular social media platforms.",
    priority: "medium",
    status: "approved",
    category: "functional",
    acceptanceCriteria: [
      {
        id: "ac1.2.1",
        description: "Google OAuth integration",
        completed: false,
      },
      {
        id: "ac1.2.2",
        description: "GitHub OAuth integration",
        completed: false,
      },
      {
        id: "ac1.2.3",
        description: "Account linking between social and email accounts",
        completed: false,
      },
    ],
    linkedItems: [
      {
        id: "task5",
        type: "task",
        title: "Implement OAuth providers",
        status: "in-progress",
      },
    ],
    comments: [],
    attachments: [],
    createdBy: "user1",
    createdAt: "2024-01-17T14:00:00Z",
    updatedAt: "2024-01-17T14:00:00Z",
    completionPercentage: 30,
    assignees: ["user2", "user4"],
    tags: ["security", "user-experience"],
    parentId: "req1",
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
  {
    id: "req3",
    title: "Mobile Responsiveness",
    description: "All UI components must be fully responsive and work on mobile devices.",
    priority: "medium",
    status: "approved",
    category: "non-functional",
    acceptanceCriteria: [
      {
        id: "ac3.1",
        description: "Support viewport sizes from 320px to 4K",
        completed: true,
      },
      {
        id: "ac3.2",
        description: "Touch-friendly interface elements",
        completed: true,
      },
      {
        id: "ac3.3",
        description: "Optimized images for different screen sizes",
        completed: true,
      },
      {
        id: "ac3.4",
        description: "Progressive web app capabilities",
        completed: false,
      },
    ],
    linkedItems: [
      {
        id: "task6",
        type: "task",
        title: "Implement responsive layouts",
        status: "completed",
      },
      {
        id: "task7",
        type: "task",
        title: "Optimize touch interactions",
        status: "completed",
      },
      {
        id: "task8",
        type: "task",
        title: "Implement PWA features",
        status: "in-progress",
      },
    ],
    comments: [],
    attachments: [],
    createdBy: "user3",
    createdAt: "2024-01-12T13:00:00Z",
    updatedAt: "2024-01-22T16:00:00Z",
    completionPercentage: 90,
    assignees: ["user3"],
    tags: ["ui", "mobile", "user-experience"],
  },
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

export function RequirementsDocumentView() {
  const [requirements, setRequirements] = useState<Requirement[]>(mockRequirements)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedRequirements, setExpandedRequirements] = useState<Record<string, boolean>>({
    req1: true,
    req2: false,
    req3: false,
  })
  const [activeTab, setActiveTab] = useState("all")

  const toggleRequirementExpanded = (id: string) => {
    setExpandedRequirements((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Filter requirements based on search and active tab
  const filteredRequirements = requirements.filter((req) => {
    const matchesSearch =
      searchQuery === "" ||
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "functional" && req.category === "functional") ||
      (activeTab === "non-functional" && req.category === "non-functional") ||
      (activeTab === "technical" && req.category === "technical") ||
      (activeTab === "business" && req.category === "business")

    return matchesSearch && matchesTab && !req.parentId // Only show top-level requirements in the main list
  })

  // Get child requirements for a parent
  const getChildRequirements = (parentId: string) => {
    return requirements.filter((req) => req.parentId === parentId)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Requirements Document</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Requirement
          </Button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search requirements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="functional">Functional</TabsTrigger>
          <TabsTrigger value="non-functional">Non-Functional</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
        </TabsList>
      </Tabs>

      <ScrollArea className="flex-1">
        <div className="space-y-4 pb-4">
          {filteredRequirements.length > 0 ? (
            filteredRequirements.map((requirement) => (
              <RequirementBlock
                key={requirement.id}
                requirement={requirement}
                isExpanded={expandedRequirements[requirement.id] || false}
                onToggleExpand={() => toggleRequirementExpanded(requirement.id)}
                childRequirements={getChildRequirements(requirement.id)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>No requirements found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

interface RequirementBlockProps {
  requirement: Requirement
  isExpanded: boolean
  onToggleExpand: () => void
  childRequirements: Requirement[]
}

function RequirementBlock({ requirement, isExpanded, onToggleExpand, childRequirements }: RequirementBlockProps) {
  const [activeTab, setActiveTab] = useState("details")

  return (
    <Card
      className="border-l-4"
      style={{
        borderLeftColor:
          requirement.priority === "high" ? "#ef4444" : requirement.priority === "medium" ? "#f59e0b" : "#22c55e",
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onToggleExpand} className="p-1 rounded-md hover:bg-muted">
              {childRequirements.length > 0 ? (
                isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
              ) : (
                <div className="w-4" />
              )}
            </button>
            <div className="flex items-center gap-2">
              {getRequirementStatusIcon(requirement.status)}
              <CardTitle className="text-lg">{requirement.title}</CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {getPriorityBadge(requirement.priority)}
              {getCategoryBadge(requirement.category)}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link className="h-4 w-4 mr-2" />
                  Link Item
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <GitBranch className="h-4 w-4 mr-2" />
                  Add Sub-Requirement
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardDescription>{requirement.description}</CardDescription>
      </CardHeader>

      <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="linked-items">Linked Items ({requirement.linkedItems.length})</TabsTrigger>
                <TabsTrigger value="comments">Comments ({requirement.comments.length})</TabsTrigger>
                <TabsTrigger value="attachments">Attachments ({requirement.attachments.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Dates
                    </h4>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{formatDate(requirement.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Updated:</span>
                        <span>{formatDate(requirement.updatedAt)}</span>
                      </div>
                      {requirement.dueDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Due:</span>
                          <span>{formatDate(requirement.dueDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      People
                    </h4>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created by:</span>
                        <span>{getUserById(requirement.createdBy).name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Assignees:</span>
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
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {requirement.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Completion</h4>
                    <span className="text-sm font-medium">{requirement.completionPercentage}%</span>
                  </div>
                  <Progress value={requirement.completionPercentage} className="h-2" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Acceptance Criteria</h4>
                  <div className="space-y-2 border rounded-md p-3">
                    {requirement.acceptanceCriteria.map((criteria) => (
                      <div key={criteria.id} className="flex items-start gap-2">
                        <Checkbox id={criteria.id} checked={criteria.completed} className="mt-0.5" />
                        <label
                          htmlFor={criteria.id}
                          className={`text-sm ${criteria.completed ? "line-through text-muted-foreground" : ""}`}
                        >
                          {criteria.description}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="linked-items" className="space-y-4">
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
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View
                        </Button>
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

              <TabsContent value="comments" className="space-y-4">
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

                    <Separator />

                    <div className="space-y-2">
                      <Textarea placeholder="Add a comment..." rows={2} />
                      <div className="flex justify-end">
                        <Button size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No comments yet</p>
                    <div className="space-y-2 mt-4 max-w-md mx-auto">
                      <Textarea placeholder="Add a comment..." rows={2} />
                      <div className="flex justify-end">
                        <Button size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="attachments" className="space-y-4">
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
            </Tabs>
          </CardContent>

          {/* Child Requirements */}
          {childRequirements.length > 0 && (
            <div className="px-6 pb-4 space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium">Sub-Requirements</h4>
              </div>
              <div className="pl-4 border-l space-y-3">
                {childRequirements.map((childReq) => (
                  <Card
                    key={childReq.id}
                    className="border-l-4"
                    style={{
                      borderLeftColor:
                        childReq.priority === "high"
                          ? "#ef4444"
                          : childReq.priority === "medium"
                            ? "#f59e0b"
                            : "#22c55e",
                    }}
                  >
                    <CardHeader className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getRequirementStatusIcon(childReq.status)}
                          <CardTitle className="text-base">{childReq.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(childReq.priority)}
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Progress value={childReq.completionPercentage} className="h-2 w-24" />
                          <span className="text-xs">{childReq.completionPercentage}%</span>
                        </div>
                        <div className="flex -space-x-2">
                          {childReq.assignees.map((userId) => {
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
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      <CardFooter className="py-2 text-xs text-muted-foreground">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <span>ID: {requirement.id}</span>
            <span>Created: {formatDate(requirement.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            {requirement.linkedItems.length > 0 && (
              <div className="flex items-center gap-1">
                <Link className="h-3 w-3" />
                <span>{requirement.linkedItems.length}</span>
              </div>
            )}
            {requirement.comments.length > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{requirement.comments.length}</span>
              </div>
            )}
            {requirement.attachments.length > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                <span>{requirement.attachments.length}</span>
              </div>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
