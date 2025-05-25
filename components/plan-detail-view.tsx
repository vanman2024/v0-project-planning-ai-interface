"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, AlertTriangle, Briefcase, CalendarDays, ListIcon as ListBullet } from "lucide-react"
import { TaskDetailView, type TaskDetail } from "./task-detail-view"

// Mock plan data
const mockPlan = {
  id: "plan1",
  name: "Q3 2024 Product Roadmap",
  description: "A detailed plan for the product roadmap in Q3 2024.",
  startDate: "2024-07-01",
  endDate: "2024-09-30",
  status: "active",
  team: "Product Development",
  createdBy: "user1",
  createdAt: "2024-06-15T10:00:00Z",
  updatedAt: "2024-06-20T15:30:00Z",
  tasks: ["task1", "task2", "task3", "task4", "task5"],
  requirements: ["req1", "req2"],
}

// Mock requirements data
const mockRequirements = [
  {
    id: "req1",
    name: "User Authentication",
    description: "Implement secure user authentication and authorization.",
    status: "approved",
    priority: "high",
    createdBy: "user1",
    createdAt: "2024-06-10T09:00:00Z",
    updatedAt: "2024-06-12T14:00:00Z",
  },
  {
    id: "req2",
    name: "Database Encryption",
    description: "Encrypt sensitive data stored in the database.",
    status: "approved",
    priority: "high",
    createdBy: "user1",
    createdAt: "2024-06-10T09:00:00Z",
    updatedAt: "2024-06-12T14:00:00Z",
  },
]

// Mock tasks data for testing
const mockTasks: TaskDetail[] = [
  {
    id: "task1",
    name: "Implement user authentication",
    description: "Create login and registration functionality with JWT token support",
    status: "completed",
    type: "task",
    priority: "high",
    assignees: ["user2"],
    dueDate: "2024-05-15",
    startDate: "2024-05-01",
    estimatedHours: 16,
    actualHours: 14,
    tags: ["frontend", "security"],
    dependencies: [],
    requirements: ["req1"],
    createdAt: "2024-04-28T10:00:00Z",
    updatedAt: "2024-05-10T15:30:00Z",
    createdBy: "user1",
  },
  {
    id: "task2",
    name: "Design database schema",
    description: "Create the database schema for user data and content",
    status: "completed",
    type: "task",
    priority: "high",
    assignees: ["user2"],
    dueDate: "2024-05-10",
    startDate: "2024-05-01",
    estimatedHours: 8,
    actualHours: 10,
    tags: ["database", "architecture"],
    dependencies: [],
    requirements: ["req2"],
    createdAt: "2024-04-28T10:00:00Z",
    updatedAt: "2024-05-08T11:20:00Z",
    createdBy: "user1",
  },
  {
    id: "task3",
    name: "Implement database encryption",
    description: "Add encryption for sensitive user data in the database",
    status: "in-progress",
    type: "task",
    priority: "high",
    assignees: ["user2"],
    dueDate: "2024-05-20",
    startDate: "2024-05-11",
    estimatedHours: 12,
    actualHours: 6,
    tags: ["database", "security"],
    dependencies: ["task2"],
    requirements: ["req2"],
    createdAt: "2024-05-09T09:00:00Z",
    updatedAt: "2024-05-15T14:00:00Z",
    createdBy: "user1",
  },
  {
    id: "task4",
    name: "Configure TLS for API endpoints",
    description: "Set up TLS for all API communications",
    status: "completed",
    type: "task",
    priority: "medium",
    assignees: ["user2"],
    dueDate: "2024-05-12",
    startDate: "2024-05-08",
    estimatedHours: 4,
    actualHours: 3,
    tags: ["security", "devops"],
    dependencies: [],
    requirements: ["req2"],
    createdAt: "2024-05-07T11:00:00Z",
    updatedAt: "2024-05-12T10:30:00Z",
    createdBy: "user1",
  },
  {
    id: "task5",
    name: "Implement OAuth providers",
    description: "Add support for Google and GitHub OAuth login",
    status: "in-progress",
    type: "task",
    priority: "medium",
    assignees: ["user2", "user4"],
    dueDate: "2024-05-25",
    startDate: "2024-05-15",
    estimatedHours: 12,
    actualHours: 5,
    tags: ["frontend", "security"],
    dependencies: ["task1"],
    requirements: ["req1"],
    createdAt: "2024-05-14T09:30:00Z",
    updatedAt: "2024-05-18T16:00:00Z",
    createdBy: "user1",
  },
]

const PlanDetailView: React.FC = () => {
  const [activeTab, setActiveTab] = useState("details")
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<TaskDetail | null>(null)

  const associatedTasks = mockTasks.filter((task) => mockPlan.tasks.includes(task.id))
  const associatedRequirements = mockRequirements.filter((req) => mockPlan.requirements.includes(req.id))

  const handleTaskClick = (task: TaskDetail) => {
    setSelectedTask(task)
    setIsTaskDetailOpen(true)
  }

  return (
    <div className="container mx-auto mt-8">
      <Card className="shadow-md">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{mockPlan.name}</h2>

          <Tabs defaultValue="details" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-700">Plan Overview</h3>
                <p className="text-gray-600 mb-4">{mockPlan.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <CalendarDays className="h-5 w-5 mr-2 text-gray-500" />
                        <span className="font-medium text-gray-700">Timeline</span>
                      </div>
                      <p className="text-gray-600">
                        {new Date(mockPlan.startDate).toLocaleDateString()} -{" "}
                        {new Date(mockPlan.endDate).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <Briefcase className="h-5 w-5 mr-2 text-gray-500" />
                        <span className="font-medium text-gray-700">Team</span>
                      </div>
                      <p className="text-gray-600">{mockPlan.team}</p>
                    </CardContent>
                  </Card>
                </div>

                <h3 className="text-lg font-medium text-gray-700 mt-6">Associated Tasks</h3>
                <div className="mt-2 space-y-2">
                  {associatedTasks.map((task) => (
                    <Card
                      key={task.id}
                      className="border-l-4 hover:shadow-md transition-shadow cursor-pointer"
                      style={{
                        borderLeftColor:
                          task.priority === "high" ? "#ef4444" : task.priority === "medium" ? "#f59e0b" : "#22c55e",
                      }}
                      onClick={() => handleTaskClick(task)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          {task.status === "completed" ? (
                            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                          ) : task.status === "in-progress" ? (
                            <Clock className="h-5 w-5 mr-2 text-blue-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                          )}
                          <span className="text-gray-800">{task.name}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <h3 className="text-lg font-medium text-gray-700 mt-6">Requirements</h3>
                <div className="mt-2 space-y-2">
                  {associatedRequirements.map((req) => (
                    <Card key={req.id} className="mb-2">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                          <ListBullet className="h-5 w-5 mr-2 text-gray-500" />
                          <span className="font-medium text-gray-700">{req.name}</span>
                        </div>
                        <p className="text-gray-600">{req.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mt-6">Recent Activity</h3>
                <p className="text-gray-600 mb-4">No recent activity to display.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Task Detail View */}
      <TaskDetailView
        isOpen={isTaskDetailOpen}
        onClose={() => {
          setIsTaskDetailOpen(false)
          setSelectedTask(null)
        }}
        task={selectedTask}
        allTasks={mockTasks}
      />
    </div>
  )
}

export { PlanDetailView }
