"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertTriangle, AlertCircle, Info, ChevronUp, ChevronDown } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

export type NotificationType = "error" | "warning" | "success" | "info"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  timestamp: string
  status: "read" | "unread"
  expandable?: boolean
  details?: string
}

// Sample notifications data
const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "error",
    title: "Test failed",
    description: "3 tests failed in integration suite",
    timestamp: "2025-05-27T04:01:56.111Z",
    status: "unread",
    expandable: true,
    details:
      "The following tests failed:\nUserAuthTest.testInvalidCredentials,\nFeatureCardTest.testEmptyState,\nDashboardTest.testFilterByDate.\nCheck the CI logs for more details.",
  },
  {
    id: "2",
    type: "warning",
    title: "Deployment pending",
    description: "Waiting for approval to deploy",
    timestamp: "2025-05-27T03:45:12.111Z",
    status: "unread",
    expandable: false,
  },
  {
    id: "3",
    type: "info",
    title: "New AI suggestion",
    description: "Optimization for your dashboard code",
    timestamp: "2025-05-27T05:01:56.111Z",
    status: "unread",
    expandable: true,
    details:
      "We've analyzed your dashboard code and found potential optimizations that could improve performance by up to 35%. Consider implementing lazy loading for chart components and memoizing expensive calculations.",
  },
  {
    id: "4",
    type: "success",
    title: "Build successful",
    description: "feature-7001-dark-theme completed",
    timestamp: "2025-05-27T04:41:56.111Z",
    status: "unread",
    expandable: false,
  },
  {
    id: "5",
    type: "info",
    title: "Weekly report available",
    description: "Your project performance summary is ready",
    timestamp: "2025-05-26T14:30:00.000Z",
    status: "read",
    expandable: false,
  },
]

export function NotificationSystem() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [activeFilter, setActiveFilter] = useState("all")
  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const notificationRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => n.status === "unread").length

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, status: "read" as const } : notification,
      ),
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, status: "read" as const })))
  }

  const toggleNotification = (id: string) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const expandAll = () => {
    setExpandedIds(notifications.filter((n) => n.expandable).map((n) => n.id))
  }

  const collapseAll = () => {
    setExpandedIds([])
  }

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    const diffDays = Math.round(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Filter notifications based on the selected filter
  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") return true
    if (activeFilter === "unread") return notification.status === "unread"
    return notification.type === activeFilter
  })

  return (
    <div className="relative" ref={notificationRef}>
      <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(!isOpen)}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[400px] max-h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden z-50 border">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Notifications</h3>
              {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount} new</Badge>}
            </div>
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
              Mark all as read
            </Button>
          </div>

          <div className="border-b">
            <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Unread
                </TabsTrigger>
                <TabsTrigger value="error" className="flex-1">
                  Errors
                </TabsTrigger>
                <TabsTrigger value="warning" className="flex-1">
                  Warnings
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <ScrollArea className="max-h-[400px]">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-20" />
                <p className="font-medium">No notifications</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              <div>
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "border-b last:border-b-0 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
                      notification.status === "unread" ? "bg-blue-50 dark:bg-blue-950" : "",
                    )}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{notification.title}</h4>
                              {notification.status === "unread" && (
                                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                              )}
                            </div>
                            {notification.expandable && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => toggleNotification(notification.id)}
                              >
                                {expandedIds.includes(notification.id) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-muted-foreground">{formatDate(notification.timestamp)}</p>
                            {notification.status === "unread" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                Mark as read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {notification.expandable && expandedIds.includes(notification.id) && notification.details && (
                        <div className="mt-2 ml-8 mr-2 p-3 text-sm bg-gray-50 dark:bg-gray-800 rounded-md">
                          <p className="whitespace-pre-line">{notification.details}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {filteredNotifications.length > 0 && (
            <div className="p-3 border-t flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={expandAll}>
                  Expand all
                </Button>
                <Button variant="ghost" size="sm" onClick={collapseAll}>
                  Collapse all
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
