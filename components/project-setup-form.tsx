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
import { Sparkles, X, Loader2, Tag, RefreshCw, Check } from "lucide-react"
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

// Predefined categories
const PREDEFINED_CATEGORIES = [
  "Frontend",
  "Backend",
  "Full-Stack",
  "Mobile",
  "Desktop",
  "Database",
  "API",
  "UI/UX",
  "DevOps",
  "Machine Learning",
  "Blockchain",
  "IoT",
  "AR/VR",
  "Enterprise",
  "Personal",
]

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

  // Auto-generate description when project type changes
  useEffect(() => {
    if (projectData.projectType && projectData.name) {
      generateDescriptionFromProjectType(projectData.projectType, projectData.name)
    }
  }, [projectData.projectType, projectData.name])

  // Auto-suggest categories when project type changes
  useEffect(() => {
    if (projectData.projectType) {
      generateCategoriesFromProjectType(projectData.projectType)
    }
  }, [projectData.projectType])

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

    // Simulate AI enhancement of the description
    setTimeout(() => {
      const enhancedDescription = generateEnhancedDescription(projectData.name, projectData.description)
      onUpdate({ description: enhancedDescription })
      setIsEnhancing(false)
    }, 1500)
  }

  const generateDescriptionFromProjectType = (projectType: string, projectName: string) => {
    if (!projectType || !projectName) return

    setIsGeneratingDescription(true)

    // Simulate AI generation of description based on project type
    setTimeout(() => {
      const description = getDescriptionByProjectType(projectType, projectName)
      onUpdate({ description })
      setIsGeneratingDescription(false)

      // After generating description, suggest tech stack
      generateTechStackFromProjectType(projectType)
    }, 1000)
  }

  const generateCategoriesFromProjectType = (projectType: string) => {
    setIsGeneratingCategories(true)

    // Simulate AI generation of categories based on project type
    setTimeout(() => {
      const suggestedCategories = getCategoriesByProjectType(projectType)
      onUpdate({ categories: suggestedCategories })
      setIsGeneratingCategories(false)
    }, 1000)
  }

  const generateTechStackFromProjectType = (projectType: string) => {
    setIsGeneratingStack(true)

    // Simulate AI generation of tech stack based on project type
    setTimeout(() => {
      const suggestedStack = getTechStackByProjectType(projectType)
      const reasoning = getReasoningByProjectType(projectType)

      setAiSuggestions({
        techStack: suggestedStack,
        reasoning: reasoning,
      })

      setIsGeneratingStack(false)
    }, 1500)
  }

  const generateTechStack = () => {
    if (!projectData.description) {
      return
    }

    setIsGeneratingStack(true)

    // Simulate AI generation of tech stack suggestions
    setTimeout(() => {
      // Generate suggestions based on the project description
      const description = projectData.description.toLowerCase()
      let suggestedStack: string[] = []
      let reasoning = "Based on your project description, I recommend the following technology stack:\n\n"

      if (description.includes("e-commerce") || description.includes("shop") || description.includes("store")) {
        suggestedStack = ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Stripe", "Redux"]
        reasoning +=
          "- **Next.js & TypeScript**: Provides a robust framework for building server-rendered React applications with type safety\n"
        reasoning += "- **Tailwind CSS**: Offers utility-first styling for rapid UI development\n"
        reasoning +=
          "- **Prisma & PostgreSQL**: Gives you a type-safe database client with a reliable relational database\n"
        reasoning += "- **Stripe**: Essential for handling payments in e-commerce applications\n"
        reasoning += "- **Redux**: Helpful for managing complex application state in larger e-commerce platforms\n"
      } else if (description.includes("blog") || description.includes("content") || description.includes("cms")) {
        suggestedStack = ["Next.js", "TypeScript", "Tailwind CSS", "Contentful", "Vercel", "MDX"]
        reasoning += "- **Next.js & TypeScript**: Perfect for content-heavy sites with SEO requirements\n"
        reasoning += "- **Tailwind CSS**: Provides consistent styling with minimal effort\n"
        reasoning += "- **Contentful**: A headless CMS that makes content management easy\n"
        reasoning += "- **Vercel**: Optimized hosting for Next.js applications\n"
        reasoning += "- **MDX**: Allows you to use React components in markdown for rich content\n"
      } else if (
        description.includes("dashboard") ||
        description.includes("admin") ||
        description.includes("analytics")
      ) {
        suggestedStack = ["React", "TypeScript", "Material UI", "React Query", "Chart.js", "Firebase", "Redux"]
        reasoning += "- **React & TypeScript**: Provides a responsive UI framework with type safety\n"
        reasoning += "- **Material UI**: Offers pre-built components for dashboard interfaces\n"
        reasoning += "- **React Query**: Simplifies data fetching and caching\n"
        reasoning += "- **Chart.js**: Essential for data visualization in analytics dashboards\n"
        reasoning += "- **Firebase**: Provides authentication and real-time database capabilities\n"
        reasoning += "- **Redux**: Helps manage complex application state across dashboard components\n"
      } else if (description.includes("mobile") || description.includes("ios") || description.includes("android")) {
        suggestedStack = ["React Native", "TypeScript", "Expo", "Redux", "Firebase", "Jest"]
        reasoning += "- **React Native & Expo**: Allows you to build cross-platform mobile apps efficiently\n"
        reasoning += "- **TypeScript**: Adds type safety to your mobile application\n"
        reasoning += "- **Redux**: Manages application state across screens\n"
        reasoning += "- **Firebase**: Provides authentication, database, and cloud functions\n"
        reasoning += "- **Jest**: Essential for testing your mobile application\n"
      } else {
        // Default modern web stack
        suggestedStack = ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Vercel"]
        reasoning += "- **Next.js & TypeScript**: Provides a modern React framework with type safety\n"
        reasoning += "- **Tailwind CSS**: Offers utility-first styling for rapid UI development\n"
        reasoning += "- **Prisma & PostgreSQL**: Gives you a type-safe database client with a reliable database\n"
        reasoning += "- **Vercel**: Optimized hosting for Next.js applications\n"
      }

      setAiSuggestions({
        techStack: suggestedStack,
        reasoning: reasoning,
      })
      setIsGeneratingStack(false)
    }, 1500)
  }

  const applyAiSuggestions = () => {
    if (aiSuggestions) {
      onUpdate({ techStack: aiSuggestions.techStack })
      setAiSuggestions(null)
    }
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
        return `${projectName} is a modern web application designed to provide users with a seamless and intuitive experience  is a modern web application designed to provide users with a seamless and intuitive experience. This project will focus on creating a responsive interface that works across all devices, with fast load times and smooth interactions. The application will implement secure user authentication, data persistence, and real-time updates where needed. It will be built with scalability in mind, allowing for future feature additions and increased user capacity.`
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

  // Function to get tech stack based on project type
  const getTechStackByProjectType = (projectType: string): string[] => {
    switch (projectType) {
      case "web-app":
        return ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB"]
      case "mobile-app":
        return ["React Native", "TypeScript", "Expo", "Redux", "Firebase"]
      case "desktop-app":
        return ["Electron", "React", "TypeScript", "SQLite", "Redux"]
      case "api":
        return ["Node.js", "Express", "TypeScript", "PostgreSQL", "Swagger", "Jest"]
      case "e-commerce":
        return ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Stripe"]
      case "blog":
        return ["Next.js", "TypeScript", "Tailwind CSS", "Contentful", "MDX", "Vercel"]
      case "dashboard":
        return ["React", "TypeScript", "Material UI", "Chart.js", "React Query", "Firebase"]
      case "game":
        return ["Unity", "C#", "Three.js", "WebGL", "Firebase"]
      default:
        return ["React", "TypeScript", "Node.js", "PostgreSQL"]
    }
  }

  // Function to get reasoning based on project type
  const getReasoningByProjectType = (projectType: string): string => {
    switch (projectType) {
      case "web-app":
        return (
          "Based on your web application project, I recommend the following technology stack:\n\n" +
          "- **React & Next.js**: Provides a powerful framework for building modern web applications with server-side rendering\n" +
          "- **TypeScript**: Adds type safety to your JavaScript code, reducing bugs and improving developer experience\n" +
          "- **Tailwind CSS**: Offers utility-first styling for rapid UI development without writing custom CSS\n" +
          "- **Node.js**: Enables JavaScript on the server-side for a unified language throughout your stack\n" +
          "- **MongoDB**: Provides a flexible, document-based database that works well with JavaScript applications"
        )
      case "mobile-app":
        return (
          "Based on your mobile application project, I recommend the following technology stack:\n\n" +
          "- **React Native**: Allows you to build cross-platform mobile apps with a single codebase\n" +
          "- **TypeScript**: Adds type safety to your JavaScript code, reducing bugs in your mobile app\n" +
          "- **Expo**: Simplifies React Native development with pre-built components and development tools\n" +
          "- **Redux**: Provides predictable state management across your mobile application\n" +
          "- **Firebase**: Offers authentication, real-time database, and cloud functions for mobile apps"
        )
      case "e-commerce":
        return (
          "Based on your e-commerce project, I recommend the following technology stack:\n\n" +
          "- **Next.js & TypeScript**: Provides a robust framework for building server-rendered React applications with type safety\n" +
          "- **Tailwind CSS**: Offers utility-first styling for rapid UI development\n" +
          "- **Prisma & PostgreSQL**: Gives you a type-safe database client with a reliable relational database\n" +
          "- **Stripe**: Essential for handling payments in e-commerce applications"
        )
      default:
        return "Based on your project type, I recommend these technologies as they provide a solid foundation for development, with good community support and documentation. This stack balances modern features with stability and will allow you to build a scalable, maintainable application."
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
              <TabsTrigger value="agent">Project Agent</TabsTrigger>
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

              {/* Project Type - Moved directly beneath project name */}
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

              {/* Project Description - Auto-generated based on project type */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="project-description">Project Description</Label>
                  <div className="flex gap-2">
                    {projectData.description && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={enhanceDescription}
                        disabled={isEnhancing || !projectData.name || !projectData.description}
                        className="h-8 gap-1"
                      >
                        {isEnhancing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Enhancing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            <span>Enhance with AI</span>
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (projectData.projectType && projectData.name) {
                          generateDescriptionFromProjectType(projectData.projectType, projectData.name)
                        }
                      }}
                      disabled={isGeneratingDescription || !projectData.projectType || !projectData.name}
                      className="h-8 gap-1"
                    >
                      {isGeneratingDescription ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          <span>Regenerate</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="project-description"
                  placeholder={
                    isGeneratingDescription
                      ? "Generating description..."
                      : "Description will be generated based on project type..."
                  }
                  rows={4}
                  value={projectData.description}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  className={isGeneratingDescription ? "opacity-50" : ""}
                />
                {isGeneratingDescription && (
                  <p className="text-xs text-muted-foreground">Generating description based on project type...</p>
                )}
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

              {/* Categories - AI-driven */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="categories">Categories</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCategoryDialog(true)}
                      className="h-8 gap-1"
                    >
                      <Tag className="h-4 w-4" />
                      <span>Add Category</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (projectData.projectType) {
                          generateCategoriesFromProjectType(projectData.projectType)
                        }
                      }}
                      disabled={isGeneratingCategories || !projectData.projectType}
                      className="h-8 gap-1"
                    >
                      {isGeneratingCategories ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>Suggest Categories</span>
                        </>
                      )}
                    </Button>
                  </div>
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
                      {isGeneratingCategories
                        ? "Generating categories based on project type..."
                        : "No categories added yet. Categories will be suggested based on project type."}
                    </span>
                  )}
                </div>
              </div>

              {/* Technology Stack */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tech-stack">Technology Stack</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateTechStack}
                    disabled={isGeneratingStack || !projectData.description}
                    className="h-8 gap-1"
                  >
                    {isGeneratingStack ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Suggest Stack</span>
                      </>
                    )}
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

                {aiSuggestions && (
                  <Alert className="mt-2">
                    <div className="flex flex-col space-y-2">
                      <AlertDescription className="mt-2">
                        <div className="prose prose-sm max-w-none">
                          <div className="mb-2 font-medium flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            AI Suggested Technology Stack
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {aiSuggestions.techStack.map((tech) => (
                              <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-xs text-muted-foreground whitespace-pre-line">
                            {aiSuggestions.reasoning}
                          </div>
                          <div className="flex justify-end mt-2">
                            <Button size="sm" onClick={applyAiSuggestions} className="flex items-center gap-1">
                              <Check className="h-4 w-4" />
                              Apply Suggestions
                            </Button>
                          </div>
                        </div>
                      </AlertDescription>
                    </div>
                  </Alert>
                )}

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
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Chat Preview</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  As you fill out the form, our AI assistant will be ready to help you plan your project. You can chat
                  with the assistant at any time during the setup process.
                </p>
                <div className="h-24 bg-muted/30 rounded-md border border-dashed flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">
                    Complete the form to start chatting with your project assistant
                  </span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="agent" className="h-[500px] flex flex-col">
              {/* Replace the old agent chat with our new unified chat system */}
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

        {/* Category Dialog */}
        <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>Add a category to help organize your project</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category Name</Label>
                <Input
                  id="category"
                  placeholder="Frontend, Backend, Mobile..."
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyDown={handleCategoryKeyDown}
                />
              </div>
              <div>
                <Label>Suggested Categories</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PREDEFINED_CATEGORIES.filter(
                    (category) => !projectData.categories || !projectData.categories.includes(category),
                  )
                    .slice(0, 8)
                    .map((category) => (
                      <Badge
                        key={category}
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary"
                        onClick={() => addCategory(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  addCategory(categoryInput)
                  setShowCategoryDialog(false)
                }}
                disabled={!categoryInput.trim()}
              >
                Add Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </>
  )
}
