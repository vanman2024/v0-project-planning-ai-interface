"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Undo, Trash2, AlertTriangle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

// Define interfaces for different item types
export interface TrashItem {
  id: string
  title: string
  type: "requirement" | "task" | "document" | "other"
  deletedAt: string
  originalData: any
}

interface TrashManagerProps {
  isOpen: boolean
  onClose: () => void
  trashItems: TrashItem[]
  onRestoreItems: (items: TrashItem[]) => void
  onPermanentDelete: (items: TrashItem[]) => void
  onEmptyTrash: () => void
}

export function TrashManager({
  isOpen,
  onClose,
  trashItems,
  onRestoreItems,
  onPermanentDelete,
  onEmptyTrash,
}: TrashManagerProps) {
  const { toast } = useToast()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmEmptyTrash, setConfirmEmptyTrash] = useState(false)

  // Filter items based on active tab
  const filteredItems = activeTab === "all" ? trashItems : trashItems.filter((item) => item.type === activeTab)

  // Group items by date (today, yesterday, older)
  const groupedItems = filteredItems.reduce(
    (groups, item) => {
      const deletedDate = new Date(item.deletedAt)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      if (deletedDate.toDateString() === today.toDateString()) {
        groups.today.push(item)
      } else if (deletedDate.toDateString() === yesterday.toDateString()) {
        groups.yesterday.push(item)
      } else {
        groups.older.push(item)
      }

      return groups
    },
    { today: [] as TrashItem[], yesterday: [] as TrashItem[], older: [] as TrashItem[] },
  )

  // Calculate counts for tabs
  const requirementsCount = trashItems.filter((item) => item.type === "requirement").length
  const tasksCount = trashItems.filter((item) => item.type === "task").length
  const documentsCount = trashItems.filter((item) => item.type === "document").length
  const otherCount = trashItems.filter((item) => item.type === "other").length

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map((item) => item.id))
    }
  }

  const handleRestore = () => {
    const itemsToRestore = trashItems.filter((item) => selectedItems.includes(item.id))
    onRestoreItems(itemsToRestore)
    setSelectedItems([])
    toast({
      title: "Items restored",
      description: `${itemsToRestore.length} item(s) have been restored.`,
    })
  }

  const handlePermanentDelete = () => {
    const itemsToDelete = trashItems.filter((item) => selectedItems.includes(item.id))
    onPermanentDelete(itemsToDelete)
    setSelectedItems([])
    setConfirmDelete(false)
    toast({
      title: "Items permanently deleted",
      description: `${itemsToDelete.length} item(s) have been permanently deleted.`,
    })
  }

  const handleEmptyTrash = () => {
    onEmptyTrash()
    setConfirmEmptyTrash(false)
    toast({
      title: "Trash emptied",
      description: "All items have been permanently deleted.",
    })
  }

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "requirement":
        return <Badge variant="outline">Requirement</Badge>
      case "task":
        return <Badge variant="outline">Task</Badge>
      case "document":
        return <Badge variant="outline">Document</Badge>
      default:
        return <Badge variant="outline">Other</Badge>
    }
  }

  // Calculate auto-cleanup date (30 days from now)
  const getAutoCleanupDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 30)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Trash</DialogTitle>
            <DialogDescription>Items in trash will be automatically deleted after 30 days.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All ({trashItems.length})</TabsTrigger>
              <TabsTrigger value="requirement">Requirements ({requirementsCount})</TabsTrigger>
              <TabsTrigger value="task">Tasks ({tasksCount})</TabsTrigger>
              <TabsTrigger value="document">Documents ({documentsCount})</TabsTrigger>
            </TabsList>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Checkbox
                  id="select-all"
                  checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                  onCheckedChange={toggleSelectAll}
                  disabled={filteredItems.length === 0}
                />
                <Label htmlFor="select-all" className="ml-2">
                  Select all
                </Label>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRestore()}
                  disabled={selectedItems.length === 0}
                >
                  <Undo className="h-4 w-4 mr-1" />
                  Restore
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmDelete(true)}
                  disabled={selectedItems.length === 0}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>

            <TabsContent value={activeTab} className="m-0 flex-1 overflow-hidden">
              <ScrollArea className="h-[350px] pr-4">
                {filteredItems.length > 0 ? (
                  <div className="space-y-6">
                    {groupedItems.today.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">Today</h3>
                        <div className="space-y-2">
                          {groupedItems.today.map((item) => (
                            <div key={item.id} className="flex items-center border rounded-md p-3 hover:bg-muted/50">
                              <Checkbox
                                id={`item-${item.id}`}
                                checked={selectedItems.includes(item.id)}
                                onCheckedChange={() => toggleSelectItem(item.id)}
                              />
                              <div className="ml-3 flex-1">
                                <div className="font-medium">{item.title}</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  <span>Deleted: {formatDate(item.deletedAt)}</span>
                                </div>
                              </div>
                              <div className="ml-2">{getTypeIcon(item.type)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {groupedItems.yesterday.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">Yesterday</h3>
                        <div className="space-y-2">
                          {groupedItems.yesterday.map((item) => (
                            <div key={item.id} className="flex items-center border rounded-md p-3 hover:bg-muted/50">
                              <Checkbox
                                id={`item-${item.id}`}
                                checked={selectedItems.includes(item.id)}
                                onCheckedChange={() => toggleSelectItem(item.id)}
                              />
                              <div className="ml-3 flex-1">
                                <div className="font-medium">{item.title}</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  <span>Deleted: {formatDate(item.deletedAt)}</span>
                                </div>
                              </div>
                              <div className="ml-2">{getTypeIcon(item.type)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {groupedItems.older.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">Older</h3>
                        <div className="space-y-2">
                          {groupedItems.older.map((item) => (
                            <div key={item.id} className="flex items-center border rounded-md p-3 hover:bg-muted/50">
                              <Checkbox
                                id={`item-${item.id}`}
                                checked={selectedItems.includes(item.id)}
                                onCheckedChange={() => toggleSelectItem(item.id)}
                              />
                              <div className="ml-3 flex-1">
                                <div className="font-medium">{item.title}</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  <span>Deleted: {formatDate(item.deletedAt)}</span>
                                </div>
                              </div>
                              <div className="ml-2">{getTypeIcon(item.type)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    <Trash2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No items in trash</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <div className="text-xs text-muted-foreground mt-4 flex justify-between items-center">
            <div>Items in trash will be automatically deleted on {getAutoCleanupDate()}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmEmptyTrash(true)}
              disabled={trashItems.length === 0}
              className="text-destructive hover:text-destructive"
            >
              Empty Trash
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Permanent Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete {selectedItems.length} item(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handlePermanentDelete}>
              Permanently Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Empty Trash Dialog */}
      <Dialog open={confirmEmptyTrash} onOpenChange={setConfirmEmptyTrash}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Empty Trash</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete all {trashItems.length} items in the trash? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmEmptyTrash(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleEmptyTrash}>
              Empty Trash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
