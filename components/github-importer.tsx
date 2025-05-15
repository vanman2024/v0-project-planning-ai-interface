"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { GitBranch, X, Check, AlertCircle } from "lucide-react"

interface Repository {
  url: string
  name: string
  status: "pending" | "imported" | "error"
}

interface GitHubImporterProps {
  repositories: Repository[]
  onUpdate: (repositories: Repository[]) => void
}

export function GitHubImporter({ repositories, onUpdate }: GitHubImporterProps) {
  const [repoUrl, setRepoUrl] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState("")

  const handleImport = () => {
    // Validate URL format
    if (!repoUrl.includes("github.com")) {
      setError("Please enter a valid GitHub repository URL")
      return
    }

    // Check if already imported
    if (repositories.some((repo) => repo.url === repoUrl)) {
      setError("This repository has already been imported")
      return
    }

    setError("")
    setIsImporting(true)

    // Simulate import process
    setTimeout(() => {
      const repoName = repoUrl.split("/").pop() || "repository"

      onUpdate([
        ...repositories,
        {
          url: repoUrl,
          name: repoName,
          status: "imported",
        },
      ])

      setRepoUrl("")
      setIsImporting(false)
    }, 1500)
  }

  const removeRepository = (url: string) => {
    onUpdate(repositories.filter((repo) => repo.url !== url))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "imported":
        return <Check className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <GitBranch className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import GitHub Repository</CardTitle>
        <CardDescription>Import existing code from GitHub repositories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="https://github.com/username/repository"
                value={repoUrl}
                onChange={(e) => {
                  setRepoUrl(e.target.value)
                  setError("")
                }}
              />
              <Button onClick={handleImport} disabled={isImporting || !repoUrl}>
                {isImporting ? "Importing..." : "Import"}
              </Button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          {repositories.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Imported Repositories ({repositories.length})</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {repositories.map((repo) => (
                  <div key={repo.url} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center">
                      {getStatusIcon(repo.status)}
                      <div className="ml-2">
                        <p className="text-sm font-medium">{repo.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{repo.url}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeRepository(repo.url)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove {repo.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
