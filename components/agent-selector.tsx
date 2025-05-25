"use client"

import { Button } from "@/components/ui/button"
import { Bot, CheckSquare, Sparkles, FileText, Info, Calendar } from "lucide-react"
import type { AgentType } from "@/contexts/unified-chat-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AgentSelectorProps {
  onSelectAgent: (agentType: AgentType) => void
  activeAgent?: AgentType
  compact?: boolean
}

export function AgentSelector({ onSelectAgent, activeAgent = "main", compact = false }: AgentSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium text-muted-foreground mb-2">SPECIALIZED AGENTS</h3>
      <div className="grid grid-cols-2 gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeAgent === "main" ? "default" : "outline"}
                size="sm"
                className={`h-8 w-full justify-start ${compact ? "text-xs" : ""}`}
                onClick={() => onSelectAgent("main")}
              >
                <Bot className="h-3.5 w-3.5 mr-1.5" />
                <span className="truncate">Assistant</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Project Assistant - Coordinates all aspects of project planning</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeAgent === "feature" ? "default" : "outline"}
                size="sm"
                className={`h-8 w-full justify-start ${compact ? "text-xs" : ""}`}
                onClick={() => onSelectAgent("feature")}
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                <span className="truncate">Features</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Feature Agent - Specializes in defining product features</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeAgent === "task" ? "default" : "outline"}
                size="sm"
                className={`h-8 w-full justify-start ${compact ? "text-xs" : ""}`}
                onClick={() => onSelectAgent("task")}
              >
                <CheckSquare className="h-3.5 w-3.5 mr-1.5" />
                <span className="truncate">Tasks</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Task Agent - Helps organize and track project tasks</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeAgent === "planner" ? "default" : "outline"}
                size="sm"
                className={`h-8 w-full justify-start ${compact ? "text-xs" : ""}`}
                onClick={() => onSelectAgent("planner")}
              >
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                <span className="truncate">Planning</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Planning Agent - Assists with scheduling and timelines</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeAgent === "documentation" ? "default" : "outline"}
                size="sm"
                className={`h-8 w-full justify-start ${compact ? "text-xs" : ""}`}
                onClick={() => onSelectAgent("documentation")}
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                <span className="truncate">Docs</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Documentation Agent - Creates and manages project documentation</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeAgent === "detail" ? "default" : "outline"}
                size="sm"
                className={`h-8 w-full justify-start ${compact ? "text-xs" : ""}`}
                onClick={() => onSelectAgent("detail")}
              >
                <Info className="h-3.5 w-3.5 mr-1.5" />
                <span className="truncate">Details</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Detail Agent - Focuses on detailed requirements and specifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
