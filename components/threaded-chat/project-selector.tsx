"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useProject } from "@/contexts/project-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Mock projects for demonstration
const mockProjects = [
  {
    id: "project-1",
    name: "Project Planning AI Interface",
    description: "AI-powered project planning and management system",
  },
  {
    id: "project-2",
    name: "E-commerce Platform",
    description: "Online shopping platform with inventory management",
  },
  {
    id: "project-3",
    name: "Healthcare Dashboard",
    description: "Patient monitoring and healthcare analytics dashboard",
  },
  {
    id: "project-4",
    name: "Learning Management System",
    description: "Educational platform for course management",
  },
]

export function ProjectSelector() {
  const [open, setOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [projects, setProjects] = useState(mockProjects)
  const { currentProject, setCurrentProject } = useProject()
  const [selectedProject, setSelectedProject] = useState(currentProject?.metadata || projects[0])

  // Update the current project in the context when selection changes
  useEffect(() => {
    if (selectedProject && currentProject) {
      setCurrentProject({
        ...currentProject,
        metadata: {
          ...currentProject.metadata,
          id: selectedProject.id,
          name: selectedProject.name,
          description: selectedProject.description,
        },
      })
    }
  }, [selectedProject, setCurrentProject, currentProject])

  const handleCreateProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    const newProject = {
      id: `project-${projects.length + 1}`,
      name,
      description,
    }

    setProjects([...projects, newProject])
    setSelectedProject(newProject)
    setDialogOpen(false)
  }

  return (
    <div className="flex items-center space-x-4 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between w-[240px]">
            {selectedProject?.name || "Select project..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[240px] p-0">
          <Command>
            <CommandInput placeholder="Search projects..." />
            <CommandList>
              <CommandEmpty>No projects found.</CommandEmpty>
              <CommandGroup heading="Projects">
                {projects.map((project) => (
                  <CommandItem
                    key={project.id}
                    value={project.id}
                    onSelect={() => {
                      setSelectedProject(project)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedProject?.id === project.id ? "opacity-100" : "opacity-0")}
                    />
                    {project.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <CommandItem onSelect={() => setDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Project
                    </CommandItem>
                  </DialogTrigger>
                  <DialogContent>
                    <form onSubmit={handleCreateProject}>
                      <DialogHeader>
                        <DialogTitle>Create New Project</DialogTitle>
                        <DialogDescription>Add a new project to your workspace.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input id="name" name="name" placeholder="Project name" className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="description"
                            name="description"
                            placeholder="Project description"
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Create Project</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex-1 truncate">
        {selectedProject?.description && (
          <p className="text-sm text-muted-foreground truncate">{selectedProject.description}</p>
        )}
      </div>
    </div>
  )
}
