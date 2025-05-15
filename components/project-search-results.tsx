"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, FileUp, GitBranch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: string
  name: string
  description: string
  techStack?: string[]
  filesCount: number
  reposCount: number
  createdAt: string
}

interface ProjectSearchResultsProps {
  searchQuery: string
  onClearSearch: () => void
}

export function ProjectSearchResults({ searchQuery, onClearSearch }: ProjectSearchResultsProps) {
  const [results, setResults] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
    // Simulate API call to search projects
    setIsLoading(true)

    setTimeout(() => {
      if (!searchQuery.trim()) {
        setResults([])
        setIsLoading(false)
        return
      }

      const query = searchQuery.toLowerCase()
      const filtered = mockProjects.filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.techStack?.some((tech) => tech.toLowerCase().includes(query)),
      )

      setResults(filtered)
      setIsLoading(false)
    }, 300)
  }, [searchQuery])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (!searchQuery.trim()) {
    return null
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>Search Results</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClearSearch}>
          Clear <X className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((project) => (
              <div
                key={project.id}
                className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{project.name}</h3>
                  <span className="text-sm text-muted-foreground">Created {formatDate(project.createdAt)}</span>
                </div>
                <p className="text-muted-foreground mb-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.techStack?.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <FileUp className="h-4 w-4" />
                    <span>{project.filesCount} Files</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <GitBranch className="h-4 w-4" />
                    <span>{project.reposCount} Repos</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No projects found matching "{searchQuery}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
