"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ChevronRight,
  ChevronDown,
  Target,
  Package,
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Calendar,
  FileText,
} from "lucide-react"
import { PlanDetailView } from "./plan-detail-view"
import { RequirementDetailView } from "./requirement-detail-view"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ProjectHealthScore } from "./project-health-score"
import { QuickStatusUpdate } from "./quick-status-update"
import { ProjectJourney } from "./project-journey"
import { SmartSuggestions } from "./smart-suggestions"

export function PlanViewer() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["milestone-1"]))
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [selectedRequirement, setSelectedRequirement] = useState<any>(null)

  // Friendly type mapping
  const typeConfig = {
    milestone: {
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      friendlyName: "Major Goal",
      description: "A big achievement in your project",
    },
    phase: {
      icon: Layers,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      friendlyName: "Project Stage",
      description: "A major phase of work",
    },
    module: {
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      friendlyName: "Work Package",
      description: "A group of related features",
    },
    feature: {
      icon: Sparkles,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      friendlyName: "Feature",
      description: "Something users can do",
    },
    task: {
      icon: CheckCircle2,
      color: "text-gray-600",
      bgColor: "bg-gray-50 dark:bg-gray-950",
      friendlyName: "To-Do",
      description: "A specific task to complete",
    },
  }

  // Sample data with friendly names
  const planData = {
    id: "root",
    name: "Coffee Shop Mobile App",
    type: "project",
    status: "in-progress",
    progress: 35,
    children: [
      {
        id: "milestone-1",
        name: "Launch MVP",
        type: "milestone",
        status: "in-progress",
        progress: 45,
        dueDate: "Dec 25, 2024",
        description: "Get the first version live for customers",
        children: [
          {
            id: "phase-1",
            name: "Foundation Setup",
            type: "phase",
            status: "completed",
            progress: 100,
            description: "Get all the basics in place",
            children: [
              {
                id: "module-1",
                name: "User Accounts",
                type: "module",
                status: "completed",
                progress: 100,
                description: "Let people create accounts and log in",
                children: [
                  {
                    id: "feature-1",
                    name: "Sign Up Flow",
                    type: "feature",
                    status: "completed",
                    progress: 100,
                    description: "New users can create an account",
                  },
                  {
                    id: "feature-2",
                    name: "Login Screen",
                    type: "feature",
                    status: "completed",
                    progress: 100,
                    description: "Existing users can sign in",
                  },
                ],
              },
            ],
          },
          {
            id: "phase-2",
            name: "Core Features",
            type: "phase",
            status: "in-progress",
            progress: 60,
            description: "Build the main app features",
            children: [
              {
                id: "module-2",
                name: "Menu & Ordering",
                type: "module",
                status: "in-progress",
                progress: 75,
                description: "Show coffee menu and take orders",
                children: [
                  {
                    id: "feature-3",
                    name: "Browse Menu",
                    type: "feature",
                    status: "completed",
                    progress: 100,
                    description: "See all available drinks and food",
                  },
                  {
                    id: "feature-4",
                    name: "Add to Cart",
                    type: "feature",
                    status: "in-progress",
                    progress: 50,
                    description: "Select items and customize them",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "blocked":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      completed: "Done! 🎉",
      "in-progress": "Working on it 🚧",
      pending: "Not started ⏳",
      blocked: "Need help! 🚨",
    }
    return labels[status] || status
  }

  const renderPlanItem = (item: any, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const config = typeConfig[item.type as keyof typeof typeConfig]

    if (!config) return null

    const Icon = config.icon

    return (
      <div key={item.id} className={`${level > 0 ? "ml-6" : ""}`}>
        <Card
          className={`mb-3 hover:shadow-md transition-all cursor-pointer ${config.bgColor}`}
          onClick={() => setSelectedItem(item)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {hasChildren && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleExpand(item.id)
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                )}

                <Icon className={`w-5 h-5 ${config.color}`} />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{item.name}</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="outline" className="text-xs">
                            {config.friendlyName}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{config.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {item.dueDate && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.dueDate}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <span className="text-sm">{getStatusLabel(item.status)}</span>
                </div>

                {item.progress !== undefined && (
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <Progress value={item.progress} className="h-2" />
                    <span className="text-sm font-medium">{item.progress}%</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {hasChildren && isExpanded && (
          <div className="mb-3">{item.children.map((child: any) => renderPlanItem(child, level + 1))}</div>
        )}
      </div>
    )
  }

  if (selectedRequirement) {
    return <RequirementDetailView requirement={selectedRequirement} onBack={() => setSelectedRequirement(null)} />
  }

  if (selectedItem) {
    return (
      <PlanDetailView
        item={selectedItem}
        onBack={() => setSelectedItem(null)}
        onSelectRequirement={setSelectedRequirement}
        onSelectTask={(task) => setSelectedItem({ ...task, progress: 50 })}
        onSelectFeature={(feature) => setSelectedItem({ ...feature, progress: 75 })}
        onSelectModule={(module) => setSelectedItem({ ...module, progress: 60 })}
      />
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-2xl font-bold mb-2">Your Project Plan 🗺️</h2>
        <p className="text-muted-foreground">Click on any item to see more details and manage your work</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <ProjectHealthScore />
          <ProjectJourney />
        </div>

        <div className="mb-6">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{planData.name}</h3>
                  <p className="text-muted-foreground">Overall Progress</p>
                </div>
                <div className="text-3xl font-bold text-blue-600">{planData.progress}%</div>
              </div>
              <Progress value={planData.progress} className="h-3" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <QuickStatusUpdate
            taskName="Landing Page Design"
            onStatusUpdate={(status) => console.log(`Status updated: ${status}`)}
          />
          <SmartSuggestions />
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Project Breakdown
          </h3>
        </div>

        {planData.children.map((child) => renderPlanItem(child))}
      </div>
    </div>
  )
}
