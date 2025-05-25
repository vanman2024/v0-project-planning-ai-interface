"use client"

import type React from "react"
import { useState } from "react"
import { Card, Typography, Tabs, Tab } from "@material-tailwind/react"
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  ListBulletIcon,
} from "@heroicons/react/24/solid"
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

// Mock tasks data
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
      <Card className="p-6 shadow-md">
        <Typography variant="h5" color="blue-gray" className="mb-4">
          {mockPlan.name}
        </Typography>

        <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
          <Tab value="details" label="Details">
            <div className="mt-6">
              <Typography variant="h6" color="blue-gray">
                Plan Overview
              </Typography>
              <Typography color="gray" className="mb-4">
                {mockPlan.description}
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center mb-2">
                    <CalendarDaysIcon className="h-5 w-5 mr-2 text-blue-gray-500" />
                    <Typography variant="subtitle1" color="blue-gray">
                      Timeline
                    </Typography>
                  </div>
                  <Typography color="gray">
                    {new Date(mockPlan.startDate).toLocaleDateString()} -{" "}
                    {new Date(mockPlan.endDate).toLocaleDateString()}
                  </Typography>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center mb-2">
                    <BriefcaseIcon className="h-5 w-5 mr-2 text-blue-gray-500" />
                    <Typography variant="subtitle1" color="blue-gray">
                      Team
                    </Typography>
                  </div>
                  <Typography color="gray">{mockPlan.team}</Typography>
                </Card>
              </div>

              <Typography variant="h6" color="blue-gray" className="mt-6">
                Associated Tasks
              </Typography>
              <div className="mt-2">
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
                    <div className="flex items-center p-4">
                      {task.status === "completed" ? (
                        <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
                      ) : task.status === "in-progress" ? (
                        <ClockIcon className="h-5 w-5 mr-2 text-blue-500" />
                      ) : (
                        <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
                      )}
                      <Typography variant="body1" color="blue-gray">
                        {task.name}
                      </Typography>
                    </div>
                  </Card>
                ))}
              </div>

              <Typography variant="h6" color="blue-gray" className="mt-6">
                Requirements
              </Typography>
              <div className="mt-2">
                {associatedRequirements.map((req) => (
                  <Card key={req.id} className="p-4 mb-2">
                    <div className="flex items-center mb-2">
                      <ListBulletIcon className="h-5 w-5 mr-2 text-blue-gray-500" />
                      <Typography variant="subtitle1" color="blue-gray">
                        {req.name}
                      </Typography>
                    </div>
                    <Typography color="gray">{req.description}</Typography>
                  </Card>
                ))}
              </div>
            </div>
          </Tab>
          <Tab value="activity" label="Activity" className="ml-2">
            <div>
              <Typography variant="h6" color="blue-gray" className="mt-6">
                Recent Activity
              </Typography>
              <Typography color="gray" className="mb-4">
                No recent activity to display.
              </Typography>
            </div>
          </Tab>
        </Tabs>
      </Card>

      {/* Task Detail View */}
      <TaskDetailView
        isOpen={isTaskDetailOpen}
        onClose={() => setIsTaskDetailOpen(false)}
        task={selectedTask}
        allTasks={mockTasks || []} // Ensure we always pass an array, even if empty
      />
    </div>
  )
}

export default PlanDetailView
