"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectAssistant } from "./chat/project-assistant"
import { Badge } from "@/components/ui/badge"

export function ProjectPlanningDemo() {
  const [projectData, setProjectData] = useState({
    id: "project-1",
    name: "Project Planning AI Interface",
    description:
      "A comprehensive AI-powered project planning and management system designed to streamline the software development lifecycle.",
    features: [],
    tasks: [],
    timeline: null,
  })

  const handleUpdateProject = (updates: any) => {
    setProjectData((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Project Planning Assistant</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectAssistant
            projectId={projectData.id}
            projectName={projectData.name}
            projectDescription={projectData.description}
            onUpdateProject={handleUpdateProject}
          />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div>
                    <h3 className="font-medium mb-1">Project Name</h3>
                    <p>{projectData.name}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-1">Description</h3>
                    <p className="text-sm text-muted-foreground">{projectData.description}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-1">Status</h3>
                    <div className="flex gap-2">
                      <Badge variant="outline">Planning</Badge>
                      {projectData.features.length > 0 && (
                        <Badge variant="outline" className="bg-primary/10">
                          Features Defined
                        </Badge>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="features" className="mt-4">
                  {projectData.features.length > 0 ? (
                    <ul className="space-y-2">
                      {projectData.features.map((feature: string) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Badge className="h-2 w-2 rounded-full p-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No features defined yet. Use the Project Assistant to define features.
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="tasks" className="mt-4">
                  {projectData.tasks.length > 0 ? (
                    <ul className="space-y-2">
                      {projectData.tasks.map((task: string) => (
                        <li key={task} className="flex items-center gap-2">
                          <Badge className="h-2 w-2 rounded-full p-0" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No tasks defined yet. Use the Project Assistant to create tasks.
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">1. Start a conversation</h3>
                <p className="text-sm text-muted-foreground">
                  Begin by telling the Project Assistant what you want to accomplish.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium">2. Select suggestions</h3>
                <p className="text-sm text-muted-foreground">
                  Click on suggested actions or features to quickly make progress.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium">3. Switch agents</h3>
                <p className="text-sm text-muted-foreground">
                  Use specialized agents for specific aspects of your project planning.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium">4. Answer questions</h3>
                <p className="text-sm text-muted-foreground">
                  Provide details when asked to help the AI better understand your needs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
