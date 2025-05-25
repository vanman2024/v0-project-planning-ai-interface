"use client"

import { useState } from "react"
import { AppSidebar } from "./app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { ProjectSetupFormSimplified } from "./project-setup-form-simplified"
import { ResourceManager } from "./resource-manager"

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
              <ProjectSetupFormSimplified
                projectData={projectContext}
                onUpdate={updateProjectContext}
                onComplete={() => setActiveTab("import")}
              />
            </TabsContent>

            <TabsContent value="import" className="mt-4">
              <ResourceManager projectId={projectId} mode="import" />
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" onClick={() => setActiveTab("setup")}>
                  Back
                </Button>
                <Button onClick={() => setActiveTab("resources")}>Continue</Button>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="mt-4">
              <ResourceManager projectId={projectId} mode="manage" />
              <div className="flex justify-end mt-4 space-x-2">
                <Button variant="outline" onClick={() => setActiveTab("import")}>
                  Back
                </Button>
                <Button>Finish Setup</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
