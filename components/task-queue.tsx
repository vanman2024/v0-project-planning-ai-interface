"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Clock, AlertCircle, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTrash } from "@/contexts/trash-context"

interface Task {
  id: string
  name: string
  status: "completed" | "in-progress" | "blocked" | "planned"
  type: "pre_build" | "feature" | "post_build"
  linkedRequirements?: string[]
}

export function TaskQueue() {
  const { addToTrash } = useTrash()
  const [activeTab, setActiveTab] = useState("all")

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      name: "Setup DB Schema",
      status: "completed",
      type: "pre_build",
      linkedRequirements: ["req-1"],
    },
    {
      id: "task-2",
      name: "Config CI Pipeline",
      status: "completed",
      type: "pre_build",
      linkedRequirements: ["req-1"],
    },
    {
      id: "task-3",
      name: "Dev Environment",
      status: "completed",
      type: "pre_build",
    },
    {
      id: "task-4",
      name: "Auth API Routes",
      status: "in-progress",
      type: "feature",
      linkedRequirements: ["req-2"],
    },
    {
      id: "task-5",
      name: "Product CRUD",
      status: "in-progress",
      type: "feature",
    },
    {
      id: "task-6",
      name: "Order Workflow",
      status: "in-progress",
      type: "feature",
    },
    {
      id: "task-7",
      name: "User Permissions",
      status: "blocked",
      type: "feature",
    },
    {
      id: "task-8",
      name: "Integration Tests",
      status: "planned",
      type: "post_build",
    },
    {
      id: "task-9",
      name: "API Documentation",
      status: "planned",
      type: "post_build",
    },
    {
      id: "task-10",
      name: "Deployment Scripts",
      status: "planned",
      type: "post_build",
    },
  ])

  const handleDeleteTask = (task: Task) => {
    // Remove from active tasks
    setTasks(tasks.filter((t) => t.id !== task.id))

    // Add to trash
    addToTrash({
      id: task.id,
      title: task.name,
      type: "task",
      originalData: task,
    })
  }

  const filteredTasks = activeTab === "all" ? tasks : tasks.filter((task) => task.type === activeTab)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "blocked":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full border border-gray-300" />
    }
  }

  const getTypeCount = (type: string) => {
    return tasks.filter((task) => task.type === type).length
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Task Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All Tasks ({tasks.length})</TabsTrigger>
            <TabsTrigger value="pre_build">Pre-Build ({getTypeCount("pre_build")})</TabsTrigger>
            <TabsTrigger value="feature">Feature ({getTypeCount("feature")})</TabsTrigger>
            <TabsTrigger value="post_build">Post-Build ({getTypeCount("post_build")})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredTasks.map((task) => (
                <div key={task.id} className="flex items-center p-2 border rounded-md hover:bg-muted/50 cursor-pointer">
                  <div className="mr-2">{getStatusIcon(task.status)}</div>
                  <div className="flex-1">
                    <div>{task.name}</div>
                    {task.linkedRequirements && task.linkedRequirements.length > 0 && (
                      <div className="text-xs text-muted-foreground flex items-center mt-1">
                        <Link className="h-3 w-3 mr-1" />
                        {task.linkedRequirements.length} requirement{task.linkedRequirements.length !== 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
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
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
