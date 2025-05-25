"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define types for our project data
interface ProjectMetadata {
  id: string
  name: string
  description: string
  techStack: string[]
  stage: string
  createdAt: string
  updatedAt: string
}

interface Feature {
  id: string
  name: string
  description: string
  status: "planned" | "in-progress" | "completed"
}

interface Task {
  id: string
  name: string
  description: string
  status: "todo" | "in-progress" | "done"
  featureId?: string
}

interface Document {
  id: string
  title: string
  content: string
  type: "requirements" | "design" | "technical" | "user"
}

interface ProjectData {
  metadata: ProjectMetadata
  features: Feature[]
  tasks: Task[]
  documents: Document[]
}

interface ProjectContextType {
  currentProject: ProjectData | null
  setCurrentProject: (project: ProjectData) => void
  updateProjectMetadata: (metadata: Partial<ProjectMetadata>) => void
  addFeature: (feature: Feature) => void
  updateFeature: (id: string, feature: Partial<Feature>) => void
  removeFeature: (id: string) => void
  addTask: (task: Task) => void
  updateTask: (id: string, task: Partial<Task>) => void
  removeTask: (id: string) => void
  addDocument: (document: Document) => void
  updateDocument: (id: string, document: Partial<Document>) => void
  removeDocument: (id: string) => void
}

// Create the context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

// Sample project data for development
const sampleProject: ProjectData = {
  metadata: {
    id: "project-1",
    name: "Project Planning AI Interface",
    description: "AI-powered project planning and management system",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "OpenAI"],
    stage: "development",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  features: [
    {
      id: "feature-1",
      name: "AI Agent Collaboration",
      description: "Enable collaboration with specialized AI agents for different aspects of project planning",
      status: "in-progress",
    },
    {
      id: "feature-2",
      name: "Threaded Chat Interface",
      description: "Implement a threaded chat interface for project-specific conversations",
      status: "in-progress",
    },
  ],
  tasks: [
    {
      id: "task-1",
      name: "Design agent selection UI",
      description: "Create a user interface for selecting different AI agents",
      status: "done",
      featureId: "feature-1",
    },
    {
      id: "task-2",
      name: "Implement chat thread creation",
      description: "Add functionality to create new chat threads",
      status: "in-progress",
      featureId: "feature-2",
    },
  ],
  documents: [
    {
      id: "doc-1",
      title: "Project Requirements",
      content: "This project aims to create a comprehensive AI-powered project planning system...",
      type: "requirements",
    },
  ],
}

// Create the provider component
export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null)

  // Load project from localStorage on mount
  useEffect(() => {
    const storedProject = localStorage.getItem("current-project")
    if (storedProject) {
      try {
        setCurrentProject(JSON.parse(storedProject))
      } catch (error) {
        console.error("Failed to parse project from localStorage:", error)
        // Fall back to sample project
        setCurrentProject(sampleProject)
      }
    } else {
      // Use sample project if nothing in localStorage
      setCurrentProject(sampleProject)
    }
  }, [])

  // Save project to localStorage whenever it changes
  useEffect(() => {
    if (currentProject) {
      localStorage.setItem("current-project", JSON.stringify(currentProject))
    }
  }, [currentProject])

  const updateProjectMetadata = (metadata: Partial<ProjectMetadata>) => {
    if (!currentProject) return

    setCurrentProject({
      ...currentProject,
      metadata: {
        ...currentProject.metadata,
        ...metadata,
        updatedAt: new Date().toISOString(),
      },
    })
  }

  const addFeature = (feature: Feature) => {
    if (!currentProject) return

    setCurrentProject({
      ...currentProject,
      features: [...currentProject.features, feature],
      metadata: {
        ...currentProject.metadata,
        updatedAt: new Date().toISOString(),
      },
    })
  }

  const updateFeature = (id: string, feature: Partial<Feature>) => {
    if (!currentProject) return

    setCurrentProject({
      ...currentProject,
      features: currentProject.features.map((f) => (f.id === id ? { ...f, ...feature } : f)),
      metadata: {
        ...currentProject.metadata,
        updatedAt: new Date().toISOString(),
      },
    })
  }

  const removeFeature = (id: string) => {
    if (!currentProject) return

    setCurrentProject({
      ...currentProject,
      features: currentProject.features.filter((f) => f.id !== id),
      metadata: {
        ...currentProject.metadata,
        updatedAt: new Date().toISOString(),
      },
    })
  }

  const addTask = (task: Task) => {
    if (!currentProject) return

    setCurrentProject({
      ...currentProject,
      tasks: [...currentProject.tasks, task],
      metadata: {
        ...currentProject.metadata,
        updatedAt: new Date().toISOString(),
      },
    })
  }

  const updateTask = (id: string, task: Partial<Task>) => {
    if (!currentProject) return

    setCurrentProject({
      ...currentProject,
      tasks: currentProject.tasks.map((t) => (t.id === id ? { ...t, ...task } : t)),
      metadata: {
        ...currentProject.metadata,
        updatedAt: new Date().toISOString(),
      },
    })
  }

  const removeTask = (id: string) => {
    if (!currentProject) return

    setCurrentProject({
      ...currentProject,
      tasks: currentProject.tasks.filter((t) => t.id !== id),
      metadata: {
        ...currentProject.metadata,
        updatedAt: new Date().toISOString(),
      },
    })
  }

  const addDocument = (document: Document) => {
    if (!currentProject) return

    setCurrentProject({
      ...currentProject,
      documents: [...currentProject.documents, document],
      metadata: {
        ...currentProject.metadata,
        updatedAt: new Date().toISOString(),
      },
    })
  }

  const updateDocument = (id: string, document: Partial<Document>) => {
    if (!currentProject) return

    setCurrentProject({
      ...currentProject,
      documents: currentProject.documents.map((d) => (d.id === id ? { ...d, ...document } : d)),
      metadata: {
        ...currentProject.metadata,
        updatedAt: new Date().toISOString(),
      },
    })
  }

  const removeDocument = (id: string) => {
    if (!currentProject) return

    setCurrentProject({
      ...currentProject,
      documents: currentProject.documents.filter((d) => d.id !== id),
      metadata: {
        ...currentProject.metadata,
        updatedAt: new Date().toISOString(),
      },
    })
  }

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        setCurrentProject,
        updateProjectMetadata,
        addFeature,
        updateFeature,
        removeFeature,
        addTask,
        updateTask,
        removeTask,
        addDocument,
        updateDocument,
        removeDocument,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

// Create a hook to use the context
export function useProject() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider")
  }
  return context
}
