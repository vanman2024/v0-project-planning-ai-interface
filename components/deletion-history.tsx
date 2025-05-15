"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Trash2, RotateCcw, Clock } from "lucide-react"

interface DeletionHistoryProps {
  history: Array<{
    action: "deleted" | "restored" | "permanently_deleted"
    items: Array<{
      id: string
      title: string
      type: string
    }>
    timestamp: string
  }>
}

export function DeletionHistory({ history }: DeletionHistoryProps) {
  const [activeTab, setActiveTab] = useState("all")

  const filteredHistory = activeTab === "all" ? history : history.filter((entry) => entry.action === activeTab)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "deleted":
        return <Trash2 className="h-4 w-4 text-red-500" />
      case "restored":
        return <RotateCcw className="h-4 w-4 text-green-500" />
      case "permanently_deleted":
        return <Trash2 className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const getActionText = (action: string) => {
    switch (action) {
      case "deleted":
        return "Moved to trash"
      case "restored":
        return "Restored"
      case "permanently_deleted":
        return "Permanently deleted"
      default:
        return action
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deletion History</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All Actions</TabsTrigger>
            <TabsTrigger value="deleted">Deleted</TabsTrigger>
            <TabsTrigger value="restored">Restored</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="m-0">
            <ScrollArea className="h-[400px]">
              {filteredHistory.length > 0 ? (
                <div className="space-y-4">
                  {filteredHistory.map((entry, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getActionIcon(entry.action)}
                          <span className="font-medium">{getActionText(entry.action)}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(entry.timestamp)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {entry.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-muted/50 rounded-sm p-2">
                            <span className="text-sm">{item.title}</span>
                            <Badge variant="outline">{item.type}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8">
                  <p className="text-muted-foreground">No history found</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
