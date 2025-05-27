"use client"

import { useState } from "react"
import { MainNavigation } from "../components/main-navigation"
import { ProjectsView } from "../components/projects-view"
import { TasksView } from "../components/tasks-view"
import { AgentChat } from "../components/agent-chat"
import { PlanViewer } from "../components/plan-viewer"
import { OnboardingTour } from "../components/onboarding-tour"

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
      <div className="flex-1 overflow-hidden">{renderContent()}</div>
    </div>
  )
}
