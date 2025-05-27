"use client"

import { useState } from "react"
import { MainNavigation } from "../components/main-navigation"
import { ProjectsView } from "../components/projects-view"
import { TasksView } from "../components/tasks-view"
import { AgentChat } from "../components/agent-chat"
import { PlanViewer } from "../components/plan-viewer"
import { OnboardingTour } from "../components/onboarding-tour"
import { NotificationSystem } from "../components/notification-system"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Page() {
  const [currentView, setCurrentView] = useState("projects")
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [showOnboarding, setShowOnboarding] = useState(false) // Changed to false to bypass onboarding

  const renderContent = () => {
    if (selectedProject) {
      return <PlanViewer />
    }

    if (selectedTask) {
      return <div>Task Detail View</div>
    }

    switch (currentView) {
      case "home":
        return <div className="p-4">Home Dashboard</div>
      case "projects":
        return <ProjectsView onSelectProject={(project) => setSelectedProject(project)} />
      case "tasks":
        return <TasksView onSelectTask={(task) => setSelectedTask(task)} />
      case "chat":
        return <AgentChat />
      case "settings":
        return <div className="p-4">Settings</div>
      default:
        return <ProjectsView onSelectProject={(project) => setSelectedProject(project)} />
    }
  }

  const handleBack = () => {
    if (selectedProject) {
      setSelectedProject(null)
      return
    }

    if (selectedTask) {
      setSelectedTask(null)
      return
    }
  }

  // Only show onboarding if state is true
  if (showOnboarding) {
    return <OnboardingTour onComplete={() => setShowOnboarding(false)} />
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <MainNavigation currentView={currentView} onChangeView={setCurrentView} />
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="border-b p-2 flex items-center justify-between">
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Icons.menu className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <NotificationSystem />
            <div className="md:hidden">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32&query=user" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto">{renderContent()}</div>
      </div>
    </div>
  )
}
