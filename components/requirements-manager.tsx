"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2, Link, AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react"
import { RequirementTaskLinker } from "./requirement-task-linker"
import { useTrash } from "@/contexts/trash-context"

interface Requirement {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  status: "draft" | "approved" | "implemented" | "verified"
  type: "functional" | "non-functional" | "technical" | "business"
  linkedTasks?: string[]
  createdAt: string
  updatedAt: string
}

interface RequirementsManagerProps {
  projectId: string
}

export function RequirementsManager({ projectId }: RequirementsManagerProps) {
  const { addToTrash, trashItems, restoreItems } = useTrash()

  // In a real app, this would be fetched from an API based on the projectId
  const [requirements, setRequirements] = useState<Requirement[]>([
    {
      id: "req-1",
      title: "User Authentication",
      description: "Users should be able to register, login, and manage their accounts",
      priority: "high",
      status: "implemented",
      type: "functional",
      linkedTasks: ["task-1", "task-2"],
      createdAt: "2023-05-15T10:30:00Z",
      updatedAt: "2023-06-10T14:20:00Z",
    },
    {
      id: "req-2",
      title: "Product Catalog",
      description: "System should display products with filtering and sorting options",
      priority: "high",
      status: "approved",
      type: "functional",
      linkedTasks: ["task-4"],
      createdAt: "2023-05-16T11:45:00Z",
      updatedAt: "2023-05-20T09:15:00Z",
    },
    {
      id: "req-3",
      title: "Shopping Cart",
      description: "Users should be able to add products to cart and proceed to checkout",
      priority: "medium",
      status: "draft",
      type: "functional",
      createdAt: "2023-05-18T14:30:00Z",
      updatedAt: "2023-05-18T14:30:00Z",
    },
    {
      id: "req-4",
      title: "System Performance",
      description: "System should handle at least 1000 concurrent users with response time under 2 seconds",
      priority: "medium",
      status: "draft",
      type: "non-functional",
      createdAt: "2023-05-20T16:20:00Z",
      updatedAt: "2023-05-20T16:20:00Z",
    },
  ])

  const [activeTab, setActiveTab] = useState("all")
  const [newRequirement, setNewRequirement] = useState<Partial<Requirement>>({
    title: "",
    description: "",
    priority: "medium",
    status: "draft",
    type: "functional",
  })
  const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [viewingRequirement, setViewingRequirement] = useState<Requirement | null>(null)

  const handleAddRequirement = () => {
    const newReq: Requirement = {
      id: `req-${requirements.length + 1}`,
      title: newRequirement.title || "",
      description: newRequirement.description || "",
      priority: newRequirement.priority as "high" | "medium" | "low",
      status: newRequirement.status as "draft" | "approved" | "implemented" | "verified",
      type: newRequirement.type as "functional" | "non-functional" | "technical" | "business",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setRequirements([...requirements, newReq])
    setNewRequirement({
      title: "",
      description: "",
      priority: "medium",
      status: "draft",
      type: "functional",
    })
    setIsAddDialogOpen(false)
  }

  const handleUpdateRequirement = () => {
    if (!editingRequirement) return

    setRequirements(
      requirements.map((req) =>
        req.id === editingRequirement.id ? { ...editingRequirement, updatedAt: new Date().toISOString() } : req,
      ),
    )
    setEditingRequirement(null)
    setIsEditDialogOpen(false)
  }

  const handleDeleteRequirement = (requirement: Requirement) => {
    // Remove from active requirements
    setRequirements(requirements.filter((req) => req.id !== requirement.id))

    // Add to trash
    addToTrash({
      id: requirement.id,
      title: requirement.title,
      type: "requirement",
      originalData: requirement,
    })
  }

  // Handle restoring a requirement from trash
  const handleRestoreRequirement = (requirementId: string) => {
    const trashItem = trashItems.find((item) => item.id === requirementId && item.type === "requirement")

    if (trashItem) {
      // Add back to requirements
      setRequirements([...requirements, trashItem.originalData])

      // Remove from trash
      restoreItems([trashItem])
    }
  }

  const filteredRequirements = activeTab === "all" ? requirements : requirements.filter((req) => req.type === activeTab)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "implemented":
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />
      case "approved":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>
      default:
        return <Badge>Unknown</Badge>
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

  const openTasksDialog = (requirement: Requirement) => {
    setViewingRequirement(requirement)
    setIsLinkDialogOpen(true)
  }

  // Get deleted requirements from trash
  const deletedRequirements = trashItems.filter((item) => item.type === "requirement")

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>Project Requirements</CardTitle>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Requirement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Requirement</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newRequirement.title || ""}
                    onChange={(e) => setNewRequirement({ ...newRequirement, title: e.target.value })}
                    placeholder="Enter requirement title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newRequirement.description || ""}
                    onChange={(e) => setNewRequirement({ ...newRequirement, description: e.target.value })}
                    placeholder="Describe the requirement in detail"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newRequirement.type}
                      onValueChange={(value) => setNewRequirement({ ...newRequirement, type: value as any })}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="functional">Functional</SelectItem>
                        <SelectItem value="non-functional">Non-Functional</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newRequirement.priority}
                      onValueChange={(value) => setNewRequirement({ ...newRequirement, priority: value as any })}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newRequirement.status}
                      onValueChange={(value) => setNewRequirement({ ...newRequirement, status: value as any })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="implemented">Implemented</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddRequirement} disabled={!newRequirement.title}>
                  Add Requirement
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Requirement</DialogTitle>
            </DialogHeader>
            {editingRequirement && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingRequirement.title}
                    onChange={(e) => setEditingRequirement({ ...editingRequirement, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingRequirement.description}
                    onChange={(e) => setEditingRequirement({ ...editingRequirement, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-type">Type</Label>
                    <Select
                      value={editingRequirement.type}
                      onValueChange={(value) => setEditingRequirement({ ...editingRequirement, type: value as any })}
                    >
                      <SelectTrigger id="edit-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="functional">Functional</SelectItem>
                        <SelectItem value="non-functional">Non-Functional</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select
                      value={editingRequirement.priority}
                      onValueChange={(value) =>
                        setEditingRequirement({ ...editingRequirement, priority: value as any })
                      }
                    >
                      <SelectTrigger id="edit-priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editingRequirement.status}
                      onValueChange={(value) => setEditingRequirement({ ...editingRequirement, status: value as any })}
                    >
                      <SelectTrigger id="edit-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="implemented">Implemented</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleUpdateRequirement}>Update Requirement</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">All ({requirements.length})</TabsTrigger>
            <TabsTrigger value="functional">
              Functional ({requirements.filter((r) => r.type === "functional").length})
            </TabsTrigger>
            <TabsTrigger value="non-functional">
              Non-Functional ({requirements.filter((r) => r.type === "non-functional").length})
            </TabsTrigger>
            <TabsTrigger value="technical">
              Technical ({requirements.filter((r) => r.type === "technical").length})
            </TabsTrigger>
            <TabsTrigger value="business">
              Business ({requirements.filter((r) => r.type === "business").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="m-0">
            <div className="space-y-4">
              {filteredRequirements.length > 0 ? (
                filteredRequirements.map((req) => (
                  <div key={req.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(req.status)}
                        <h3 className="font-medium text-lg">{req.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(req.priority)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingRequirement(req)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openTasksDialog(req)}>
                          <Link className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteRequirement(req)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-3">{req.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span className="capitalize">{req.type}</span>
                      </div>
                      {req.linkedTasks && req.linkedTasks.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Link className="h-4 w-4" />
                          <span>{req.linkedTasks.length} linked tasks</span>
                        </div>
                      )}
                      <div>
                        <span>Updated: {formatDate(req.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No requirements found in this category</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div>Total: {requirements.length} requirements</div>
        <div className="flex gap-4">
          <div>Draft: {requirements.filter((r) => r.status === "draft").length}</div>
          <div>Approved: {requirements.filter((r) => r.status === "approved").length}</div>
          <div>Implemented: {requirements.filter((r) => r.status === "implemented").length}</div>
          <div>Verified: {requirements.filter((r) => r.status === "verified").length}</div>
        </div>
      </CardFooter>
      {viewingRequirement && (
        <RequirementTaskLinker
          isOpen={isLinkDialogOpen}
          onClose={() => setIsLinkDialogOpen(false)}
          requirementId={viewingRequirement.id}
          requirementTitle={viewingRequirement.title}
          requirementDescription={viewingRequirement.description}
        />
      )}
    </Card>
  )
}
