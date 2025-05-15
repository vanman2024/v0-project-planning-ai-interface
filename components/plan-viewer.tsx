"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Check, Circle, Clock, List, Table2, Columns } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// Helper function to parse basic markdown
const parseMarkdown = (text: string): string => {
  // Handle bold text
  const boldText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  // Handle italic text
  const italicText = boldText.replace(/\*(.*?)\*/g, "<em>$1</em>")
  // Handle inline code
  const codeText = italicText.replace(/`(.*?)`/g, '<code class="px-1 py-0.5 bg-muted rounded text-sm">$1</code>')

  return codeText
}

interface PlanItem {
  id: string
  name: string
  status: "completed" | "in-progress" | "planned"
  type: "milestone" | "phase" | "module" | "feature" | "task"
  children?: PlanItem[]
  taskType?: "pre_build" | "feature" | "post_build"
}

export function PlanViewer() {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "milestone-1": true,
    "phase-1": true,
    "module-1": true,
    "feature-1": true,
  })
  const [activeView, setActiveView] = useState<"tree" | "table" | "kanban">("tree")

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const planData: PlanItem = {
    id: "milestone-1",
    name: "Milestone: MVP Release",
    status: "in-progress",
    type: "milestone",
    children: [
      {
        id: "phase-1",
        name: "Phase: Backend Development",
        status: "in-progress",
        type: "phase",
        children: [
          {
            id: "module-1",
            name: "Module: Authentication",
            status: "in-progress",
            type: "module",
            children: [
              {
                id: "feature-1",
                name: "Feature: User Registration",
                status: "completed",
                type: "feature",
                children: [
                  {
                    id: "task-1",
                    name: "Task: DB Schema",
                    status: "completed",
                    type: "task",
                    taskType: "pre_build",
                  },
                  {
                    id: "task-2",
                    name: "Task: API Endpoint",
                    status: "completed",
                    type: "task",
                    taskType: "feature",
                  },
                  {
                    id: "task-3",
                    name: "Task: Unit Tests",
                    status: "completed",
                    type: "task",
                    taskType: "post_build",
                  },
                ],
              },
              {
                id: "feature-2",
                name: "Feature: Login/Logout",
                status: "in-progress",
                type: "feature",
                children: [
                  {
                    id: "task-4",
                    name: "Task: Session Management",
                    status: "in-progress",
                    type: "task",
                    taskType: "feature",
                  },
                ],
              },
              {
                id: "feature-3",
                name: "Feature: Password Reset",
                status: "planned",
                type: "feature",
              },
            ],
          },
          {
            id: "module-2",
            name: "Module: Product Management",
            status: "planned",
            type: "module",
          },
          {
            id: "module-3",
            name: "Module: Order Processing",
            status: "planned",
            type: "module",
          },
        ],
      },
      {
        id: "phase-2",
        name: "Phase: Frontend Development",
        status: "planned",
        type: "phase",
      },
    ],
  }

  // Function to flatten the hierarchical data for table view
  const flattenPlanData = (item: PlanItem, parentPath = ""): any[] => {
    const currentPath = parentPath ? `${parentPath} > ${item.name}` : item.name
    const result = [{ ...item, path: currentPath }]

    if (item.children) {
      item.children.forEach((child) => {
        result.push(...flattenPlanData(child, currentPath))
      })
    }

    return result
  }

  const flatData = flattenPlanData(planData)

  // Function to group tasks by status for Kanban view
  const getKanbanData = () => {
    const planned = flatData.filter((item) => item.status === "planned")
    const inProgress = flatData.filter((item) => item.status === "in-progress")
    const completed = flatData.filter((item) => item.status === "completed")

    return { planned, inProgress, completed }
  }

  const kanbanData = getKanbanData()

  const renderPlanItem = (item: PlanItem, depth = 0) => {
    const isExpanded = expandedItems[item.id] || false
    const hasChildren = item.children && item.children.length > 0

    const getStatusIcon = (status: string) => {
      switch (status) {
        case "completed":
          return <Check className="h-4 w-4 text-green-500" />
        case "in-progress":
          return <Clock className="h-4 w-4 text-blue-500" />
        default:
          return <Circle className="h-4 w-4 text-gray-400" />
      }
    }

    const getTaskTypeBadge = (taskType?: string) => {
      if (!taskType) return null

      switch (taskType) {
        case "pre_build":
          return (
            <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200">
              Pre-Build
            </Badge>
          )
        case "feature":
          return (
            <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
              Feature
            </Badge>
          )
        case "post_build":
          return (
            <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-800 border-purple-200">
              Post-Build
            </Badge>
          )
        default:
          return null
      }
    }

    return (
      <div key={item.id} className="ml-4" style={{ marginLeft: `${depth * 1.5}rem` }}>
        <div
          className="flex items-center py-2 cursor-pointer hover:bg-muted/50 rounded-md px-2"
          onClick={() => hasChildren && toggleItem(item.id)}
        >
          {hasChildren && (
            <div className="mr-1">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          )}
          <div className="mr-2">{getStatusIcon(item.status)}</div>
          <div className="flex-1 flex items-center">
            <span className="font-medium" dangerouslySetInnerHTML={{ __html: parseMarkdown(item.name) }} />
            {item.taskType && getTaskTypeBadge(item.taskType)}
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="border-l border-muted ml-2 pl-2">
            {item.children?.map((child) => renderPlanItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>Plan Structure</CardTitle>
        <ToggleGroup type="single" value={activeView} onValueChange={(value) => setActiveView(value as any)}>
          <ToggleGroupItem value="tree" aria-label="Tree View">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="table" aria-label="Table View">
            <Table2 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="kanban" aria-label="Kanban View">
            <Columns className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        {activeView === "tree" && renderPlanItem(planData)}

        {activeView === "table" && (
          <div className="overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Name</th>
                  <th className="text-left py-2 px-4">Type</th>
                  <th className="text-left py-2 px-4">Status</th>
                  <th className="text-left py-2 px-4">Path</th>
                </tr>
              </thead>
              <tbody>
                {flatData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-4" dangerouslySetInnerHTML={{ __html: parseMarkdown(item.name) }} />
                    <td className="py-2 px-4 capitalize">{item.type}</td>
                    <td className="py-2 px-4">
                      <div className="flex items-center">
                        {item.status === "completed" && <Check className="h-4 w-4 text-green-500 mr-2" />}
                        {item.status === "in-progress" && <Clock className="h-4 w-4 text-blue-500 mr-2" />}
                        {item.status === "planned" && <Circle className="h-4 w-4 text-gray-400 mr-2" />}
                        <span className="capitalize">{item.status}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-sm text-muted-foreground">{item.path}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeView === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <Circle className="h-4 w-4 text-gray-400 mr-2" />
                Planned ({kanbanData.planned.length})
              </h3>
              <div className="space-y-2">
                {kanbanData.planned.map((item) => (
                  <div key={item.id} className="border rounded-md p-3 bg-background shadow-sm">
                    <div className="font-medium" dangerouslySetInnerHTML={{ __html: parseMarkdown(item.name) }} />
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="outline" className="capitalize">
                        {item.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <Clock className="h-4 w-4 text-blue-500 mr-2" />
                In Progress ({kanbanData.inProgress.length})
              </h3>
              <div className="space-y-2">
                {kanbanData.inProgress.map((item) => (
                  <div key={item.id} className="border rounded-md p-3 bg-background shadow-sm">
                    <div className="font-medium" dangerouslySetInnerHTML={{ __html: parseMarkdown(item.name) }} />
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="outline" className="capitalize">
                        {item.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Completed ({kanbanData.completed.length})
              </h3>
              <div className="space-y-2">
                {kanbanData.completed.map((item) => (
                  <div key={item.id} className="border rounded-md p-3 bg-background shadow-sm">
                    <div className="font-medium" dangerouslySetInnerHTML={{ __html: parseMarkdown(item.name) }} />
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="outline" className="capitalize">
                        {item.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
