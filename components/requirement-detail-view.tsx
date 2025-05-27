"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  FileText,
  Link,
  CheckSquare,
  AlertCircle,
  Calendar,
  Users,
  MessageSquare,
  Paperclip,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RequirementDetailViewProps {
  requirement: any
  onBack: () => void
}

export function RequirementDetailView({ requirement, onBack }: RequirementDetailViewProps) {
  // Sample linked items
  const linkedItems = [
    {
      id: "feature-1",
      name: "User Authentication",
      type: "feature",
      status: "in-progress",
    },
    {
      id: "feature-2",
      name: "Account Management",
      type: "feature",
      status: "pending",
    },
  ]

  // Sample comments
  const comments = [
    {
      id: "comment-1",
      author: "Sarah",
      date: "2 days ago",
      content: "This is a critical requirement for our security compliance.",
    },
    {
      id: "comment-2",
      author: "Mike",
      date: "1 day ago",
      content: "I've started implementing this in the authentication module.",
    },
  ]

  // Sample attachments
  const attachments = [
    {
      id: "attachment-1",
      name: "Security_Guidelines.pdf",
      size: "2.4 MB",
      date: "Added 3 days ago",
    },
    {
      id: "attachment-2",
      name: "Authentication_Flow.png",
      size: "1.1 MB",
      date: "Added 2 days ago",
    },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <h2 className="text-2xl font-bold">{requirement.name}</h2>
            </div>
            <Badge variant="outline" className="text-sm">
              Requirement 📋
            </Badge>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="flex-1 flex flex-col">
        <div className="border-b">
          <TabsList className="p-0 h-auto">
            <TabsTrigger value="details" className="rounded-none py-2 px-4">
              <FileText className="w-4 h-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger value="linked-items" className="rounded-none py-2 px-4">
              <Link className="w-4 h-4 mr-2" />
              Linked Items
            </TabsTrigger>
            <TabsTrigger value="discussion" className="rounded-none py-2 px-4">
              <MessageSquare className="w-4 h-4 mr-2" />
              Discussion
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <TabsContent value="details" className="p-4 m-0 h-full">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What This Means</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {requirement.description ||
                      "Users must be able to create accounts and log in securely using email/password or social login options. This includes password recovery and account verification."}
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      Priority
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge
                      className="text-sm px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-none"
                      variant="outline"
                    >
                      🔥 High Priority
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      This is critical for the project and should be addressed first
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-green-500" />
                      Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge
                      className="text-sm px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-none"
                      variant="outline"
                    >
                      ✅ Approved
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      This requirement has been reviewed and approved by stakeholders
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Added</p>
                      <p className="font-medium">October 15, 2023</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-medium">November 2, 2023</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Needed By</p>
                      <p className="font-medium">December 10, 2023</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    People
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Requested By</p>
                      <p className="font-medium">Product Team</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Assigned To</p>
                      <p className="font-medium">Development Team</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Approved By</p>
                      <p className="font-medium">Sarah (Product Manager)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="linked-items" className="p-4 m-0 h-full">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Link className="w-5 h-5 text-blue-500" />
                    Features Using This Requirement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {linkedItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                item.status === "completed"
                                  ? "bg-green-500"
                                  : item.status === "in-progress"
                                    ? "bg-blue-500"
                                    : "bg-gray-400"
                              }`}
                            />
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {item.type === "feature" ? "Feature 🎨" : item.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="discussion" className="p-4 m-0 h-full">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-green-500" />
                    Comments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-medium">{comment.author}</p>
                          <p className="text-xs text-muted-foreground">{comment.date}</p>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Paperclip className="w-5 h-5 text-purple-500" />
                    Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Paperclip className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{attachment.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">{attachment.size}</p>
                            <p className="text-xs text-muted-foreground">{attachment.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
