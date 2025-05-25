"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Download } from "lucide-react"
import type { ProjectFeature } from "@/lib/ai-utils"
import { toast } from "@/components/ui/use-toast"

interface DocumentationGeneratorProps {
  projectName: string
  projectDescription: string
  features: ProjectFeature[]
}

export function DocumentationGenerator({ projectName, projectDescription, features }: DocumentationGeneratorProps) {
  const [documentation, setDocumentation] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateDocumentation = async () => {
    if (!projectDescription || features.length === 0) {
      toast({
        title: "Missing information",
        description: "Project description and features are required to generate documentation.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/documentation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName,
          projectDescription,
          features,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate documentation")
      }

      const data = await response.json()
      setDocumentation(data.documentation)

      toast({
        title: "Documentation generated",
        description: "Project documentation has been successfully generated.",
      })
    } catch (error) {
      console.error("Error generating documentation:", error)
      toast({
        title: "Error generating documentation",
        description: "There was an error generating documentation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadDocumentation = () => {
    if (!documentation) return

    const blob = new Blob([documentation], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}-documentation.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Project Documentation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!documentation && !isGenerating && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No documentation yet</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Generate comprehensive documentation for your project based on its description and features.
            </p>
            <Button onClick={generateDocumentation}>Generate Documentation</Button>
          </div>
        )}

        {isGenerating && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        )}

        {documentation && !isGenerating && (
          <ScrollArea className="h-[400px] w-full rounded border p-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: documentation }} />
            </div>
          </ScrollArea>
        )}
      </CardContent>
      {documentation && (
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={downloadDocumentation}>
            <Download className="h-4 w-4 mr-2" />
            Download Documentation
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
