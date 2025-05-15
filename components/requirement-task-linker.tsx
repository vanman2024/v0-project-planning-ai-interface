"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, Clock, Circle, AlertCircle, Bot, Link, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Task {
  id: string
  name: string
  status: "completed" | "in-progress" | "blocked" | "planned"
  type: "pre_build" | "feature" | "post_build"
  confidence?: number // Agent's confidence in the relevance (0-100)
}

interface RequirementTaskLinkerProps {
  isOpen: boolean
  onClose: () => void
  requirementId: string
  requirementTitle: string
  requirementDescription: string
}

export function RequirementTaskLinker({
  isOpen,
  onClose,
  requirementId,
  requirementTitle,
  requirementDescription,
}: RequirementTaskLinkerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [linkedTasks, setLinkedTasks] = useState<Task[]>([])
  const [suggestedTasks, setSuggestedTasks] = useState<Task[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Simulate fetching linked tasks from the backend when the dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true)

      // Simulate API call to get tasks already linked to this requirement
      setTimeout(() => {
        // Mock data - in a real app, this would come from the backend
        const mockLinkedTasks: Task[] = [
          {
            id: "task-1",
            name: "Setup DB Schema",
            status: "completed",
            type: "pre_build",
            confidence: 95,
          },
          {
            id: "task-4",
            name: "Auth API Routes",
            status: "in-progress",
            type: "feature",
            confidence: 87,
          },
        ]

        setLinkedTasks(mockLinkedTasks)
        setIsLoading(false)
      }, 1000)
    }
  }, [isOpen, requirementId])

  // Function to request agent analysis for new task suggestions
  const requestAgentAnalysis = () => {
    setIsAnalyzing(true)

    // Simulate agent analyzing the requirement and suggesting tasks
    setTimeout(() => {
      // Mock data - in a real app, this would be the result of agent analysis
      const mockSuggestedTasks: Task[] = [
        {
          id: "task-7",
          name: "User Permissions",
          status: "blocked",
          type: "feature",
          confidence: 78,
        },
        {
          id: "task-9",
          name: "API Documentation",
          status: "planned",
          type: "post_build",
          confidence: 65,
        },
      ]

      setSuggestedTasks(mockSuggestedTasks)
      setIsAnalyzing(false)
    }, 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "blocked":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getConfidenceBadge = (confidence?: number) => {
    if (!confidence) return null

    if (confidence >= 80) {
      return <Badge className="bg-green-100 text-green-800">High Confidence</Badge>
    } else if (confidence >= 60) {
      return <Badge className="bg-yellow-100 text-yellow-800">Medium Confidence</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800">Low Confidence</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tasks for Requirement</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            View tasks associated with this requirement as determined by AI agents.
          </p>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Requirement:</p>
            <div className="flex flex-col gap-2 p-3 border rounded-md bg-muted/50">
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4 text-primary" />
                <span className="font-medium">{requirementTitle}</span>
              </div>
              <p className="text-sm text-muted-foreground">{requirementDescription}</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Linked Tasks</h3>
              <span className="text-xs text-muted-foreground">
                {linkedTasks.length} task{linkedTasks.length !== 1 ? "s" : ""}
              </span>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="border rounded-md mt-2">
                <ScrollArea className="h-[200px]">
                  <div className="p-2 space-y-2">
                    {linkedTasks.length > 0 ? (
                      linkedTasks.map((task) => (
                        <div key={task.id} className="flex items-center p-2 hover:bg-muted/50 rounded-md">
                          <div className="flex items-center gap-2 flex-1">
                            {getStatusIcon(task.status)}
                            <span className="text-sm font-medium">{task.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground capitalize mr-2">
                              {task.type.replace("_", " ")}
                            </span>
                            {getConfidenceBadge(task.confidence)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        No tasks linked to this requirement yet
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Agent Suggestions</h3>
              <Button size="sm" onClick={requestAgentAnalysis} disabled={isAnalyzing} className="h-8">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Bot className="h-3 w-3 mr-2" />
                    Request Analysis
                  </>
                )}
              </Button>
            </div>

            {suggestedTasks.length > 0 ? (
              <div className="border rounded-md">
                <ScrollArea className="h-[150px]">
                  <div className="p-2 space-y-2">
                    {suggestedTasks.map((task) => (
                      <div key={task.id} className="flex items-center p-2 hover:bg-muted/50 rounded-md">
                        <div className="flex items-center gap-2 flex-1">
                          {getStatusIcon(task.status)}
                          <span className="text-sm font-medium">{task.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground capitalize mr-2">
                            {task.type.replace("_", " ")}
                          </span>
                          {getConfidenceBadge(task.confidence)}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="border rounded-md p-4 text-center text-muted-foreground">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <p>AI agent is analyzing this requirement...</p>
                  </div>
                ) : (
                  <p>Click "Request Analysis" to get AI task suggestions</p>
                )}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
