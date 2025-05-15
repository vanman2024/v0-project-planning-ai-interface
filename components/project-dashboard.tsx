"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "./app-sidebar"
import { PhaseNavigator } from "./phase-navigator"
import { PlanViewer } from "./plan-viewer"
import { TaskQueue } from "./task-queue"
import { AgentConsole } from "./agent-console"
import { DocumentationTabs } from "./documentation-tabs"
import { RequirementsManager } from "./requirements-manager"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Search, X, Plus, ArrowLeft, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectSearchResults } from "./project-search-results"
import { ProjectCard } from "./project-card"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTrash } from "@/contexts/trash-context"
import { TrashManager } from "./trash-manager"
import { ResourceBrowser } from "./resource-browser"

interface Project {
  id: string
  name: string
  description: string
  techStack?: string[]
  filesCount: number
  reposCount: number
  createdAt: string
}

export function ProjectDashboard() {
  const router = useRouter()
  const {
    trashItems,
    openTrashManager,
    closeTrashManager,
    isTrashManagerOpen,
    restoreItems,
    permanentlyDeleteItems,
    emptyTrash,
  } = useTrash()
  const [currentPhase, setCurrentPhase] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Mock project stats for the enhanced PhaseNavigator
  const projectStats = {
    phases: [
      {
        name: "Phase 1: Planning",
        progress: 100,
        status: "completed" as const,
        items: {
          total: 12,
          completed: 12,
        },
      },
      {
        name: "Phase 2: Tasks",
        progress: 65,
        status: "in-progress" as const,
        items: {
          total: 20,
          completed: 13,
        },
      },
      {
        name: "Phase 3: Review",
        progress: 0,
        status: "not-started" as const,
        items: {
          total: 8,
          completed: 0,
        },
      },
      {
        name: "Phase 4: Build",
        progress: 0,
        status: "not-started" as const,
        items: {
          total: 25,
          completed: 0,
        },
      },
      {
        name: "Phase 5: Deploy",
        progress: 0,
        status: "not-started" as const,
        items: {
          total: 10,
          completed: 0,
        },
      },
    ],
  }

  // Mock projects data - in a real app, this would come from an API
  const mockProjects: Project[] = [
    {
      id: "1",
      name: "E-Commerce Platform",
      description: "A full-featured e-commerce platform with product management and checkout",
      techStack: ["React", "Node.js", "MongoDB"],
      filesCount: 12,
      reposCount: 2,
      createdAt: "2023-05-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Task Management App",
      description: "A collaborative task management application with real-time updates",
      techStack: ["Vue", "Express", "PostgreSQL"],
      filesCount: 8,
      reposCount: 1,
      createdAt: "2023-06-22T14:45:00Z",
    },
    {
      id: "3",
      name: "Portfolio Website",
      description: "A personal portfolio website with project showcase and contact form",
      techStack: ["Next.js", "Tailwind CSS"],
      filesCount: 5,
      reposCount: 1,
      createdAt: "2023-07-10T09:15:00Z",
    },
    {
      id: "4",
      name: "Social Media Dashboard",
      description: "Analytics dashboard for social media performance tracking",
      techStack: ["React", "D3.js", "Firebase"],
      filesCount: 15,
      reposCount: 3,
      createdAt: "2023-08-05T16:20:00Z",
    },
  ]

  useEffect(() => {
    // Simulate API call to fetch projects
    setIsLoading(true)
    setTimeout(() => {
      setProjects(mockProjects)
      setIsLoading(false)
    }, 500)
  }, [])

  const handleCreateProject = () => {
    router.push("/create-project")
  }

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project)
  }

  const handleBackToProjects = () => {
    setSelectedProject(null)
  }

  const handleTrashManagerActions = {
    onRestoreItems: (items: any[]) => {
      // Handle restoring items based on their type
      items.forEach((item) => {
        if (item.type === "requirement") {
          // Logic to restore requirements is in the RequirementsManager component
        } else if (item.type === "task") {
          // Logic to restore tasks
        }
      })

      // Call the context's restore function
      restoreItems(items)
    },
    onPermanentDelete: (items: any[]) => {
      permanentlyDeleteItems(items)
    },
    onEmptyTrash: () => {
      emptyTrash()
    },
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          {selectedProject ? (
            <>
              <Button variant="ghost" size="sm" onClick={handleBackToProjects} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <h1 className="text-xl font-semibold">{selectedProject.name}</h1>
            </>
          ) : (
            <h1 className="text-xl font-semibold">DevLoop Dashboard</h1>
          )}

          <div className="ml-auto flex items-center gap-2">
            {trashItems.length > 0 && (
              <Button variant="outline" size="sm" onClick={openTrashManager}>
                <Trash2 className="h-4 w-4 mr-1" />
                Trash ({trashItems.length})
              </Button>
            )}
            <div className="relative w-64">
              <Input
                type="search"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          </div>
        </header>
        <div className="flex flex-col gap-4 p-4">
          {searchQuery.trim() ? (
            <ProjectSearchResults searchQuery={searchQuery} onClearSearch={() => setSearchQuery("")} />
          ) : selectedProject ? (
            // Project Detail View
            <>
              <PhaseNavigator currentPhase={currentPhase} onPhaseChange={setCurrentPhase} projectStats={projectStats} />

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="documentation">Documentation</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <PlanViewer />
                      <div className="mt-4">
                        <TaskQueue />
                      </div>
                    </div>
                    <div>
                      <AgentConsole />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="requirements" className="mt-4">
                  <RequirementsManager projectId={selectedProject.id} />
                </TabsContent>

                <TabsContent value="resources" className="mt-4">
                  <ResourceBrowser projectId={selectedProject.id} />
                </TabsContent>

                <TabsContent value="documentation" className="mt-4">
                  <DocumentationTabs />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            // Projects Grid View
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your Projects</h2>
                <Button onClick={handleCreateProject}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
                  ))}
                </div>
              ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={{
                        id: project.id,
                        name: project.name,
                        description: project.description,
                        filesCount: project.filesCount,
                        reposCount: project.reposCount,
                        createdAt: project.createdAt,
                      }}
                      onClick={() => handleSelectProject(project)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Create your first project by uploading files or importing from GitHub.
                  </p>
                  <Button onClick={handleCreateProject}>Create Project</Button>
                </div>
              )}
            </>
          )}
        </div>
      </SidebarInset>

      {/* Trash Manager */}
      <TrashManager
        isOpen={isTrashManagerOpen}
        onClose={closeTrashManager}
        trashItems={trashItems}
        onRestoreItems={handleTrashManagerActions.onRestoreItems}
        onPermanentDelete={handleTrashManagerActions.onPermanentDelete}
        onEmptyTrash={handleTrashManagerActions.onEmptyTrash}
      />
    </SidebarProvider>
  )
}
