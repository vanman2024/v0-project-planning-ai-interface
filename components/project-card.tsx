"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileUp, GitBranch, ChevronRight } from "lucide-react"

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description: string
    filesCount: number
    reposCount: number
    createdAt: string
  }
  onClick: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="truncate">{project.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.filesCount > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <FileUp className="h-3 w-3" />
              <span>{project.filesCount} Files</span>
            </Badge>
          )}
          {project.reposCount > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              <span>{project.reposCount} Repos</span>
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-0">
        <span className="text-xs text-muted-foreground">Created {formatDate(project.createdAt)}</span>
        <Button variant="ghost" size="sm" className="gap-1">
          Open <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
