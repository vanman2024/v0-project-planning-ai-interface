"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Edit, Save, X, Plus, Trash2 } from "lucide-react"

interface ProjectDocumentationProps {
  projectData: {
    name: string
    description: string
    techStack: string[]
    projectType: string
    categories: string[]
    requirements: string[]
    architecture: string
  }
  isEditing: boolean
  onEdit: () => void
  onSave: (updates: any) => void
  onCancel: () => void
}

export function ProjectDocumentation({ projectData, isEditing, onEdit, onSave, onCancel }: ProjectDocumentationProps) {
  const [editedData, setEditedData] = useState({ ...projectData })
  const [activeTab, setActiveTab] = useState("overview")
  const [newTech, setNewTech] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [newRequirement, setNewRequirement] = useState("")

  const handleInputChange = (field: string, value: any) => {
    setEditedData({ ...editedData, [field]: value })
  }

  const addTechStack = () => {
    if (newTech.trim() && !editedData.techStack.includes(newTech.trim())) {
      setEditedData({
        ...editedData,
        techStack: [...editedData.techStack, newTech.trim()],
      })
      setNewTech("")
    }
  }

  const removeTechStack = (tech: string) => {
    setEditedData({
      ...editedData,
      techStack: editedData.techStack.filter((t) => t !== tech),
    })
  }

  const addCategory = () => {
    if (newCategory.trim() && !editedData.categories.includes(newCategory.trim())) {
      setEditedData({
        ...editedData,
        categories: [...editedData.categories, newCategory.trim()],
      })
      setNewCategory("")
    }
  }

  const removeCategory = (category: string) => {
    setEditedData({
      ...editedData,
      categories: editedData.categories.filter((c) => c !== category),
    })
  }

  const addRequirement = () => {
    if (newRequirement.trim() && !editedData.requirements.includes(newRequirement.trim())) {
      setEditedData({
        ...editedData,
        requirements: [...editedData.requirements, newRequirement.trim()],
      })
      setNewRequirement("")
    }
  }

  const removeRequirement = (requirement: string) => {
    setEditedData({
      ...editedData,
      requirements: editedData.requirements.filter((r) => r !== requirement),
    })
  }

  const handleSave = () => {
    onSave(editedData)
  }

  // Project type options
  const projectTypes = [
    { id: "web-app", name: "Web Application" },
    { id: "mobile-app", name: "Mobile Application" },
    { id: "desktop-app", name: "Desktop Application" },
    { id: "api", name: "API / Backend Service" },
    { id: "e-commerce", name: "E-Commerce" },
    { id: "blog", name: "Blog / Content Site" },
    { id: "dashboard", name: "Dashboard / Analytics" },
    { id: "game", name: "Game" },
    { id: "other", name: "Other" },
  ]

  // Get project type name
  const getProjectTypeName = (id: string) => {
    const projectType = projectTypes.find((type) => type.id === id)
    return projectType ? projectType.name : id
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-2xl">
            {isEditing ? (
              <Input
                value={editedData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="text-2xl font-bold h-auto py-1"
              />
            ) : (
              projectData.name
            )}
          </CardTitle>
          <CardDescription>
            {isEditing ? (
              <select
                value={editedData.projectType}
                onChange={(e) => handleInputChange("projectType", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 text-sm"
              >
                {projectTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            ) : (
              getProjectTypeName(projectData.projectType)
            )}
          </CardDescription>
        </div>

        <div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-2">
              <Label>Project Description</Label>
              {isEditing ? (
                <Textarea
                  value={editedData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={5}
                />
              ) : (
                <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">{projectData.description}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2">
                {(isEditing ? editedData.categories : projectData.categories).map((category) => (
                  <Badge key={category} variant="secondary" className="flex items-center gap-1">
                    {category}
                    {isEditing && (
                      <button
                        onClick={() => removeCategory(category)}
                        className="ml-1 rounded-full hover:bg-muted p-0.5"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {category}</span>
                      </button>
                    )}
                  </Badge>
                ))}

                {isEditing && (
                  <div className="flex gap-2 mt-2 w-full">
                    <Input
                      placeholder="Add category..."
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addCategory()}
                    />
                    <Button type="button" size="sm" onClick={addCategory}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Technology Stack</Label>
              <div className="flex flex-wrap gap-2">
                {(isEditing ? editedData.techStack : projectData.techStack).map((tech) => (
                  <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    {isEditing && (
                      <button onClick={() => removeTechStack(tech)} className="ml-1 rounded-full hover:bg-muted p-0.5">
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {tech}</span>
                      </button>
                    )}
                  </Badge>
                ))}

                {isEditing && (
                  <div className="flex gap-2 mt-2 w-full">
                    <Input
                      placeholder="Add technology..."
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTechStack()}
                    />
                    <Button type="button" size="sm" onClick={addTechStack}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-4">
            <div className="space-y-2">
              <Label>Project Requirements</Label>
              <div className="space-y-2">
                {(isEditing ? editedData.requirements : projectData.requirements).map((requirement, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 rounded-md bg-muted">
                    <div className="flex-1">{requirement}</div>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRequirement(requirement)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {isEditing && (
                  <div className="flex gap-2 mt-4">
                    <Input
                      placeholder="Add requirement..."
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addRequirement()}
                    />
                    <Button type="button" onClick={addRequirement}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-4">
            <div className="space-y-2">
              <Label>Architecture Overview</Label>
              {isEditing ? (
                <Textarea
                  value={editedData.architecture}
                  onChange={(e) => handleInputChange("architecture", e.target.value)}
                  rows={10}
                />
              ) : (
                <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">{projectData.architecture}</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">Generated from imported resources and agent conversations</div>

        {isEditing && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
