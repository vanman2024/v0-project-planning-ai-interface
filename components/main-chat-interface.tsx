"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectAssistant } from "./project-assistant"
import { MessageSquare, FileText, Clock } from "lucide-react"

export function MainChatInterface() {
  const [activeTab, setActiveTab] = useState("assistant")

  return (
    <Card className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Project Planning</CardTitle>
            <TabsList>
              <TabsTrigger value="assistant">
                <MessageSquare className="h-4 w-4 mr-2" />
                Assistant
              </TabsTrigger>
              <TabsTrigger value="roadmap">
                <Clock className="h-4 w-4 mr-2" />
                Roadmap
              </TabsTrigger>
              <TabsTrigger value="documentation">
                <FileText className="h-4 w-4 mr-2" />
                Documentation
              </TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[600px]">
            <TabsContent value="assistant" className="h-full m-0">
              <ProjectAssistant />
            </TabsContent>
            <TabsContent value="roadmap" className="h-full m-0">
              <div className="flex items-center justify-center h-full p-6 text-center">
                <div>
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Roadmap Coming Soon</h3>
                  <p className="text-muted-foreground">
                    The roadmap will be automatically generated based on your conversations with the Project Assistant.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="documentation" className="h-full m-0">
              <div className="flex items-center justify-center h-full p-6 text-center">
                <div>
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Documentation Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Project documentation will be automatically generated once your features and roadmap are defined.
                  </p>
                </div>
              </div>
            </TabsContent>
          </div>
        </CardContent>
      </Tabs>
    </Card>
  )
}
