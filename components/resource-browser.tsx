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
// Import the Sparkles icon
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
  Plus,
  Eye,
  Download,
  Search,
  X,
  Upload,
  Sparkles,
} from "lucide-react"
import { useTrash } from "@/contexts/trash-context"
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
  description?: string
  tags?: string[]
}

interface ResourceBrowserProps {
  projectId: string
}

export function ResourceBrowser({ projectId }: ResourceBrowserProps) {
  const { addToTrash } = useTrash()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [resources, setResources] = useState<Resource[]>([
    {
      id: "res-1",
      name: "requirements.md",
      type: "file",
      fileType: "markdown",
      size: 12500,
      dateAdded: "2023-05-15T10:30:00Z",
      content: `# Project Requirements

## User Authentication
- Users should be able to register with email/password or OAuth
- Login functionality with remember me option
- Password reset flow
- Email verification
- Profile management

## Product Management
- Product listing with pagination
- Product details view
- Product search with filters
- Product categories and tags
- Product reviews and ratings

## Shopping Cart
- Add/remove items
- Update quantities
- Save for later
- Apply discount codes
- Shipping calculator

## Checkout Process
- Multi-step checkout
- Address management
- Payment integration
- Order summary
- Order confirmation

## Admin Dashboard
- Sales analytics
- Inventory management
- User management
- Order processing
- Content management

## Technical Requirements
- Responsive design for mobile and desktop
- SEO optimization
- Performance optimization (Core Web Vitals)
- Accessibility compliance (WCAG 2.1)
- Cross-browser compatibility

## Security Requirements
- Data encryption
- CSRF protection
- Input validation
- Rate limiting
- Regular security audits`,
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
    {
      id: "res-6",
      name: "data-schema.json",
      type: "file",
      fileType: "json",
      size: 8500,
      dateAdded: "2023-05-25T14:20:00Z",
    },
    {
      id: "res-7",
      name: "component-library.js",
      type: "file",
      fileType: "code",
      size: 25000,
      dateAdded: "2023-05-28T11:10:00Z",
    },
    {
      id: "res-8",
      name: "project-plan.md",
      type: "file",
      fileType: "markdown",
      size: 18200,
      dateAdded: "2023-06-01T09:30:00Z",
      content: `# Project Implementation Plan

## Phase 1: Setup & Foundation (2 weeks)
- [ ] Project repository setup
- [ ] CI/CD pipeline configuration
- [ ] Development environment setup
- [ ] Core architecture implementation
- [ ] Database schema design

## Phase 2: Core Features (4 weeks)
- [ ] User authentication system
- [ ] Product catalog implementation
- [ ] Shopping cart functionality
- [ ] Admin dashboard foundation
- [ ] API endpoints for core features

## Phase 3: Enhanced Features (3 weeks)
- [ ] Search and filtering
- [ ] Reviews and ratings
- [ ] Recommendations engine
- [ ] Wishlist functionality
- [ ] User profiles

## Phase 4: Checkout & Payments (2 weeks)
- [ ] Multi-step checkout process
- [ ] Payment gateway integration
- [ ] Order management
- [ ] Email notifications
- [ ] Invoice generation

## Phase 5: Testing & Optimization (3 weeks)
- [ ] Unit and integration testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Accessibility improvements
- [ ] SEO optimization

## Phase 6: Deployment & Launch (2 weeks)
- [ ] Staging environment setup
- [ ] User acceptance testing
- [ ] Documentation finalization
- [ ] Production deployment
- [ ] Post-launch monitoring

## Tech Stack
- Frontend: React with Next.js
- Backend: Node.js with Express
- Database: PostgreSQL
- Authentication: JWT with OAuth
- Hosting: Vercel
- CI/CD: GitHub Actions
- Testing: Jest and Cypress`,
    },
  ])

  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = useState(false)
  const [isAddFileDialogOpen, setIsAddFileDialogOpen] = useState(false)
  const [newLink, setNewLink] = useState({ name: "", url: "" })
  const [previewResource, setPreviewResource] = useState<Resource | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)

  const handleAddLink = () => {
    if (!newLink.name || !newLink.url) return

    const newResource: Resource = {
      id: `res-${Date.now()}`,
      name: newLink.name,
      type: "link",
      url: newLink.url,
      dateAdded: new Date().toISOString(),
    }

    setResources([...resources, newResource])
    setNewLink({ name: "", url: "" })
    setIsAddLinkDialogOpen(false)
  }

  const handleDeleteResource = (resource: Resource) => {
    // Remove from resources
    setResources(resources.filter((r) => r.id !== resource.id))

    // Add to trash
    addToTrash({
      id: resource.id,
      title: resource.name,
      type: "document",
      originalData: resource,
    })
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

  // Filter resources based on tab and search query
  const filteredResources = resources
    .filter((resource) => {
      if (activeTab === "all") return true
      if (activeTab === "files") return resource.type === "file"
      if (activeTab === "links") return resource.type === "link"
      if (activeTab === "markdown") return resource.type === "file" && resource.fileType === "markdown"
      if (activeTab === "code") return resource.type === "file" && resource.fileType === "code"
      if (activeTab === "images") return resource.type === "file" && resource.fileType === "image"
      return true
    })
    .filter((resource) => searchQuery === "" || resource.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Add an enhanceWithAI function
  const enhanceWithAI = (resource: Resource) => {
    // Simulate AI enhancement
    const enhancedResource = {
      ...resource,
      description: resource.description
        ? `${resource.description} (AI Enhanced)`
        : "AI enhanced resource with additional metadata and insights.",
      tags: [...(resource.tags || []), "ai-enhanced"],
    }

    setResources(resources.map((r) => (r.id === resource.id ? enhancedResource : r)))
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle>Project Resources</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setIsAddFileDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add File
            </Button>
            <Button size="sm" onClick={() => setIsAddLinkDialogOpen(true)}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Add Resource
            </Button>
          </div>
        </div>
        <div className="relative mt-2">
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
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
                      {/* In the UI section where the resource actions are displayed: */}
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => enhanceWithAI(resource)}
                          title="Enhance with AI"
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteResource(resource)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? `No resources found matching "${searchQuery}"`
                        : "No resources found in this category"}
                    </p>
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

      {/* Add File Dialog */}
      <Dialog open={isAddFileDialogOpen} onOpenChange={setIsAddFileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">Drag and drop a file here, or click to select</p>
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                <Badge variant="outline">Images</Badge>
                <Badge variant="outline">PDFs</Badge>
                <Badge variant="outline">Markdown</Badge>
                <Badge variant="outline">JSON</Badge>
                <Badge variant="outline">Code</Badge>
              </div>
              <Button variant="outline">Select File</Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAddFileDialogOpen(false)}>Cancel</Button>
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
