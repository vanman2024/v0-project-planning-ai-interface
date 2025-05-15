"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  FileText,
  ImageIcon,
  Code,
  File,
  FileJson,
  FileTextIcon as FileMarkdown,
  LinkIcon,
  ExternalLink,
  Trash2,
  Eye,
  Download,
} from "lucide-react"
import { MarkdownPreview } from "./markdown-preview"

interface Resource {
  id: string
  name: string
  type: "file" | "link"
  fileType?: "image" | "pdf" | "markdown" | "json" | "code" | "document"
  url?: string
  size?: number
  dateAdded: string
  content?: string
}

interface ResourceManagerProps {
  projectId: string
}

export function ResourceManager({ projectId }: ResourceManagerProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [resources, setResources] = useState<Resource[]>([
    {
      id: "res-1",
      name: "requirements.md",
      type: "file",
      fileType: "markdown",
      size: 12500,
      dateAdded: "2023-05-15T10:30:00Z",
      content: `# Project Requirements Document

## Overview
This document outlines the requirements for the e-commerce platform project. The platform will provide a comprehensive online shopping experience with user authentication, product management, shopping cart, and checkout functionality.

## Functional Requirements

### User Authentication
- Users should be able to register with email/password
- Login functionality with remember me option
- Password reset flow
- Email verification
- Profile management

### Product Catalog
- Product listing with pagination
- Product details view
- Product search with filters
- Product categories and tags
- Product reviews and ratings

### Shopping Cart
- Add/remove items
- Update quantities
- Save for later
- Apply discount codes

### Checkout Process
- Multi-step checkout
- Address management
- Payment integration
- Order summary
- Order confirmation

## Non-Functional Requirements

### Performance
- Page load time < 2 seconds
- Support for 1000+ concurrent users
- 99.9% uptime

### Security
- Data encryption
- CSRF protection
- Input validation
- Regular security audits

### Compatibility
- Support for modern browsers
- Responsive design for mobile and desktop
- Accessibility compliance (WCAG 2.1)

## Technical Stack
- Frontend: React with Next.js
- Backend: Node.js with Express
- Database: PostgreSQL
- Authentication: JWT with OAuth
- Hosting: Vercel
- CI/CD: GitHub Actions`,
    },
    {
      id: "res-2",
      name: "architecture.pdf",
      type: "file",
      fileType: "pdf",
      size: 1250000,
      dateAdded: "2023-05-16T11:45:00Z",
    },
    {
      id: "res-3",
      name: "mockup.png",
      type: "file",
      fileType: "image",
      size: 450000,
      dateAdded: "2023-05-18T14:30:00Z",
    },
    {
      id: "res-4",
      name: "API Documentation",
      type: "link",
      url: "https://api.example.com/docs",
      dateAdded: "2023-05-20T16:20:00Z",
    },
    {
      id: "res-5",
      name: "Design System",
      type: "link",
      url: "https://design.example.com",
      dateAdded: "2023-05-22T09:15:00Z",
    },
  ])

  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = useState(false)
  const [newLink, setNewLink] = useState({ name: "", url: "" })
  const [previewResource, setPreviewResource] = useState<Resource | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)

  const handleAddLink = () => {
    if (!newLink.name || !newLink.url) return

    const newResource: Resource = {
      id: `res-${resources.length + 1}`,
      name: newLink.name,
      type: "link",
      url: newLink.url,
      dateAdded: new Date().toISOString(),
    }

    setResources([...resources, newResource])
    setNewLink({ name: "", url: "" })
    setIsAddLinkDialogOpen(false)
  }

  const handleDeleteResource = (id: string) => {
    setResources(resources.filter((resource) => resource.id !== id))
  }

  const handlePreviewResource = (resource: Resource) => {
    setIsLoadingPreview(true)
    setPreviewResource(resource)

    // Simulate loading the content if it's not already loaded
    if (resource.fileType === "markdown" && !resource.content) {
      setTimeout(() => {
        const updatedResources = resources.map((r) => {
          if (r.id === resource.id) {
            return {
              ...r,
              content: `# ${r.name}\n\nThis is a sample markdown content that would be loaded from the actual file.`,
            }
          }
          return r
        })

        setResources(updatedResources)
        setPreviewResource(updatedResources.find((r) => r.id === resource.id) || resource)
        setIsLoadingPreview(false)
      }, 1000)
    } else {
      setIsLoadingPreview(false)
    }
  }

  // Update the getResourceIcon function to handle null or undefined resources
  const getResourceIcon = (resource: Resource | null | undefined) => {
    if (!resource) return <File className="h-6 w-6 text-gray-500" />

    if (resource.type === "link") return <ExternalLink className="h-6 w-6 text-blue-500" />

    switch (resource.fileType) {
      case "image":
        return <ImageIcon className="h-6 w-6 text-blue-500" />
      case "pdf":
        return <FileText className="h-6 w-6 text-red-500" />
      case "markdown":
        return <FileMarkdown className="h-6 w-6 text-purple-500" />
      case "json":
        return <FileJson className="h-6 w-6 text-yellow-500" />
      case "code":
        return <Code className="h-6 w-6 text-green-500" />
      default:
        return <File className="h-6 w-6 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatSize = (bytes?: number) => {
    if (!bytes) return ""
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const filteredResources =
    activeTab === "all"
      ? resources
      : activeTab === "files"
        ? resources.filter((r) => r.type === "file")
        : resources.filter((r) => r.type === "link")

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>Project Resources</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setIsAddLinkDialogOpen(true)}>
            <LinkIcon className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All ({resources.length})</TabsTrigger>
            <TabsTrigger value="files">Files ({resources.filter((r) => r.type === "file").length})</TabsTrigger>
            <TabsTrigger value="links">Links ({resources.filter((r) => r.type === "link").length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="m-0">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50"
                    >
                      <div className="flex items-center">
                        {getResourceIcon(resource)}
                        <div className="ml-2">
                          <p className="font-medium">{resource.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="secondary">
                              {resource.type === "file" ? resource.fileType : "External Link"}
                            </Badge>
                            {resource.size && <span>{formatSize(resource.size)}</span>}
                            <span>Added: {formatDate(resource.dateAdded)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {resource.type === "link" ? (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handlePreviewResource(resource)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteResource(resource.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No resources found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Add Link Dialog */}
      <Dialog open={isAddLinkDialogOpen} onOpenChange={setIsAddLinkDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add External Link</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="link-name">Name</Label>
              <Input
                id="link-name"
                value={newLink.name}
                onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                placeholder="API Documentation"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="link-url">URL</Label>
              <Input
                id="link-url"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="https://example.com/docs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddLink} disabled={!newLink.name || !newLink.url}>
              Add Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resource Preview Dialog */}
      <Dialog open={!!previewResource} onOpenChange={() => setPreviewResource(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0">
          {previewResource?.fileType === "markdown" ? (
            <MarkdownPreview
              content={previewResource.content || ""}
              fileName={previewResource.name}
              isLoading={isLoadingPreview}
            />
          ) : previewResource?.fileType === "image" ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{previewResource.name}</span>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
              <div className="flex justify-center">
                <img
                  src="/generic-preview-screen.png"
                  alt={previewResource.name}
                  className="max-w-full h-auto rounded-md"
                />
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  {getResourceIcon(previewResource)}
                  <span className="font-medium">{previewResource?.name}</span>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Preview not available for this file type</p>
                <Button className="mt-4">Download to View</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
