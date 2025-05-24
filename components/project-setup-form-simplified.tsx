"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { UnifiedChatProvider } from "@/contexts/unified-chat-context"
import { UnifiedChat } from "@/components/unified-chat"

interface ProjectSetupFormProps {
  projectData: {
    name: string
    description: string
    techStack: string[]
    projectType?: string
    categories?: string[]
    dueDate?: string
  }
  onUpdate: (
    data: Partial<{
      name: string
      description: string
      techStack: string[]
      projectType?: string
      categories?: string[]
      dueDate?: string
    }>,
  ) => void
  onComplete: () => void
}

// Predefined project types
const PROJECT_TYPES = [
  { id: "web-app", name: "Web Application" },
  { id: "mobile-app", name: "Mobile Application" },
  { id: "desktop-app", name: "Desktop Application" },
  { id: "api", name: "API / Backend Service" },
  { id: "e-commerce", name: "E-Commerce" },
  { id: "blog", name: "Blog / Content Site" },
  { id: "dashboard", name: "Dashboard / Analytics" },
  { id: "game", name: "Game" },
  { id: "other", name: "Other" },
]

export function ProjectSetupFormSimplified({ projectData, onUpdate, onComplete }: ProjectSetupFormProps) {
  const [techInput, setTechInput] = useState("")
  const [activeTab, setActiveTab] = useState("details")

  const addTechStack = () => {
    if (techInput.trim() && !projectData.techStack.includes(techInput.trim())) {
      onUpdate({ techStack: [...projectData.techStack, techInput.trim()] })
      setTechInput("")
    }
  }

  const removeTechStack = (tech: string) => {
    onUpdate({ techStack: projectData.techStack.filter((t) => t !== tech) })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTechStack()
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Project Setup</CardTitle>
        <CardDescription>Define your project details to help the AI agents understand your needs</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="details">Project Details</TabsTrigger>
            <TabsTrigger value="agent">Project Agents</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="My Awesome Project"
                value={projectData.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
              />
            </div>

            {/* Project Type */}
            <div className="space-y-2">
              <Label htmlFor="project-type">Project Type</Label>
              <Select value={projectData.projectType} onValueChange={(value) => onUpdate({ projectType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Project Description */}
            <div className="space-y-2">
              <Label htmlFor="project-description">Project Description</Label>
              <Textarea
                id="project-description"
                placeholder="Describe your project..."
                rows={4}
                value={projectData.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
              />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date (Optional)</Label>
              <Input
                id="due-date"
                type="date"
                value={projectData.dueDate}
                onChange={(e) => onUpdate({ dueDate: e.target.value })}
              />
            </div>

            {/* Technology Stack */}
            <div className="space-y-2">
              <Label htmlFor="tech-stack">Technology Stack</Label>
              <div className="flex gap-2">
                <Input
                  id="tech-stack"
                  placeholder="React, Node.js, MongoDB..."
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button type="button" onClick={addTechStack}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {projectData.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <button onClick={() => removeTechStack(tech)} className="ml-1 rounded-full hover:bg-muted p-0.5">
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tech}</span>
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="agent" className="h-[500px] flex flex-col">
            {/* Only include the UnifiedChat component here */}
            <UnifiedChatProvider>
              <UnifiedChat
                projectId={
                  projectData.name ? `project-${projectData.name.toLowerCase().replace(/\s+/g, "-")}` : undefined
                }
                compact={true}
                showContinueInMainChat={true}
              />
            </UnifiedChatProvider>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onComplete}>Continue</Button>
      </CardFooter>
    </Card>
  )
}
