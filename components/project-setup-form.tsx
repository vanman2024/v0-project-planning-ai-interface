"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, X, Tag, Check, MessageSquare } from "lucide-react"
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

// Extended categories with subcategories
const CATEGORY_GROUPS = [
  {
    name: "Development Focus",
    categories: ["Frontend", "Backend", "Full-Stack", "DevOps", "Database", "API", "Mobile", "Desktop"],
  },
  {
    name: "Industry",
    categories: ["E-Commerce", "Finance", "Healthcare", "Education", "Entertainment", "Social Media", "Enterprise"],
  },
  {
    name: "Technology",
    categories: ["AI/ML", "Blockchain", "IoT", "AR/VR", "Cloud", "Serverless", "Microservices"],
  },
  {
    name: "Purpose",
    categories: ["Productivity", "Analytics", "Communication", "Content Management", "Customer Service", "Automation"],
  },
]

// Flatten categories for easy access
const PREDEFINED_CATEGORIES = CATEGORY_GROUPS.flatMap((group) => group.categories)

export function ProjectSetupForm({ projectData, onUpdate, onComplete }: ProjectSetupFormProps) {
  const [techInput, setTechInput] = useState("")
  const [categoryInput, setCategoryInput] = useState("")
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isGeneratingStack, setIsGeneratingStack] = useState(false)
  const [isGeneratingCategories, setIsGeneratingCategories] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<{
    techStack: string[]
    reasoning: string
  } | null>(null)
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<string | null>(null)

  // Auto-generate description when project type changes
  useEffect(() => {
    if (projectData.projectType && projectData.name && !projectData.description) {
      generateDescriptionFromProjectType(projectData.projectType, projectData.name)
    }
  }, [projectData.projectType, projectData.name])

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

  const addCategory = (category: string) => {
    if (category.trim() && (!projectData.categories || !projectData.categories.includes(category.trim()))) {
      onUpdate({
        categories: [...(projectData.categories || []), category.trim()],
      })
      setCategoryInput("")
    }
  }

  const removeCategory = (category: string) => {
    if (projectData.categories) {
      onUpdate({
        categories: projectData.categories.filter((c) => c !== category),
      })
    }
  }

  const handleCategoryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addCategory(categoryInput)
    }
  }

  const enhanceDescription = () => {
    if (!projectData.name || !projectData.description) {
      return
    }

    setIsEnhancing(true)

    // In a real implementation, this would call an AI service
    setTimeout(() => {
      const enhancedDescription = generateEnhancedDescription(projectData.name, projectData.description)
      onUpdate({ description: enhancedDescription })
      setIsEnhancing(false)
    }, 1500)
  }

  const generateDescriptionFromProjectType = (projectType: string, projectName: string) => {
    if (!projectType || !projectName) return

    setIsGeneratingDescription(true)

    // In a real implementation, this would call an AI service
    setTimeout(() => {
      const description = getDescriptionByProjectType(projectType, projectName)
      onUpdate({ description })
      setIsGeneratingDescription(false)
    }, 1000)
  }

  const generateCategoriesFromProjectType = (projectType: string) => {
    setIsGeneratingCategories(true)

    // In a real implementation, this would call an AI service
    setTimeout(() => {
      const suggestedCategories = getCategoriesByProjectType(projectType)
      onUpdate({ categories: suggestedCategories })
      setIsGeneratingCategories(false)
    }, 1000)
  }

  // Function to generate an enhanced description based on the project name and existing description
  const generateEnhancedDescription = (name: string, currentDescription: string): string => {
    // If there's already a description, enhance it
    if (currentDescription.trim()) {
      return `${currentDescription}\n\nThis ${name} project aims to deliver a seamless user experience with modern design principles and robust architecture. It will focus on scalability, performance, and maintainability while providing an intuitive interface for users to interact with the system efficiently.`
    }

    // If no description exists, generate a new one based on the project name
    return `${name} is a comprehensive solution designed to address the challenges of modern application development. This project will implement best practices for code organization, testing, and deployment while ensuring a responsive and accessible user interface. The system will be built with scalability in mind, allowing for future enhancements and integrations with third-party services.`
  }

  // Function to get description based on project type
  const getDescriptionByProjectType = (projectType: string, projectName: string): string => {
    switch (projectType) {
      case "web-app":
        return `${projectName} is a modern web application designed to provide users with a seamless and intuitive experience. This project will focus on creating a responsive interface that works across all devices, with fast load times and smooth interactions. The application will implement secure user authentication, data persistence, and real-time updates where needed. It will be built with scalability in mind, allowing for future feature additions and increased user capacity.`
      case "mobile-app":
        return `${projectName} is a cross-platform mobile application designed to deliver a native-like experience on both iOS and Android devices. This project will focus on creating an intuitive user interface with smooth animations and responsive interactions. The app will implement offline capabilities, push notifications, and secure data storage. It will be optimized for performance and battery efficiency while maintaining a consistent user experience across different device sizes and operating systems.`
      case "desktop-app":
        return `${projectName} is a powerful desktop application designed to provide users with a comprehensive set of tools and features. This project will focus on creating a responsive and intuitive interface that maximizes productivity. The application will implement efficient data processing, file system integration, and cross-platform compatibility. It will be optimized for performance on various hardware configurations while maintaining a consistent user experience across different operating systems.`
      case "api":
        return `${projectName} is a robust API service designed to provide secure and efficient data access for client applications. This project will focus on creating a well-documented, RESTful interface with consistent response formats and error handling. The API will implement proper authentication and authorization, rate limiting, and data validation. It will be built with scalability and performance in mind, allowing for increased traffic and data volume as the service grows.`
      case "e-commerce":
        return `${projectName} is a comprehensive e-commerce platform designed to provide a seamless shopping experience for customers and efficient management tools for administrators. This project will focus on creating an intuitive product browsing and purchasing flow, secure payment processing, and order management. The platform will implement product catalog management, inventory tracking, and customer account features. It will be optimized for conversion rates while ensuring security and reliability for all transactions.`
      case "blog":
        return `${projectName} is a modern content publishing platform designed to showcase articles, stories, and media in an engaging format. This project will focus on creating a clean, readable layout with excellent typography and content organization. The platform will implement content management features, commenting systems, and social sharing capabilities. It will be optimized for search engine visibility while providing an excellent reading experience across all devices.`
      case "dashboard":
        return `${projectName} is a data visualization dashboard designed to transform complex information into actionable insights. This project will focus on creating intuitive charts, graphs, and data tables that make information easy to understand at a glance. The dashboard will implement filtering and sorting capabilities, customizable views, and export options. It will be optimized for performance even with large datasets while providing a responsive interface that works across different screen sizes.`
      case "game":
        return `${projectName} is an interactive game designed to provide players with an engaging and entertaining experience. This project will focus on creating compelling gameplay mechanics, visually appealing graphics, and immersive sound design. The game will implement player progression systems, score tracking, and potentially multiplayer capabilities. It will be optimized for performance across supported platforms while ensuring a consistent and enjoyable player experience.`
      default:
        return `${projectName} is a comprehensive solution designed to address specific user needs with a focus on usability and performance. This project will implement best practices for code organization, testing, and deployment while ensuring a responsive and accessible user interface. The system will be built with scalability in mind, allowing for future enhancements and integrations with third-party services.`
    }
  }

  // Function to get categories based on project type
  const getCategoriesByProjectType = (projectType: string): string[] => {
    switch (projectType) {
      case "web-app":
        return ["Frontend", "Full-Stack", "UI/UX", "Web"]
      case "mobile-app":
        return ["Mobile", "UI/UX", "Cross-Platform"]
      case "desktop-app":
        return ["Desktop", "UI/UX", "Cross-Platform"]
      case "api":
        return ["Backend", "API", "Microservices"]
      case "e-commerce":
        return ["E-Commerce", "Full-Stack", "Retail"]
      case "blog":
        return ["Content", "CMS", "Publishing"]
      case "dashboard":
        return ["Analytics", "Data Visualization", "Business Intelligence"]
      case "game":
        return ["Game Development", "Entertainment", "Interactive"]
      default:
        return ["Software Development"]
    }
  }

  return (
    <>
      <style jsx global>{`
        .markdown-content .list-item {
          display: flex;
          margin-bottom: 0.25rem;
        }
        .markdown-content .list-number {
          margin-right: 0.5rem;
          font-weight: 500;
        }
        .markdown-content strong {
          font-weight: 600;
        }
        .markdown-content code.inline-code {
          background-color: rgba(0, 0, 0, 0.1);
          padding: 0.1rem 0.2rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.9em;
        }
      `}</style>
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
                <p className="text-xs text-muted-foreground">
                  Select a project type to help our AI understand your project better. You can refine the details with
                  the Project Agent.
                </p>
              </div>

              {/* Project Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="project-description">Project Description</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("agent")} className="h-8 gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>Ask AI for Help</span>
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="project-description"
                  placeholder="Describe your project in detail. What problem does it solve? Who is it for? What are the main features?"
                  rows={4}
                  value={projectData.description}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  className={isGeneratingDescription ? "opacity-50" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  Provide a detailed description or switch to the Project Agents tab for AI assistance in defining your
                  project.
                </p>
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

              {/* Categories */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="categories">Categories</Label>
                  <Button variant="outline" size="sm" onClick={() => setShowCategoryDialog(true)} className="h-8 gap-1">
                    <Tag className="h-4 w-4" />
                    <span>Add Categories</span>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {(projectData.categories || []).map((category) => (
                    <Badge key={category} variant="secondary" className="flex items-center gap-1">
                      {category}
                      <button
                        onClick={() => removeCategory(category)}
                        className="ml-1 rounded-full hover:bg-muted p-0.5"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {category}</span>
                      </button>
                    </Badge>
                  ))}
                  {!(projectData.categories || []).length && (
                    <span className="text-sm text-muted-foreground">
                      No categories added yet. Add categories to help organize your project.
                    </span>
                  )}
                </div>
              </div>

              {/* Technology Stack */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tech-stack">Technology Stack</Label>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("agent")} className="h-8 gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>Ask AI for Recommendations</span>
                  </Button>
                </div>
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
                <p className="text-xs text-muted-foreground">
                  Add technologies you plan to use or switch to the Project Agents tab for AI recommendations based on
                  your project details.
                </p>

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

              <Alert className="mt-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium">AI-Powered Project Planning</span>
                </div>
                <AlertDescription className="mt-2">
                  Switch to the <strong>Project Agents</strong> tab to chat with our AI assistant. The assistant can
                  help you:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Refine your project description</li>
                    <li>Suggest appropriate technologies</li>
                    <li>Recommend project structure</li>
                    <li>Answer questions about development approaches</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="agent" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <UnifiedChatProvider>
                  <UnifiedChat
                    projectId={
                      projectData.name ? `project-${projectData.name.toLowerCase().replace(/\s+/g, "-")}` : undefined
                    }
                    compact={true}
                    showContinueInMainChat={true}
                  />
                </UnifiedChatProvider>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={onComplete}>Continue</Button>
        </CardFooter>

        {/* Category Dialog */}
        <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Categories</DialogTitle>
              <DialogDescription>Add categories to help organize your project</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Custom Category</Label>
                <div className="flex gap-2">
                  <Input
                    id="category"
                    placeholder="Enter a custom category..."
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    onKeyDown={handleCategoryKeyDown}
                  />
                  <Button
                    onClick={() => {
                      if (categoryInput.trim()) {
                        addCategory(categoryInput)
                      }
                    }}
                    disabled={!categoryInput.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Suggested Categories</Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CATEGORY_GROUPS.map((group) => (
                    <div key={group.name} className="space-y-2">
                      <h4 className="text-sm font-medium">{group.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        {group.categories.map((category) => {
                          const isSelected = projectData.categories?.includes(category)
                          return (
                            <Badge
                              key={category}
                              variant={isSelected ? "default" : "outline"}
                              className={`cursor-pointer ${isSelected ? "" : "hover:bg-secondary"}`}
                              onClick={() => {
                                if (isSelected) {
                                  removeCategory(category)
                                } else {
                                  addCategory(category)
                                }
                              }}
                            >
                              {isSelected && <Check className="h-3 w-3 mr-1" />}
                              {category}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </>
  )
}
