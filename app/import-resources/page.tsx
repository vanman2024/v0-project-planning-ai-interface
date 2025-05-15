"use client"

import { useState } from "react"
import { WebsiteImporter } from "@/components/website-importer"
import { AIContentAnalyzer } from "@/components/ai-content-analyzer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUploader } from "@/components/file-uploader"
import { GithubImporter } from "@/components/github-importer"

export default function ImportResourcesPage() {
  const [activeTab, setActiveTab] = useState("files")
  const [websiteLinks, setWebsiteLinks] = useState<any[]>([])
  const [extractedContent, setExtractedContent] = useState("")

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Import Resources</h1>
        <p className="text-muted-foreground">
          Import files, websites, and repositories to use as references for your project
        </p>
      </div>

      <Tabs defaultValue="files" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="websites">Websites</TabsTrigger>
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-4">
          <FileUploader />
        </TabsContent>

        <TabsContent value="websites" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WebsiteImporter links={websiteLinks} onUpdate={setWebsiteLinks} />

            <Card>
              <CardHeader>
                <CardTitle>Advanced Extraction</CardTitle>
                <CardDescription>Use the advanced extractor for more detailed content analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm">
                    The advanced extractor provides more detailed content extraction with customizable options and
                    comprehensive analysis.
                  </p>
                  <div className="flex justify-between">
                    <a href="/website-extractor" className="text-sm text-blue-500 hover:underline">
                      Open Advanced Extractor
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {websiteLinks.some((link) => link.status === "imported") && (
            <div className="mt-8">
              <AIContentAnalyzer
                content={websiteLinks.find((link) => link.status === "imported")?.extractedContent?.text || ""}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="repositories" className="space-y-4">
          <GithubImporter />
        </TabsContent>
      </Tabs>
    </div>
  )
}
