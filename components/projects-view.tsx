"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlusCircle, Search, FolderKanban, Clock, Calendar, Users, MoreHorizontal, Star, StarOff } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectCreationWizard } from "./project-creation-wizard"

interface ProjectsViewProps {
  onSelectProject: (project: any) => void
}

export function ProjectsView({ onSelectProject }: ProjectsViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Sample projects data
  const projects = [
    {
      id: "project-1",
      name: "Coffee Shop Mobile App",
      description: "A mobile app for ordering coffee and managing loyalty points",
      progress: 35,
      status: "in-progress",
      dueDate: "Dec 25, 2024",
      teamSize: 5,
      category: "Mobile App",
      isFavorite: true,
    },
    {
      id: "project-2",
      name: "Company Website Redesign",
      description: "Modernize the company website with new branding and improved UX",
      progress: 65,
      status: "in-progress",
      dueDate: "Nov 15, 2024",
      teamSize: 3,
      category: "Web Design",
      isFavorite: true,
    },
    {
      id: "project-3",
      name: "Inventory Management System",
      description: "Track inventory levels, orders, and deliveries",
      progress: 90,
      status: "in-progress",
      dueDate: "Oct 10, 2024",
      teamSize: 4,
      category: "Enterprise",
      isFavorite: false,
    },
    {
      id: "project-4",
      name: "Customer Support Portal",
      description: "Self-service portal for customer support and knowledge base",
      progress: 20,
      status: "in-progress",
      dueDate: "Jan 30, 2025",
      teamSize: 3,
      category: "Web App",
      isFavorite: false,
    },
    {
      id: "project-5",
      name: "Marketing Campaign Automation",
      description: "Automate email campaigns and social media posting",
      progress: 0,
      status: "pending",
      dueDate: "Feb 15, 2025",
      teamSize: 2,
      category: "Marketing",
      isFavorite: false,
    },
  ]

  // Filter projects based on search query and active tab
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "favorites") return matchesSearch && project.isFavorite
    if (activeTab === "in-progress") return matchesSearch && project.status === "in-progress"
    if (activeTab === "pending") return matchesSearch && project.status === "pending"

    return matchesSearch
  })

  const handleCreateProject = (projectData: any) => {
    console.log("Project created:", projectData)
    setIsCreateDialogOpen(false)
    // In a real app, this would create the project and add it to the list
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Your Projects 📂</h1>
            <p className="text-muted-foreground">Manage and organize all your work</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
      </div>

      {isCreateDialogOpen && (
        <ProjectCreationWizard
          onComplete={(projectData) => {
            console.log("Project created:", projectData)
            setIsCreateDialogOpen(false)
            // In a real app, this would add the new project to the projects list
          }}
          onCancel={() => setIsCreateDialogOpen(false)}
        />
      )}

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="pending">Not Started</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="flex-1 p-4 overflow-auto m-0">
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <FolderKanban className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try a different search term" : "Create your first project to get started"}
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="mb-2">
                        {project.category}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-yellow-500"
                        >
                          {project.isFavorite ? (
                            <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                          ) : (
                            <StarOff className="h-5 w-5" />
                          )}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Project</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem>Share</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{project.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{project.teamSize} members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{project.status === "in-progress" ? "In Progress" : "Not Started"}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => onSelectProject(project)}>
                      Open Project
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
