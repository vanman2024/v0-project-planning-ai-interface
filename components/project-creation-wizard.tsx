"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  Link,
  Github,
  Globe,
  Sparkles,
  Bot,
  CheckCircle2,
  Plus,
  X,
  Lightbulb,
  Target,
  Users,
  Calendar,
  Zap,
  Send,
  MessageSquare,
  User,
  FileCode,
  FileIcon as FilePdf,
  FileImage,
  FileTextIcon as FileText2,
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Wand2,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProjectCreationWizardProps {
  onComplete: (projectData: any) => void
  onCancel: () => void
}

export function ProjectCreationWizard({ onComplete, onCancel }: ProjectCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    category: "",
    timeline: "",
    team: [] as string[],
    goals: [] as string[],
    resources: [] as any[],
    extractedInfo: [] as any[],
    aiSuggestions: {
      accepted: [] as string[],
      rejected: [] as string[],
    },
  })
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      id: "1",
      sender: "agent",
      content:
        "Hi there! I'm your Project Planning Assistant. Ask me anything about creating your project! You can also ask me to fill in information for you.",
      timestamp: new Date().toISOString(),
    },
  ])
  const [message, setMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState("")
  const [expandedInfo, setExpandedInfo] = useState<string[]>([])
  const [websiteUrls, setWebsiteUrls] = useState<string[]>([])
  const [currentWebsiteUrl, setCurrentWebsiteUrl] = useState("")
  const [isAgentFilling, setIsAgentFilling] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  const steps = [
    { id: "basics", title: "Project Basics", icon: FileText, description: "Name and describe your project" },
    { id: "goals", title: "Goals & Objectives", icon: Target, description: "What do you want to achieve?" },
    { id: "resources", title: "Resources & Files", icon: Upload, description: "Import existing materials" },
    { id: "team", title: "Team Setup", icon: Users, description: "Who's working on this?" },
    { id: "timeline", title: "Timeline", icon: Calendar, description: "When do you need it done?" },
    { id: "ai-review", title: "AI Review", icon: Sparkles, description: "Get personalized suggestions" },
  ]

  const projectCategories = [
    { value: "mobile-app", label: "Mobile App 📱", description: "iOS, Android, or cross-platform" },
    { value: "web-app", label: "Web Application 🌐", description: "Browser-based applications" },
    { value: "website", label: "Website 🖥️", description: "Marketing or informational sites" },
    { value: "enterprise", label: "Enterprise Software 🏢", description: "Business solutions" },
    { value: "ecommerce", label: "E-commerce 🛒", description: "Online stores and marketplaces" },
    { value: "saas", label: "SaaS Product ☁️", description: "Software as a Service" },
    { value: "other", label: "Other 🔧", description: "Something different" },
  ]

  const timelineOptions = [
    { value: "1-month", label: "1 Month", description: "Quick MVP or prototype" },
    { value: "3-months", label: "3 Months", description: "Standard project timeline" },
    { value: "6-months", label: "6 Months", description: "Complex project with multiple phases" },
    { value: "1-year", label: "1 Year+", description: "Large-scale enterprise project" },
    { value: "flexible", label: "Flexible", description: "No fixed deadline" },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <FileImage className="w-5 h-5 text-blue-600" />
    if (fileType.includes("pdf")) return <FilePdf className="w-5 h-5 text-red-600" />
    if (fileType.includes("javascript") || fileType.includes("typescript") || fileType.includes("json"))
      return <FileCode className="w-5 h-5 text-yellow-600" />
    return <FileText2 className="w-5 h-5 text-orange-600" />
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setIsProcessing(true)
    setProcessingStatus("Uploading files...")

    // Simulate file processing
    setTimeout(() => {
      setProcessingStatus("Analyzing file contents...")

      setTimeout(() => {
        setProcessingStatus("Extracting relevant information...")

        setTimeout(() => {
          const newResources = files.map((file) => ({
            id: Date.now() + Math.random(),
            name: file.name,
            type: file.type,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            file: file,
            url: URL.createObjectURL(file),
          }))

          // Add extracted information based on file types
          const newExtractedInfo = [
            ...projectData.extractedInfo,
            {
              id: `extract-${Date.now()}`,
              source: files[0].name,
              type: "key-findings",
              content: "Found potential user requirements and technical specifications.",
              details: [
                "User authentication required",
                "Mobile responsive design needed",
                "Payment processing integration",
                "Data export functionality",
              ],
            },
            {
              id: `extract-${Date.now() + 1}`,
              source: files[0].name,
              type: "suggested-features",
              content: "Identified 3 core features from your documents.",
              details: ["User dashboard with analytics", "Notification system", "File sharing capabilities"],
            },
          ]

          setProjectData((prev) => ({
            ...prev,
            resources: [...prev.resources, ...newResources],
            extractedInfo: newExtractedInfo,
          }))

          // Add AI message about the upload
          setChatMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: "agent",
              content: `I've analyzed the ${files.length} file(s) you uploaded. I found some potential requirements and features that might be relevant to your project. Check the "Extracted Information" section to see what I found!`,
              timestamp: new Date().toISOString(),
            },
          ])

          setIsProcessing(false)
        }, 1500)
      }, 1500)
    }, 1000)
  }

  const handleUrlImport = (type: string, url: string) => {
    if (!url) return

    setIsProcessing(true)
    setProcessingStatus(`Analyzing ${type === "github" ? "GitHub repository" : "website content"}...`)

    // Simulate URL processing
    setTimeout(() => {
      const newResource = {
        id: Date.now() + Math.random(),
        name: url.split("/").pop() || url,
        type: type === "github" ? "github-repo" : "website",
        url: url,
      }

      // Add extracted information based on URL type
      const newExtractedInfo = [
        ...projectData.extractedInfo,
        {
          id: `extract-${Date.now()}`,
          source: url,
          type: type === "github" ? "repository-analysis" : "website-analysis",
          content:
            type === "github"
              ? "Analyzed repository structure and dependencies."
              : "Extracted content and structure from website.",
          details:
            type === "github"
              ? ["React-based frontend", "Node.js backend", "MongoDB database", "Authentication system in place"]
              : [
                  "Modern design with responsive layout",
                  "Contact form functionality",
                  "Blog section with categories",
                  "User testimonials section",
                ],
        },
      ]

      setProjectData((prev) => ({
        ...prev,
        resources: [...prev.resources, newResource],
        extractedInfo: newExtractedInfo,
      }))

      // Add AI message about the URL import
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "agent",
          content:
            type === "github"
              ? `I've analyzed the GitHub repository at ${url}. I found information about the tech stack and structure that might be helpful for your project planning.`
              : `I've analyzed the website at ${url}. I extracted information about its structure and features that might be relevant to your project.`,
          timestamp: new Date().toISOString(),
        },
      ])

      // If it's a website URL, clear the current input and add to the list
      if (type === "website") {
        setCurrentWebsiteUrl("")
        if (!websiteUrls.includes(url)) {
          setWebsiteUrls((prev) => [...prev, url])
        }
      }

      setIsProcessing(false)
    }, 3000)
  }

  const removeResource = (resourceId: number) => {
    setProjectData((prev) => ({
      ...prev,
      resources: prev.resources.filter((r) => r.id !== resourceId),
    }))
  }

  const addGoal = (goal: string) => {
    if (goal.trim()) {
      setProjectData((prev) => ({
        ...prev,
        goals: [...prev.goals, goal.trim()],
      }))
    }
  }

  const removeGoal = (index: number) => {
    setProjectData((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }))
  }

  const addTeamMember = (member: string) => {
    if (member.trim()) {
      setProjectData((prev) => ({
        ...prev,
        team: [...prev.team, member.trim()],
      }))
    }
  }

  const removeTeamMember = (index: number) => {
    setProjectData((prev) => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== index),
    }))
  }

  const handleAgentFill = (section?: string) => {
    setIsAgentFilling(true)

    // Add user message if this was triggered from a button
    if (section) {
      const userMessage = {
        id: Date.now().toString(),
        sender: "user",
        content: `Can you fill in the ${section} for me?`,
        timestamp: new Date().toISOString(),
      }
      setChatMessages((prev) => [...prev, userMessage])
    }

    // Simulate agent thinking
    setTimeout(() => {
      const agentMessage = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        content: `I'll help you fill in the ${section || "project information"}. Let me analyze what we have so far...`,
        timestamp: new Date().toISOString(),
      }
      setChatMessages((prev) => [...prev, agentMessage])

      // Simulate agent filling in information
      setTimeout(() => {
        const updatedData = { ...projectData }

        // Fill in different sections based on the current step or requested section
        if (section === "basics" || currentStep === 0) {
          updatedData.name = updatedData.name || "Customer Portal Redesign"
          updatedData.description =
            updatedData.description ||
            "A modern, user-friendly interface for our existing customer portal with improved navigation and self-service features. The project aims to reduce support tickets by 30% and increase customer satisfaction scores."
          updatedData.category = updatedData.category || "web-app"
        }

        if (section === "goals" || currentStep === 1) {
          const suggestedGoals = [
            "Improve user experience with intuitive navigation",
            "Reduce customer support tickets by 30%",
            "Increase self-service usage by 50%",
            "Implement responsive design for all devices",
            "Launch MVP within 3 months",
          ]

          // Only add goals that don't already exist
          const newGoals = suggestedGoals.filter((goal) => !updatedData.goals.includes(goal))
          updatedData.goals = [...updatedData.goals, ...newGoals]
        }

        if (section === "team" || currentStep === 3) {
          const suggestedTeam = [
            "Alex Chen (Project Manager)",
            "Jordan Smith (UX Designer)",
            "Taylor Wong (Frontend Developer)",
            "Sam Johnson (Backend Developer)",
            "Riley Garcia (QA Tester)",
          ]

          // Only add team members that don't already exist
          const newTeamMembers = suggestedTeam.filter((member) => !updatedData.team.includes(member))
          updatedData.team = [...updatedData.team, ...newTeamMembers]
        }

        if (section === "timeline" || currentStep === 4) {
          updatedData.timeline = updatedData.timeline || "3-months"
        }

        // Update the project data
        setProjectData(updatedData)

        // Send completion message
        const completionMessage = {
          id: (Date.now() + 2).toString(),
          sender: "agent",
          content: `I've filled in the ${section || "project information"} based on my analysis. Feel free to review and modify anything that doesn't match your vision!`,
          timestamp: new Date().toISOString(),
        }
        setChatMessages((prev) => [...prev, completionMessage])

        setIsAgentFilling(false)
      }, 2000)
    }, 1000)
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: message,
      timestamp: new Date().toISOString(),
    }

    setChatMessages((prev) => [...prev, userMessage])

    // Check if the user is asking the agent to fill in information
    const fillKeywords = ["fill", "complete", "populate", "generate", "create", "suggest", "help me with"]
    const sectionKeywords = {
      basics: ["basics", "name", "description", "project details", "information"],
      goals: ["goals", "objectives", "targets", "aims"],
      team: ["team", "members", "people", "staff", "roles"],
      timeline: ["timeline", "schedule", "deadline", "timeframe", "when"],
      all: ["everything", "all", "all sections", "all fields", "all information"],
    }

    const lowerMessage = message.toLowerCase()

    // Check if the message contains fill keywords
    const hasFillKeyword = fillKeywords.some((keyword) => lowerMessage.includes(keyword))

    // Determine which section to fill
    let sectionToFill: string | undefined

    if (hasFillKeyword) {
      if (sectionKeywords.all.some((keyword) => lowerMessage.includes(keyword))) {
        sectionToFill = "all"
      } else if (sectionKeywords.basics.some((keyword) => lowerMessage.includes(keyword))) {
        sectionToFill = "basics"
      } else if (sectionKeywords.goals.some((keyword) => lowerMessage.includes(keyword))) {
        sectionToFill = "goals"
      } else if (sectionKeywords.team.some((keyword) => lowerMessage.includes(keyword))) {
        sectionToFill = "team"
      } else if (sectionKeywords.timeline.some((keyword) => lowerMessage.includes(keyword))) {
        sectionToFill = "timeline"
      }
    }

    setMessage("")

    // If the user is asking to fill in information, handle it
    if (sectionToFill) {
      handleAgentFill(sectionToFill === "all" ? undefined : sectionToFill)
      return
    }

    // Otherwise, simulate regular agent response after a short delay
    setTimeout(() => {
      let response = ""

      // Generate contextual responses based on the current step and message content
      if (message.toLowerCase().includes("help") || message.toLowerCase().includes("how")) {
        if (currentStep === 0) {
          response =
            "I can help you define your project! Start by giving it a clear name and description. The more details you provide, the better I can assist you with planning. Or I can fill in some sample information for you - just ask!"
        } else if (currentStep === 1) {
          response =
            "For goals, think about what success looks like for this project. What specific outcomes do you want to achieve? I can suggest some common goals based on your project type if you'd like."
        } else if (currentStep === 2) {
          response =
            "You can upload any existing documents, mockups, or specifications. I'll analyze them to extract requirements and features. You can also import from GitHub or websites."
        } else {
          response =
            "I'm here to help with any aspect of your project planning. What specific questions do you have? I can also fill in information for you - just ask!"
        }
      } else if (message.toLowerCase().includes("example") || message.toLowerCase().includes("suggestion")) {
        if (currentStep === 0) {
          response =
            "Here's an example: 'Customer Portal Redesign - A modern, user-friendly interface for our existing customer portal with improved navigation and self-service features.'"
        } else if (currentStep === 1) {
          response =
            "Some example goals might be: 'Increase user engagement by 30%', 'Reduce customer support tickets by 25%', or 'Launch MVP within 3 months'."
        } else if (currentStep === 2) {
          response =
            "You could upload your existing wireframes, user stories, or technical specifications. Even rough sketches or notes can be helpful!"
        } else {
          response =
            "I'd be happy to provide examples! Could you specify which aspect of the project you'd like examples for?"
        }
      } else if (message.toLowerCase().includes("timeline") || message.toLowerCase().includes("deadline")) {
        response =
          "When setting your timeline, be realistic about your team's capacity. For complex projects, I recommend adding buffer time for unexpected challenges. Would you like me to suggest a timeline based on your project scope?"
      } else if (message.toLowerCase().includes("team") || message.toLowerCase().includes("people")) {
        response =
          "Your team composition depends on your project needs. Typically, you'll want a mix of skills: design, development, testing, and project management. How big is your current team?"
      } else {
        response =
          "Thanks for sharing that information! I'll keep it in mind as we build your project plan. Is there anything specific you'd like help with at this stage? I can also fill in information for you - just ask!"
      }

      const agentMessage = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        content: response,
        timestamp: new Date().toISOString(),
      }

      setChatMessages((prev) => [...prev, agentMessage])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const toggleInfoExpanded = (id: string) => {
    setExpandedInfo((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Project Basics
        return (
          <div className="space-y-6">
            <Card className="border-2 border-blue-100">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar className="bg-blue-100">
                    <Bot className="h-5 w-5 text-blue-700" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Hi! I'm your Project Planning Assistant 👋</CardTitle>
                    <CardDescription>
                      Let's start by giving your project a name and telling me what it's about. I'll help you create a
                      comprehensive plan!
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Project Information</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAgentFill("basics")}
                        disabled={isAgentFilling}
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        {isAgentFilling ? "Filling..." : "Auto-fill"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Let the AI fill in this section for you</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="e.g., Coffee Shop Mobile App"
                  value={projectData.name}
                  onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">Choose a memorable name for your project</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-description">Project Description</Label>
                <Textarea
                  id="project-description"
                  placeholder="Tell me about your project... What problem does it solve? Who is it for?"
                  value={projectData.description}
                  onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">The more details you provide, the better I can help!</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-category">Project Category</Label>
                <Select
                  value={projectData.category}
                  onValueChange={(value) => setProjectData({ ...projectData, category: value })}
                >
                  <SelectTrigger id="project-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div>
                          <div>{category.label}</div>
                          <div className="text-xs text-muted-foreground">{category.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {projectData.name && projectData.description && (
              <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">AI Suggestion</p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Based on your description, this sounds like a great project! I'd recommend starting with user
                        research and creating a clear feature list. Let's continue to define your goals!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )

      case 1: // Goals & Objectives
        return (
          <div className="space-y-6">
            <Card className="border-2 border-purple-100">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar className="bg-purple-100">
                    <Bot className="h-5 w-5 text-purple-700" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Let's Define Your Goals 🎯</CardTitle>
                    <CardDescription>
                      Clear goals help keep your project on track. What do you want to achieve?
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Project Goals</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAgentFill("goals")}
                        disabled={isAgentFilling}
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        {isAgentFilling ? "Filling..." : "Suggest Goals"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Let the AI suggest goals for your project</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a goal (e.g., Launch MVP by December)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addGoal((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).value = ""
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder*="Add a goal"]') as HTMLInputElement
                      if (input) {
                        addGoal(input.value)
                        input.value = ""
                      }
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {projectData.goals.length > 0 && (
                <div className="space-y-2">
                  {projectData.goals.map((goal, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <Target className="w-4 h-4 text-purple-600" />
                      <span className="flex-1">{goal}</span>
                      <Button variant="ghost" size="icon" onClick={() => removeGoal(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {projectData.category && (
                <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                          Suggested Goals for {projectCategories.find((c) => c.value === projectData.category)?.label}
                        </p>
                        <div className="mt-2 space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => addGoal("Create user-friendly interface")}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create user-friendly interface
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => addGoal("Implement core features")}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Implement core features
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => addGoal("Ensure scalability and performance")}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Ensure scalability and performance
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )

      case 2: // Resources & Files
        return (
          <div className="space-y-6">
            <Card className="border-2 border-green-100">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar className="bg-green-100">
                    <Bot className="h-5 w-5 text-green-700" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Import Your Resources 📁</CardTitle>
                    <CardDescription>
                      Have any existing documents, images, or files? Upload them here and I'll help incorporate them
                      into your project plan.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </TabsTrigger>
                <TabsTrigger value="github">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </TabsTrigger>
                <TabsTrigger value="url">
                  <Globe className="w-4 h-4 mr-2" />
                  From URL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    ref={fileInputRef}
                    accept="image/*,.pdf,.doc,.docx,.txt,.md,.js,.ts,.json"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
                    <p className="text-sm text-muted-foreground">Support for images, PDFs, Word docs, and text files</p>
                    <Button className="mt-4" onClick={() => fileInputRef.current?.click()}>
                      Choose Files
                    </Button>
                  </label>
                </div>

                {isProcessing && (
                  <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="text-blue-700 dark:text-blue-300">{processingStatus}</span>
                  </div>
                )}

                {projectData.resources.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Resources</Label>
                    {projectData.resources.map((resource) => (
                      <div
                        key={resource.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                      >
                        {resource.type === "github-repo" ? (
                          <Github className="w-5 h-5 text-purple-600" />
                        ) : resource.type === "website" ? (
                          <Globe className="w-5 h-5 text-green-600" />
                        ) : (
                          getFileIcon(resource.type)
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{resource.name}</p>
                          {resource.size && <p className="text-xs text-muted-foreground">{resource.size}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          {resource.url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                                View
                              </a>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => removeResource(resource.id)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {projectData.extractedInfo.length > 0 && (
                  <div className="space-y-2 mt-6">
                    <Label>Extracted Information</Label>
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        {projectData.extractedInfo.map((info) => (
                          <div key={info.id} className="space-y-2">
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() => toggleInfoExpanded(info.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-600" />
                                <p className="font-medium text-sm">{info.content}</p>
                              </div>
                              <Button variant="ghost" size="sm">
                                {expandedInfo.includes(info.id) ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                            </div>

                            {expandedInfo.includes(info.id) && (
                              <div className="pl-6 space-y-1 text-sm text-muted-foreground">
                                <p className="text-xs">Source: {info.source}</p>
                                <ul className="space-y-1 mt-2">
                                  {info.details.map((detail: string, idx: number) => (
                                    <li key={idx} className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                                      {detail}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="github" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="github-url">GitHub Repository URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="github-url"
                      placeholder="https://github.com/username/repository"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUrlImport("github", (e.target as HTMLInputElement).value)
                          ;(e.target as HTMLInputElement).value = ""
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById("github-url") as HTMLInputElement
                        if (input) {
                          handleUrlImport("github", input.value)
                          input.value = ""
                        }
                      }}
                    >
                      <Link className="w-4 h-4 mr-2" />
                      Import
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Import code and documentation from GitHub</p>
                </div>

                {isProcessing && (
                  <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="text-blue-700 dark:text-blue-300">{processingStatus}</span>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website-url">Website URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="website-url"
                      placeholder="https://example.com"
                      value={currentWebsiteUrl}
                      onChange={(e) => setCurrentWebsiteUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUrlImport("website", currentWebsiteUrl)
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        if (currentWebsiteUrl) {
                          handleUrlImport("website", currentWebsiteUrl)
                        }
                      }}
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Extract content and information from websites</p>
                </div>

                {websiteUrls.length > 0 && (
                  <div className="space-y-2">
                    <Label>Added Websites</Label>
                    <div className="space-y-2">
                      {websiteUrls.map((url, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-green-600" />
                            <span className="text-sm truncate max-w-[200px]">{url}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                                View
                              </a>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setWebsiteUrls((prev) => prev.filter((_, i) => i !== index))
                                // Also remove from resources if needed
                                setProjectData((prev) => ({
                                  ...prev,
                                  resources: prev.resources.filter((r) => r.url !== url),
                                }))
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isProcessing && (
                  <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="text-blue-700 dark:text-blue-300">{processingStatus}</span>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )

      case 3: // Team Setup
        return (
          <div className="space-y-6">
            <Card className="border-2 border-orange-100">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar className="bg-orange-100">
                    <Bot className="h-5 w-5 text-orange-700" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Who's On Your Team? 👥</CardTitle>
                    <CardDescription>
                      Add team members so I can help assign tasks and manage workload effectively.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Team Members</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAgentFill("team")}
                        disabled={isAgentFilling}
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        {isAgentFilling ? "Filling..." : "Suggest Team"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Let the AI suggest team members for your project</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add team member (name or email)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addTeamMember((e.target as HTMLInputElement).value)
                        ;(e.target as HTMLInputElement).value = ""
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder*="Add team member"]') as HTMLInputElement
                      if (input) {
                        addTeamMember(input.value)
                        input.value = ""
                      }
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {projectData.team.length > 0 && (
                <div className="space-y-2">
                  {projectData.team.map((member, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{member.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="flex-1">{member}</span>
                      <Badge variant="outline">Team Member</Badge>
                      <Button variant="ghost" size="icon" onClick={() => removeTeamMember(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Show recommendations based on extracted info if available */}
              {projectData.extractedInfo.length > 0 && (
                <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-2">
                      <Users className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                          Team Recommendations Based on Your Files
                        </p>
                        <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
                          Based on the files you uploaded, I recommend including these roles:
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-orange-800 dark:text-orange-200">
                          <li>• Frontend Developer (React experience)</li>
                          <li>• Backend Developer (Node.js)</li>
                          <li>• UI/UX Designer</li>
                          <li>• QA Tester</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )

      case 4: // Timeline
        return (
          <div className="space-y-6">
            <Card className="border-2 border-indigo-100">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar className="bg-indigo-100">
                    <Bot className="h-5 w-5 text-indigo-700" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">When Do You Need This Done? 📅</CardTitle>
                    <CardDescription>
                      Setting a realistic timeline helps me create a better project plan with proper milestones.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Project Timeline</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAgentFill("timeline")}
                        disabled={isAgentFilling}
                      >
                        <Wand2 className="w-4 h-4 mr-2" />
                        {isAgentFilling ? "Filling..." : "Suggest Timeline"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Let the AI suggest a timeline for your project</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {timelineOptions.map((option) => (
                    <Card
                      key={option.value}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        projectData.timeline === option.value
                          ? "border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
                          : ""
                      }`}
                      onClick={() => setProjectData({ ...projectData, timeline: option.value })}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{option.label}</p>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                          {projectData.timeline === option.value && (
                            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {projectData.timeline && (
                <Card className="bg-indigo-50 dark:bg-indigo-950 border-indigo-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-5 h-5 text-indigo-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                          Suggested Milestones for{" "}
                          {timelineOptions.find((t) => t.value === projectData.timeline)?.label}
                        </p>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-indigo-800 dark:text-indigo-200">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                            Week 1-2: Planning & Design
                          </div>
                          <div className="flex items-center gap-2 text-sm text-indigo-800 dark:text-indigo-200">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                            Week 3-6: Core Development
                          </div>
                          <div className="flex items-center gap-2 text-sm text-indigo-800 dark:text-indigo-200">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                            Week 7-8: Testing & Polish
                          </div>
                          <div className="flex items-center gap-2 text-sm text-indigo-800 dark:text-indigo-200">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                            Final Week: Launch Preparation
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )

      case 5: // AI Review
        return (
          <div className="space-y-6">
            <Card className="border-2 border-gradient-to-r from-purple-100 to-blue-100">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar className="bg-gradient-to-r from-purple-100 to-blue-100">
                    <Sparkles className="h-5 w-5 text-purple-700" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Here's Your Personalized Project Plan! 🎉</CardTitle>
                    <CardDescription>
                      Based on everything you've told me, I've created a comprehensive plan for your project.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Project Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Project Name</p>
                    <p className="font-medium">{projectData.name || "Untitled Project"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">
                      {projectCategories.find((c) => c.value === projectData.category)?.label || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Timeline</p>
                    <p className="font-medium">
                      {timelineOptions.find((t) => t.value === projectData.timeline)?.label || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Team Size</p>
                    <p className="font-medium">{projectData.team.length || 0} members</p>
                  </div>
                </CardContent>
              </Card>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="goals">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      <span>Project Goals</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pl-7">
                      {projectData.goals.length > 0 ? (
                        projectData.goals.map((goal, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-600 rounded-full" />
                            <span>{goal}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No goals defined</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="resources">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-green-600" />
                      <span>Resources</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pl-7">
                      {projectData.resources.length > 0 ? (
                        projectData.resources.map((resource) => (
                          <div key={resource.id} className="flex items-center gap-2">
                            {resource.type === "github-repo" ? (
                              <Github className="w-4 h-4 text-purple-600" />
                            ) : resource.type === "website" ? (
                              <Globe className="w-4 h-4 text-green-600" />
                            ) : (
                              getFileIcon(resource.type)
                            )}
                            <span>{resource.name}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No resources uploaded</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="team">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-orange-600" />
                      <span>Team Members</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pl-7">
                      {projectData.team.length > 0 ? (
                        projectData.team.map((member, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{member.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{member}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No team members added</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Start with User Research</p>
                        <p className="text-sm text-muted-foreground">
                          Conduct surveys and interviews to validate your assumptions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Create a Design System</p>
                        <p className="text-sm text-muted-foreground">
                          Establish consistent UI patterns early in the project
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Set Up CI/CD Pipeline</p>
                        <p className="text-sm text-muted-foreground">
                          Automate testing and deployment from the beginning
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {projectData.extractedInfo.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      Insights from Your Files
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {projectData.extractedInfo.map((info) => (
                      <div key={info.id} className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                        <p className="font-medium text-sm">{info.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">Source: {info.source}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-2">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold">Your Project is Ready!</h3>
                    <p className="text-sm text-muted-foreground">
                      Click "Create Project" to get started. I'll be here to help you every step of the way!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>Let's build something amazing together</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAgentFill()}
                      disabled={isAgentFilling}
                      className="mr-2"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      {isAgentFilling ? "Filling..." : "Auto-fill All"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Let the AI fill in all project information</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="outline"
                size="icon"
                className={chatOpen ? "bg-blue-100 text-blue-700" : ""}
                onClick={() => setChatOpen(!chatOpen)}
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onCancel}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4 space-y-2">
            <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
            <div className="flex justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon
                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center ${
                      index <= currentStep ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index < currentStep
                          ? "bg-primary text-primary-foreground"
                          : index === currentStep
                            ? "bg-primary text-primary-foreground"
                            : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      {index < currentStep ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-4 h-4" />}
                    </div>
                    <span className="text-xs mt-1 hidden md:block">{step.title}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardHeader>

        <div className="flex flex-1 overflow-hidden">
          <CardContent className={`flex-1 overflow-y-auto p-6 ${chatOpen ? "w-1/2" : "w-full"}`}>
            {renderStepContent()}
          </CardContent>

          {chatOpen && (
            <div className="w-1/2 border-l flex flex-col h-full">
              <div className="p-3 border-b">
                <h3 className="font-medium flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  Chat with AI Assistant
                </h3>
              </div>
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`flex gap-3 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                        <Avatar className={msg.sender === "user" ? "bg-blue-100" : "bg-purple-100"}>
                          {msg.sender === "user" ? (
                            <User className="h-5 w-5 text-blue-700" />
                          ) : (
                            <Bot className="h-5 w-5 text-purple-700" />
                          )}
                          <AvatarFallback>{msg.sender === "user" ? "U" : "A"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div
                            className={`rounded-lg p-3 ${
                              msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{formatTime(msg.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me anything about your project..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4 flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => onComplete(projectData)}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
