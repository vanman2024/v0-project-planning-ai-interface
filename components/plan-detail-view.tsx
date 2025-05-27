"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Calendar,
  Users,
  AlertCircle,
  Clock,
  Sparkles,
  Package,
  Zap,
  Target,
  Layers,
  HelpCircle,
  ChevronRight,
  Smile,
  Meh,
  Frown,
  Link,
  FileText,
  CheckSquare,
} from "lucide-react"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PlanDetailViewProps {
  item: any
  onBack: () => void
  onSelectRequirement?: (requirement: any) => void
  onSelectTask?: (task: any) => void
  onSelectFeature?: (feature: any) => void
  onSelectModule?: (module: any) => void
}

export function PlanDetailView({
  item,
  onBack,
  onSelectRequirement,
  onSelectTask,
  onSelectFeature,
  onSelectModule,
}: PlanDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Friendly type names
  const getFriendlyTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      milestone: "Major Goal 🎯",
      phase: "Project Stage 📊",
      module: "Work Package 📦",
      feature: "Feature 🎨",
      task: "To-Do Item ✅",
      subtask: "Small Step 👣",
      requirement: "Requirement 📋",
    }
    return typeMap[type] || type
  }

  // Friendly status with emoji
  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { label: string; emoji: string; color: string }> = {
      completed: { label: "All Done!", emoji: "🎉", color: "bg-green-500" },
      "in-progress": { label: "Working on it", emoji: "🚧", color: "bg-blue-500" },
      pending: { label: "Not Started", emoji: "⏳", color: "bg-gray-400" },
      blocked: { label: "Need Help!", emoji: "🚨", color: "bg-red-500" },
    }
    return statusMap[status] || { label: status, emoji: "❓", color: "bg-gray-400" }
  }

  const statusDisplay = getStatusDisplay(item.status)

  // Generate sample nested items based on the item type
  const getNestedItems = () => {
    if (item.type === "milestone") {
      return [
        {
          id: "phase-1",
          name: "Research & Planning",
          type: "phase",
          status: "completed",
          friendlyDescription: "Gather requirements and plan the approach",
          effort: "2 weeks",
          assignee: "Team",
          onClick: () =>
            onSelectModule && onSelectModule({ id: "phase-1", type: "phase", name: "Research & Planning" }),
        },
        {
          id: "phase-2",
          name: "Development",
          type: "phase",
          status: "in-progress",
          friendlyDescription: "Build the core functionality",
          effort: "6 weeks",
          assignee: "Dev Team",
          onClick: () => onSelectModule && onSelectModule({ id: "phase-2", type: "phase", name: "Development" }),
        },
        {
          id: "phase-3",
          name: "Testing & Launch",
          type: "phase",
          status: "pending",
          friendlyDescription: "Ensure quality and release",
          effort: "3 weeks",
          assignee: "QA Team",
          onClick: () => onSelectModule && onSelectModule({ id: "phase-3", type: "phase", name: "Testing & Launch" }),
        },
      ]
    } else if (item.type === "phase") {
      return [
        {
          id: "module-1",
          name: "User Authentication",
          type: "module",
          status: "completed",
          friendlyDescription: "Login, registration, and account management",
          effort: "2 weeks",
          assignee: "Auth Team",
          onClick: () =>
            onSelectModule && onSelectModule({ id: "module-1", type: "module", name: "User Authentication" }),
        },
        {
          id: "module-2",
          name: "Dashboard",
          type: "module",
          status: "in-progress",
          friendlyDescription: "Main user interface and controls",
          effort: "3 weeks",
          assignee: "UI Team",
          onClick: () => onSelectModule && onSelectModule({ id: "module-2", type: "module", name: "Dashboard" }),
        },
      ]
    } else if (item.type === "module") {
      return [
        {
          id: "feature-1",
          name: "Login Form",
          type: "feature",
          status: "completed",
          friendlyDescription: "Allow users to sign in",
          effort: "3 days",
          assignee: "Sarah",
          onClick: () => onSelectFeature && onSelectFeature({ id: "feature-1", type: "feature", name: "Login Form" }),
        },
        {
          id: "feature-2",
          name: "Registration",
          type: "feature",
          status: "completed",
          friendlyDescription: "Allow new users to create accounts",
          effort: "4 days",
          assignee: "Mike",
          onClick: () => onSelectFeature && onSelectFeature({ id: "feature-2", type: "feature", name: "Registration" }),
        },
        {
          id: "feature-3",
          name: "Password Reset",
          type: "feature",
          status: "in-progress",
          friendlyDescription: "Help users recover access",
          effort: "2 days",
          assignee: "Sarah",
          onClick: () =>
            onSelectFeature && onSelectFeature({ id: "feature-3", type: "feature", name: "Password Reset" }),
        },
      ]
    } else if (item.type === "feature") {
      return [
        {
          id: "task-1",
          name: "Design UI mockup",
          type: "task",
          status: "completed",
          friendlyDescription: "Create visual design for the feature",
          effort: "1 day",
          assignee: "Design Team",
          onClick: () => onSelectTask && onSelectTask({ id: "task-1", type: "task", name: "Design UI mockup" }),
        },
        {
          id: "task-2",
          name: "Implement frontend",
          type: "task",
          status: "completed",
          friendlyDescription: "Build the user interface",
          effort: "2 days",
          assignee: "Sarah",
          onClick: () => onSelectTask && onSelectTask({ id: "task-2", type: "task", name: "Implement frontend" }),
        },
        {
          id: "task-3",
          name: "Connect to API",
          type: "task",
          status: "in-progress",
          friendlyDescription: "Integrate with backend services",
          effort: "1 day",
          assignee: "Mike",
          onClick: () => onSelectTask && onSelectTask({ id: "task-3", type: "task", name: "Connect to API" }),
        },
        {
          id: "task-4",
          name: "Write tests",
          type: "task",
          status: "pending",
          friendlyDescription: "Ensure quality and prevent bugs",
          effort: "1 day",
          assignee: "QA Team",
          onClick: () => onSelectTask && onSelectTask({ id: "task-4", type: "task", name: "Write tests" }),
        },
      ]
    } else {
      return [
        {
          id: "subtask-1",
          name: "Create HTML structure",
          type: "subtask",
          status: "completed",
          friendlyDescription: "Build the basic layout",
          effort: "2 hours",
          assignee: "Sarah",
        },
        {
          id: "subtask-2",
          name: "Style with CSS",
          type: "subtask",
          status: "completed",
          friendlyDescription: "Make it look good",
          effort: "3 hours",
          assignee: "Sarah",
        },
        {
          id: "subtask-3",
          name: "Add JavaScript functionality",
          type: "subtask",
          status: "in-progress",
          friendlyDescription: "Make it interactive",
          effort: "4 hours",
          assignee: "Mike",
        },
      ]
    }
  }

  // Sample requirements
  const sampleRequirements = [
    {
      id: "req-1",
      name: "User Authentication",
      description: "Users must be able to create accounts and log in securely",
      status: "approved",
      priority: "high",
      onClick: () =>
        onSelectRequirement &&
        onSelectRequirement({
          id: "req-1",
          name: "User Authentication",
          type: "requirement",
        }),
    },
    {
      id: "req-2",
      name: "Responsive Design",
      description: "The application must work well on mobile devices",
      status: "approved",
      priority: "medium",
      onClick: () =>
        onSelectRequirement &&
        onSelectRequirement({
          id: "req-2",
          name: "Responsive Design",
          type: "requirement",
        }),
    },
    {
      id: "req-3",
      name: "Data Security",
      description: "All user data must be encrypted and securely stored",
      status: "approved",
      priority: "high",
      onClick: () =>
        onSelectRequirement &&
        onSelectRequirement({
          id: "req-3",
          name: "Data Security",
          type: "requirement",
        }),
    },
  ]

  // Priority breakdown with friendly names
  const priorityBreakdown = [
    {
      priority: "urgent",
      label: "🔥 Do Today",
      count: 2,
      color: "bg-red-500",
      description: "These need immediate attention",
    },
    {
      priority: "high",
      label: "⚡ This Week",
      count: 5,
      color: "bg-orange-500",
      description: "Important for this week's goals",
    },
    {
      priority: "medium",
      label: "📅 This Month",
      count: 8,
      color: "bg-yellow-500",
      description: "Should be done this month",
    },
    {
      priority: "low",
      label: "💭 When Possible",
      count: 3,
      color: "bg-green-500",
      description: "Nice to have, not urgent",
    },
  ]

  const nestedItems = getNestedItems()

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </Button>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold">{item.name}</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is a {getFriendlyTypeName(item.type).toLowerCase()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Badge variant="outline" className="text-sm">
              {getFriendlyTypeName(item.type)}
            </Badge>
          </div>

          {/* Status with emoji */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${statusDisplay.color}`} />
              <span className="text-lg font-medium">
                {statusDisplay.emoji} {statusDisplay.label}
              </span>
            </div>
            <Progress value={item.progress || 0} className="flex-1 h-3" />
            <span className="text-sm font-medium">{item.progress || 0}%</span>
          </div>
        </div>
      </div>

      {/* Tabs with friendly names */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <div className="border-b">
          <TabsList className="p-0 h-auto">
            <TabsTrigger value="overview" className="rounded-none py-2 px-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="whats-inside" className="rounded-none py-2 px-4">
              <Package className="w-4 h-4 mr-2" />
              What's Inside
            </TabsTrigger>
            <TabsTrigger value="requirements" className="rounded-none py-2 px-4">
              <FileText className="w-4 h-4 mr-2" />
              Requirements
            </TabsTrigger>
            <TabsTrigger value="priorities" className="rounded-none py-2 px-4">
              <Zap className="w-4 h-4 mr-2" />
              Priorities
            </TabsTrigger>
            <TabsTrigger value="team" className="rounded-none py-2 px-4">
              <Users className="w-4 h-4 mr-2" />
              Team
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <TabsContent value="overview" className="p-4 m-0 h-full">
            <div className="space-y-6">
              {/* Plain English Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    What We're Building
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description ||
                      "This helps users sign up and access their personal dashboard. It's the first thing new users will see!"}
                  </p>
                </CardContent>
              </Card>

              {/* Key Info in Plain English */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time Needed</p>
                        <p className="text-lg font-medium">About 2 weeks</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Team Members</p>
                        <p className="text-lg font-medium">Sarah, Mike, Alex</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* What's Blocking This */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    Waiting For
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-950 rounded">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm">Design approval from the marketing team</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-950 rounded">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm">API endpoints from the backend team</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="whats-inside" className="p-4 m-0 h-full">
            <div className="space-y-4">
              <p className="text-muted-foreground mb-4">
                Here's everything that needs to be done for this {getFriendlyTypeName(item.type).toLowerCase()}:
              </p>

              {nestedItems.map((nestedItem) => (
                <Card
                  key={nestedItem.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={nestedItem.onClick}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          {getStatusDisplay(nestedItem.status).emoji}
                          <h4 className="font-medium">{nestedItem.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{nestedItem.friendlyDescription}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {nestedItem.effort}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {nestedItem.assignee}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requirements" className="p-4 m-0 h-full">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Link className="w-5 h-5 text-blue-500" />
                    Linked Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sampleRequirements.map((req) => (
                      <div
                        key={req.id}
                        className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                        onClick={req.onClick}
                      >
                        <div className="flex items-start gap-3">
                          <CheckSquare className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">{req.name}</h4>
                            <p className="text-sm text-muted-foreground">{req.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {req.status}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  req.priority === "high"
                                    ? "border-red-200 text-red-700"
                                    : req.priority === "medium"
                                      ? "border-yellow-200 text-yellow-700"
                                      : "border-green-200 text-green-700"
                                }`}
                              >
                                {req.priority === "high"
                                  ? "🔥 High Priority"
                                  : req.priority === "medium"
                                    ? "⚡ Medium Priority"
                                    : "✓ Low Priority"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="priorities" className="p-4 m-0 h-full">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium mb-2">Work Distribution by Priority</h3>
                <p className="text-sm text-muted-foreground">Here's how urgent different parts of this project are</p>
              </div>

              {/* Visual Priority Distribution */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {priorityBreakdown.map((priority) => (
                  <Card key={priority.priority} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div
                        className={`w-12 h-12 rounded-full ${priority.color} mx-auto mb-3 flex items-center justify-center text-white font-bold`}
                      >
                        {priority.count}
                      </div>
                      <h4 className="font-medium text-sm mb-1">{priority.label}</h4>
                      <p className="text-xs text-muted-foreground">{priority.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Priority List */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Detailed Priority Breakdown
                </h4>
                {priorityBreakdown.map((priority) => (
                  <div key={priority.priority} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                      <span className="font-medium">{priority.label}</span>
                      <Badge variant="secondary">{priority.count} items</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="p-4 m-0 h-full">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Team Mood & Workload</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Sarah", mood: "happy", workload: 75, status: "Working on login form" },
                    { name: "Mike", mood: "neutral", workload: 90, status: "Needs help with API integration" },
                    { name: "Alex", mood: "happy", workload: 45, status: "Available for new tasks" },
                  ].map((member) => (
                    <div key={member.name} className="space-y-2 p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {member.mood === "happy" ? (
                              <Smile className="text-green-500" />
                            ) : member.mood === "neutral" ? (
                              <Meh className="text-yellow-500" />
                            ) : (
                              <Frown className="text-red-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.status}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Workload</p>
                          <Progress value={member.workload} className="w-20 h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
