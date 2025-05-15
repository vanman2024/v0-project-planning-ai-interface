"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, CheckSquare, Layers, FileText, Info, Calendar } from "lucide-react"
import type { AgentType } from "@/contexts/unified-chat-context"

interface AgentSelectorProps {
  onSelectAgent: (agentType: AgentType) => void
  activeAgent?: AgentType
  compact?: boolean
}

export function AgentSelector({ onSelectAgent, activeAgent = "main", compact = false }: AgentSelectorProps) {
  return (
    <div className="border-b pb-3">
      <h3 className="text-xs font-medium text-muted-foreground mb-2">AGENTS</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={activeAgent === "main" ? "default" : "outline"}
          size="sm"
          className={`justify-start text-xs h-9 w-full ${activeAgent === "main" ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => onSelectAgent("main")}
        >
          <MessageSquare className="h-3.5 w-3.5 mr-2" />
          Main
        </Button>
        <Button
          variant={activeAgent === "task" ? "default" : "outline"}
          size="sm"
          className={`justify-start text-xs h-9 w-full ${activeAgent === "task" ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => onSelectAgent("task")}
        >
          <CheckSquare className="h-3.5 w-3.5 mr-2" />
          Tasks
        </Button>
        <Button
          variant={activeAgent === "feature" ? "default" : "outline"}
          size="sm"
          className={`justify-start text-xs h-9 w-full ${activeAgent === "feature" ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => onSelectAgent("feature")}
        >
          <Layers className="h-3.5 w-3.5 mr-2" />
          Features
        </Button>
        <Button
          variant={activeAgent === "documentation" ? "default" : "outline"}
          size="sm"
          className={`justify-start text-xs h-9 w-full ${activeAgent === "documentation" ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => onSelectAgent("documentation")}
        >
          <FileText className="h-3.5 w-3.5 mr-2" />
          Docs
        </Button>
        <Button
          variant={activeAgent === "detail" ? "default" : "outline"}
          size="sm"
          className={`justify-start text-xs h-9 w-full ${activeAgent === "detail" ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => onSelectAgent("detail")}
        >
          <Info className="h-3.5 w-3.5 mr-2" />
          Details
        </Button>
        <Button
          variant={activeAgent === "planner" ? "default" : "outline"}
          size="sm"
          className={`justify-start text-xs h-9 w-full ${activeAgent === "planner" ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => onSelectAgent("planner")}
        >
          <Calendar className="h-3.5 w-3.5 mr-2" />
          Planning
        </Button>
      </div>
    </div>
  )
}
