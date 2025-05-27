"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  PlusCircle,
  Search,
  CheckSquare,
  Calendar,
  Tag,
  Filter,
  SortAsc,
  MoreHorizontal,
  AlertCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TasksViewProps {
  onSelectTask: (task: any) => void
}

export function TasksView({ onSelectTask }: TasksViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTaskName, setNewTaskName] = useState("")
  const [newTaskProject, setNewTaskProject] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Sample tasks data
  const tasks = [
    {
      id: "task-1",
      name: "Design login screen",
      project: "Coffee Shop Mobile App",
      dueDate: "Oct 15, 2024",
      priority: "high",
      status: "in-progress",
      isCompleted: false,
    },
    {
      id: "task-2",
      name: "Implement user authentication",
      project: "Coffee Shop Mobile App",
      dueDate: "Oct 20, 2024",
      priority: "high",
      status: "in-progress",
      isCompleted: false,
    },
    {
      id: "task-3",
      name: "Create homepage mockup",
      project: "Company Website Redesign",
      dueDate: "Oct 12, 2024",
      priority: "medium",
      status: "in-progress",
      isCompleted: false,
    },
    {
      id: "task-4",
      name: "Write content for about page",
      project: "Company Website Redesign",
      dueDate: "Oct 18, 2024",
      priority: "low",
      status: "pending",
      isCompleted: false,
    },
    {
      id: "task-5",
      name: "Set up database schema",
      project: "Inventory Management System",
      dueDate: "Oct 5, 2024",
      priority: "high",
      status: "completed",
      isCompleted: true,
    },
    {
      id: "task-6",
      name: "Create API endpoints",
      project: "Inventory Management System",
      dueDate: "Oct 10, 2024",
      priority: "medium",
      status: "in-progress",
      isCompleted: false,
    },
    {
      id: "task-7",
      name: "Design product listing page",
      project: "Inventory Management System",
      dueDate: "Oct 15, 2024",
      priority: "medium",
      status: "pending",
      isCompleted: false,
    },
  ]

  // Sample projects for dropdown
  const projects = [
    { id: "project-1", name: "Coffee Shop Mobile App" },
    { id: "project-2", name: "Company Website Redesign" },
    { id: "project-3", name: "Inventory Management System" },
    { id: "project-4", name: "Customer Support Portal" },
    { id: "project-5", name: "Marketing Campaign Automation" },
  ]

  // Filter tasks based on search query and active tab
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "today") {
      // This would normally check if the due date is today
      return matchesSearch && task.dueDate === "Oct 5, 2024"
    }
    if (activeTab === "upcoming") {
      // This would normally check if the due date is in the future
      return matchesSearch && !task.isCompleted
    }
    if (activeTab === "completed") return matchesSearch && task.isCompleted

    return matchesSearch
  })

  const handleCreateTask = () => {
    // In a real app, this would create a new task
    console.log("Creating task:", { name: newTaskName, project: newTaskProject })
    setIsCreateDialogOpen(false)
    setNewTaskName("")
    setNewTaskProject("")
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none">🔥 High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-none">⚡ Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">✓ Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Your Tasks ✅</h1>
            <p className="text-muted-foreground">Manage your to-do list across all projects</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>Add a new task to your to-do list.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-name">Task Name</Label>
                    <Input
                      id="task-name"
                      placeholder="What needs to be done?"
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-project">Project</Label>
                    <Select value={newTaskProject} onValueChange={setNewTaskProject}>
                      <SelectTrigger id="task-project">
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask}>Create Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </div>

        <div className="p-4 border-b flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <SortAsc className="mr-2 h-4 w-4" />
              Sort
            </Button>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">Showing {filteredTasks.length} tasks</div>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <CheckSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try a different search term" : "Add your first task to get started"}
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Task
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <Card
                  key={task.id}
                  className={`hover:shadow-md transition-shadow ${
                    task.isCompleted ? "bg-gray-50 dark:bg-gray-900" : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox id={`task-${task.id}`} checked={task.isCompleted} className="mt-1" />
                      <div className="flex-1 min-w-0" onClick={() => onSelectTask(task)}>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className={`font-medium ${task.isCompleted ? "line-through text-muted-foreground" : ""}`}
                          >
                            {task.name}
                          </span>
                          {getPriorityBadge(task.priority)}
                          {task.status === "in-progress" && (
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-none"
                            >
                              🚧 In Progress
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Tag className="h-3.5 w-3.5" />
                            {task.project}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {task.dueDate}
                          </span>
                          {task.dueDate === "Oct 5, 2024" && !task.isCompleted && (
                            <span className="flex items-center gap-1 text-red-600">
                              <AlertCircle className="h-3.5 w-3.5" />
                              Due today
                            </span>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Task</DropdownMenuItem>
                          <DropdownMenuItem>Change Priority</DropdownMenuItem>
                          <DropdownMenuItem>Move to Project</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete Task</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  )
}
