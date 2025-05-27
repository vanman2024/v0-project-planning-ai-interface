"use client"

import { useState } from "react"
import { ProjectsView } from "../components/projects-view"
import { TasksView } from "../components/tasks-view"
import { AgentChat } from "../components/agent-chat"
import { PlanViewer } from "../components/plan-viewer"
import { OnboardingTour } from "../components/onboarding-tour"
import { NotificationSystem } from "../components/ui/notification-system"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, Home, FolderKanban, CheckSquare, MessageSquare, Settings } from "lucide-react"

export default function Page() {
  const [currentView, setCurrentView] = useState("projects")
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  const navItems = [
    { id: "home", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { id: "projects", label: "Projects", icon: <FolderKanban className="h-5 w-5" /> },
    { id: "tasks", label: "Tasks", icon: <CheckSquare className="h-5 w-5" /> },
    { id: "chat", label: "AI Chat", icon: <MessageSquare className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="border-r w-64 h-full hidden md:block">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold">Project Planning AI</h1>
        </div>

        <div className="px-3 py-6 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setCurrentView(item.id)}
            >
              <div className="mr-2">{item.icon}</div>
              {item.label}
            </Button>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32&query=user" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Jane Doe</p>
              <p className="text-xs text-muted-foreground">jane@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white dark:bg-gray-900 w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-16 items-center border-b px-6">
              <h1 className="text-xl font-bold">Project Planning AI</h1>
            </div>

            <div className="px-3 py-6 space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    setCurrentView(item.id)
                    setMobileMenuOpen(false)
                  }}
                >
                  <div className="mr-2">{item.icon}</div>
                  {item.label}
                </Button>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 border-t p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=32&width=32&query=user" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Jane Doe</p>
                  <p className="text-xs text-muted-foreground">jane@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Top Header */}
        <header className="border-b py-3 px-4 flex items-center justify-between bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold md:hidden">
              {navItems.find((item) => item.id === currentView)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <NotificationSystem />
            <Avatar className="h-8 w-8 md:hidden">
              <AvatarImage src="/placeholder.svg?height=32&width=32&query=user" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">{renderContent()}</div>
      </div>
    </div>
  )
}
