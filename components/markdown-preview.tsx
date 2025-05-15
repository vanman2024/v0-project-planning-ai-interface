"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Check, FileText, Code, Eye } from "lucide-react"
import { useTheme } from "next-themes"

interface MarkdownPreviewProps {
  content: string
  fileName?: string
  isLoading?: boolean
}

export function MarkdownPreview({ content, fileName, isLoading = false }: MarkdownPreviewProps) {
  const { resolvedTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<"preview" | "source">("preview")
  const [copied, setCopied] = useState(false)
  const isDarkTheme = resolvedTheme === "dark"

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-[70%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Simple function to render markdown with basic formatting
  const renderMarkdown = (markdown: string) => {
    // Process the markdown content
    const processedContent = markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-5">$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      // Code blocks
      .replace(/```([a-z]*)\n([\s\S]*?)```/gim, (match, lang, code) => {
        return `<pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code class="language-${lang}">${code
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</code></pre>`
      })
      // Inline code
      .replace(/`([^`]+)`/gim, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>')
      // Lists
      .replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-6 list-decimal">$1</li>')
      .replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
      // Task lists
      .replace(
        /^\s*- \[ \] (.*$)/gim,
        '<li class="ml-2 flex items-start"><input type="checkbox" class="mt-1 mr-2" disabled />$1</li>',
      )
      .replace(
        /^\s*- \[x\] (.*$)/gim,
        '<li class="ml-2 flex items-start"><input type="checkbox" class="mt-1 mr-2" checked disabled />$1</li>',
      )
      // Links
      .replace(
        /\[([^\]]+)\]$$([^)]+)$$/gim,
        '<a href="$2" class="text-primary underline underline-offset-2 hover:text-primary/80" target="_blank" rel="noopener noreferrer">$1</a>',
      )
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-muted pl-4 italic my-4">$1</blockquote>')
      // Horizontal rule
      .replace(/^---$/gim, '<hr class="border-border my-6" />')
      // Paragraphs
      .replace(/^\s*([^\n<][^\n]*[^\n<])\s*$/gim, '<p class="my-4">$1</p>')

    // Group list items
    let html = processedContent
    html = html.replace(/<li class="ml-6 list-disc">([\s\S]*?)(?=<\/li>)<\/li>/g, (match) => {
      return match.replace(/\n/g, "")
    })
    html = html.replace(
      /<li class="ml-6 list-disc">.*?<\/li>(?:\s*<li class="ml-6 list-disc">.*?<\/li>)*/gs,
      (match) => {
        return `<ul class="my-4">${match}</ul>`
      },
    )
    html = html.replace(
      /<li class="ml-6 list-decimal">.*?<\/li>(?:\s*<li class="ml-6 list-decimal">.*?<\/li>)*/gs,
      (match) => {
        return `<ol class="my-4">${match}</ol>`
      },
    )
    html = html.replace(
      /<li class="ml-2 flex items-start">.*?<\/li>(?:\s*<li class="ml-2 flex items-start">.*?<\/li>)*/gs,
      (match) => {
        return `<ul class="my-4 contains-task-list">${match}</ul>`
      },
    )

    return html
  }

  // Format code for the source view
  const formatCode = (code: string) => {
    return code.replace(/</g, "&lt;").replace(/>/g, "&gt;")
  }

  return (
    <Card className="w-full">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "preview" | "source")}>
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{fileName || "Markdown Preview"}</span>
          </div>
          <div className="flex items-center gap-2">
            <TabsList>
              <TabsTrigger value="preview" className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </TabsTrigger>
              <TabsTrigger value="source" className="flex items-center gap-1">
                <Code className="h-4 w-4" />
                <span>Source</span>
              </TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        <TabsContent value="preview" className="m-0">
          <ScrollArea className="h-[500px] md:h-[600px]">
            <div className="p-6">
              <div
                className={`prose ${isDarkTheme ? "dark" : ""} max-w-none`}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="source" className="m-0">
          <ScrollArea className="h-[500px] md:h-[600px]">
            <div className="p-6">
              <pre className="bg-muted p-4 rounded-md overflow-x-auto my-4 whitespace-pre-wrap">
                <code>{formatCode(content)}</code>
              </pre>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
