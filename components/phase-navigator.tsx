"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle2, Clock, AlertCircle, CircleDot } from "lucide-react"

interface PhaseNavigatorProps {
  currentPhase: number
  onPhaseChange: (phase: number) => void
  projectStats: {
    phases: {
      name: string
      progress: number
      status: "completed" | "in-progress" | "blocked" | "not-started"
      items: {
        total: number
        completed: number
      }
    }[]
  }
}

export function PhaseNavigator({ currentPhase, onPhaseChange, projectStats }: PhaseNavigatorProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "blocked":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <CircleDot className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex flex-wrap gap-2 w-full">
              {projectStats.phases.map((phase, index) => (
                <div key={index} className="flex flex-col items-center flex-1 min-w-[100px]">
                  <button
                    onClick={() => onPhaseChange(index)}
                    className={`px-3 py-2 rounded-md text-sm font-medium w-full text-center transition-colors ${
                      currentPhase === index
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {phase.name}
                  </button>
                  <div className="w-full mt-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 mb-1">
                            {getStatusIcon(phase.status)}
                            <span className="text-xs text-muted-foreground">
                              {phase.items.completed}/{phase.items.total} items
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {phase.status === "completed"
                              ? "Phase completed"
                              : phase.status === "in-progress"
                                ? `In progress: ${phase.progress}% complete`
                                : phase.status === "blocked"
                                  ? "Blocked: Action required"
                                  : "Not started yet"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Progress value={phase.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="bg-muted/50 rounded-md p-3">
              <div className="text-2xl font-bold">
                {projectStats.phases.reduce((acc, phase) => acc + phase.items.total, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Items</div>
            </div>
            <div className="bg-muted/50 rounded-md p-3">
              <div className="text-2xl font-bold">
                {projectStats.phases.reduce((acc, phase) => acc + phase.items.completed, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="bg-muted/50 rounded-md p-3">
              <div className="text-2xl font-bold">
                {Math.round(
                  (projectStats.phases.reduce((acc, phase) => acc + phase.items.completed, 0) /
                    projectStats.phases.reduce((acc, phase) => acc + phase.items.total, 0)) *
                    100,
                )}
                %
              </div>
              <div className="text-xs text-muted-foreground">Overall Progress</div>
            </div>
            <div className="bg-muted/50 rounded-md p-3">
              <div className="text-2xl font-bold">
                {projectStats.phases.filter((p) => p.status === "completed").length}
              </div>
              <div className="text-xs text-muted-foreground">Phases Complete</div>
            </div>
            <div className="bg-muted/50 rounded-md p-3">
              <div className="text-2xl font-bold">
                {projectStats.phases.find((p) => p.status === "in-progress")?.name || "None"}
              </div>
              <div className="text-xs text-muted-foreground">Current Focus</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
