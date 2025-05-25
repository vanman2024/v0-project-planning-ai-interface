"use client"

import { useState } from "react"
import { AppSidebar } from "./app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "./file-uploader"
import { GitHubImporter } from "./github-importer"
import { ProjectSetupForm } from "./project-setup-form"
import { ResourceManager } from "./resource-manager"
import { WebsiteImporter } from "./website-importer"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

export function CreateProjectInterface() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("setup")
  const [projectContext, setProjectContext] = useState({
    name: "",
    description: "",
    techStack: [],
    projectType: "",
    categories: [],
    files: [],
    repositories: [],
    links: [],
  })

  const updateProjectContext = (updates: Partial<typeof projectContext>) => {
    setProjectContext((prev) => ({ ...prev, ...updates }))
  }

  // Generate a project ID based on the name
  const projectId = projectContext.name
    ? `project-${projectContext.name.toLowerCase().replace(/\s+/g, "-")}`
    : "new-project"

  const projectName = projectContext.name || "New Project"

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
              Go to All Project Chats
            </Button>
          </div>
        </header>
        <div className="flex flex-col gap-4 p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="setup">Project Setup</TabsTrigger>
              <TabsTrigger value="import">Import Resources</TabsTrigger>
              <TabsTrigger value="resources">Manage Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="mt-4">
              <ProjectSetupForm
                projectData={projectContext}
                onUpdate={updateProjectContext}
                onComplete={() => setActiveTab("import")}
              />
            </TabsContent>

            <TabsContent value="import" className="mt-4">
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
              <div className="flex justify-end mt-4 space-x-2">
                <button className="px-4 py-2 bg-muted rounded-md" onClick={() => setActiveTab("setup")}>
                  Back
                </button>
                <button
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
                  onClick={() => setActiveTab("resources")}
                >
                  Continue
                </button>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="mt-4">
              <ResourceManager projectId={projectId} />
              <div className="flex justify-end mt-4 space-x-2">
                <button className="px-4 py-2 bg-muted rounded-md" onClick={() => setActiveTab("import")}>
                  Back
                </button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Finish Setup</button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
