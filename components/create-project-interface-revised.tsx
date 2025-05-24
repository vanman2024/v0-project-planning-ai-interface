"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "./app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "./file-uploader"
import { GitHubImporter } from "./github-importer"
import { WebsiteImporter } from "./website-importer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ProjectDocumentation } from "./project-documentation"
import { MessageSquare, FileUp, ArrowRight, Check, Edit, Sparkles, RefreshCw, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ProjectAssistant } from "./project-assistant" // Import our new component

// Define the project context type
interface ProjectContext {
  name: string
  description: string
  techStack: string[]
  projectType: string
  categories: string[]
  requirements: string[]
  architecture: string
  files: any[]
  repositories: any[]
  links: any[]
  importProgress: number
  analysisComplete: boolean
  documentationGenerated: boolean
}

export function CreateProjectInterfaceRevised() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("import")
  const [isEditing, setIsEditing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Initialize project context with default values
  const [projectContext, setProjectContext] = useState<ProjectContext>({
    name: "",
    description: "",
    techStack: [],
    projectType: "",
    categories: [],
    requirements: [],
    architecture: "",
    files: [],
    repositories: [],
    links: [],
    importProgress: 0,
    analysisComplete: false,
    documentationGenerated: false,
  })

  // Update project context
  const updateProjectContext = (updates: Partial<ProjectContext>) => {
    setProjectContext((prev) => ({ ...prev, ...updates }))
  }

  // Generate a project ID based on the name
  const projectId = projectContext.name
    ? `project-${projectContext.name.toLowerCase().replace(/\s+/g, "-")}`
    : "new-project"

  // Simulate resource analysis progress
  useEffect(() => {
    if (
      (projectContext.files.length > 0 || projectContext.repositories.length > 0 || projectContext.links.length > 0) &&
      projectContext.importProgress < 100 &&
      !projectContext.analysisComplete
    ) {
      setIsAnalyzing(true)
      const interval = setInterval(() => {
        updateProjectContext({
          importProgress: Math.min(projectContext.importProgress + 10, 100),
        })
      }, 800)

      return () => clearInterval(interval)
    } else if (projectContext.importProgress === 100 && !projectContext.analysisComplete) {
      setTimeout(() => {
        updateProjectContext({ analysisComplete: true })
        setIsAnalyzing(false)
      }, 1000)
    }
  }, [
    projectContext.files,
    projectContext.repositories,
    projectContext.links,
    projectContext.importProgress,
    projectContext.analysisComplete,
  ])

  // Generate project documentation based on analysis
  const generateProjectDocumentation = () => {
    if (!projectContext.analysisComplete) return

    setIsGenerating(true)

    // Simulate AI generating project documentation
    setTimeout(() => {
      // This would be replaced with actual AI-generated content
      updateProjectContext({
        name: projectContext.repositories[0]?.name || "New Project",
        description:
          "An innovative application that leverages modern technologies to deliver a seamless user experience. Based on the imported resources, this project appears to focus on project planning and management with AI assistance.",
        projectType: "web-app",
        techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
        categories: ["Project Management", "AI", "Productivity", "Full-Stack"],
        requirements: [
          "User authentication and profile management",
          "Project creation and configuration",
          "AI-assisted project planning",
          "Resource management and organization",
          "Collaborative project documentation",
        ],
        architecture:
          "The application follows a modern React architecture using Next.js App Router. It leverages context providers for state management and uses a component-based approach with clear separation of concerns. The UI is built with Tailwind CSS and shadcn/ui components for a consistent design system.",
        documentationGenerated: true,
      })
      setIsGenerating(false)
    }, 3000)
  }

  // Determine if we can proceed to documentation
  const canProceedToDocumentation = projectContext.analysisComplete || projectContext.documentationGenerated

  // Handle tab change
  const handleTabChange = (value: string) => {
    // If trying to go to documentation without analysis, prevent it
    if (value === "documentation" && !canProceedToDocumentation) {
      return
    }
    setActiveTab(value)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold">Create New Project</h1>
          <div className="ml-auto">
            <Button variant="outline" size="sm" onClick={() => router.push("/chat")}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Go to Project Chat
            </Button>
          </div>
        </header>
        <div className="flex flex-col gap-4 p-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="import">
                <FileUp className="h-4 w-4 mr-2" />
                Import Resources
              </TabsTrigger>
              <TabsTrigger value="assistant">
                <MessageSquare className="h-4 w-4 mr-2" />
                Project Assistant
              </TabsTrigger>
              <TabsTrigger
                value="documentation"
                disabled={!canProceedToDocumentation}
                className={!canProceedToDocumentation ? "opacity-50 cursor-not-allowed" : ""}
              >
                <Edit className="h-4 w-4 mr-2" />
                Project Documentation
              </TabsTrigger>
            </TabsList>

            {/* Import Resources Tab */}
            <TabsContent value="import" className="mt-4 space-y-4">
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle>Start by importing your resources</AlertTitle>
                <AlertDescription>
                  Import files, GitHub repositories, or website content to help our AI assistant understand your project
                  better. The assistant will analyze these resources to generate initial project documentation.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileUploader files={projectContext.files} onUpdate={(files) => updateProjectContext({ files })} />
                <WebsiteImporter
                  links={projectContext.links || []}
                  onUpdate={(links) => updateProjectContext({ links })}
                />
                <GitHubImporter
                  repositories={projectContext.repositories}
                  onUpdate={(repositories) => updateProjectContext({ repositories })}
                />
              </div>

              {(projectContext.files.length > 0 ||
                projectContext.repositories.length > 0 ||
                projectContext.links.length > 0) && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Resource Analysis</CardTitle>
                    <CardDescription>Our AI assistant is analyzing your imported resources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Analysis progress</span>
                        <span>{projectContext.importProgress}%</span>
                      </div>
                      <Progress value={projectContext.importProgress} className="h-2" />

                      {projectContext.analysisComplete && (
                        <div className="mt-4 flex items-center text-green-600">
                          <Check className="h-4 w-4 mr-2" />
                          <span>
                            Analysis complete! You can now chat with our Project Assistant or generate documentation.
                          </span>
                        </div>
                      )}

                      {isAnalyzing && (
                        <div className="text-xs text-muted-foreground mt-2">
                          <ul className="space-y-1">
                            <li>• Scanning file contents...</li>
                            <li>• Identifying technologies used...</li>
                            <li>• Analyzing code structure...</li>
                            <li>• Determining project architecture...</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-between w-full">
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab("assistant")}
                        disabled={!projectContext.analysisComplete}
                      >
                        Chat with Project Assistant
                        <MessageSquare className="h-4 w-4 ml-2" />
                      </Button>

                      <Button
                        onClick={generateProjectDocumentation}
                        disabled={!projectContext.analysisComplete || isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            Generate Documentation
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )}

              <div className="flex justify-end mt-4 space-x-2">
                <Button
                  variant={projectContext.analysisComplete ? "default" : "outline"}
                  onClick={() => setActiveTab("assistant")}
                >
                  Continue to Project Assistant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </TabsContent>

            {/* Project Assistant Tab */}
            <TabsContent value="assistant" className="mt-4 space-y-4">
              <Card className="h-[600px]">
                <CardContent className="p-0 h-full">
                  <ProjectAssistant
                    projectId={projectId}
                    projectName={projectContext.name || "New Project"}
                    projectDescription={projectContext.description}
                    onUpdateProject={updateProjectContext}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" onClick={() => setActiveTab("import")}>
                  Back to Resources
                </Button>
                <Button onClick={() => setActiveTab("documentation")} disabled={!canProceedToDocumentation}>
                  Continue to Documentation
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </TabsContent>

            {/* Project Documentation Tab */}
            <TabsContent value="documentation" className="mt-4 space-y-4">
              {projectContext.documentationGenerated ? (
                <ProjectDocumentation
                  projectData={projectContext}
                  isEditing={isEditing}
                  onEdit={() => setIsEditing(true)}
                  onSave={(updates) => {
                    updateProjectContext(updates)
                    setIsEditing(false)
                  }}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-xl font-medium">Documentation Not Generated Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      You need to generate project documentation first. Go back to the Project Assistant tab and click
                      "Generate Documentation".
                    </p>
                    <Button onClick={() => setActiveTab("assistant")}>Back to Project Assistant</Button>
                  </div>
                </Card>
              )}

              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" onClick={() => setActiveTab("assistant")}>
                  Back to Project Assistant
                </Button>
                <Button>
                  Finalize Project
                  <Check className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
