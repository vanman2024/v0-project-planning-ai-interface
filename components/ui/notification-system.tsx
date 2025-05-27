"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Bell, CheckCircle, AlertTriangle, AlertCircle, Info, ChevronUp, ChevronDown, Search, X } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

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
  {
    id: "6",
    type: "success",
    title: "PR approved",
    description: "Your pull request #123 has been approved",
    timestamp: "2025-05-26T10:15:00.000Z",
    status: "read",
    expandable: false,
  },
  {
    id: "7",
    type: "warning",
    title: "Memory usage high",
    description: "Server memory usage exceeds 80%",
    timestamp: "2025-05-25T22:30:00.000Z",
    status: "read",
    expandable: false,
  },
  {
    id: "8",
    type: "error",
    title: "API rate limit exceeded",
    description: "External API rate limit reached",
    timestamp: "2025-05-25T18:45:00.000Z",
    status: "read",
    expandable: true,
    details:
      "The GitHub API rate limit has been exceeded. Please wait until the rate limit resets or use a different token.",
  },
  {
    id: "9",
    type: "info",
    title: "New feature available",
    description: "Try our new AI-powered code suggestions",
    timestamp: "2025-05-25T14:20:00.000Z",
    status: "read",
    expandable: false,
  },
  {
    id: "10",
    type: "success",
    title: "Database backup completed",
    description: "Weekly backup finished successfully",
    timestamp: "2025-05-25T08:10:00.000Z",
    status: "read",
    expandable: false,
  },
]

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.7);
  }
`

export function NotificationSystem() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [activeFilter, setActiveFilter] = useState("all")
  const [expandedIds, setExpandedIds] = useState<string[]>([])
  const notificationRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const unreadCount = notifications.filter((n) => n.status === "unread").length

  // Add custom scrollbar styles
  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.textContent = scrollbarStyles
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

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
    // First apply the tab filter
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "unread" && notification.status === "unread") ||
      notification.type === activeFilter

    if (!matchesFilter) return false

    // Then apply search if there's a query
    if (searchQuery.trim() === "") return true

    const query = searchQuery.toLowerCase()
    return (
      notification.title.toLowerCase().includes(query) ||
      notification.description.toLowerCase().includes(query) ||
      (notification.details && notification.details.toLowerCase().includes(query))
    )
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
        <div className="absolute right-0 mt-2 w-[400px] h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden z-50 border">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Notifications</h3>
                {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount} new</Badge>}
              </div>
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                Mark all as read
              </Button>
            </div>

            {/* Tabs */}
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
            {/* Search Bar */}
            <div className="border-b p-2 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full h-9"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Scrollable Notification List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-20" />
                  {searchQuery ? (
                    <>
                      <p className="font-medium">No matching notifications</p>
                      <p className="text-sm">Try a different search term</p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium">No notifications</p>
                      <p className="text-sm">You're all caught up!</p>
                    </>
                  )}
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
            </div>

            {/* Footer */}
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
        </div>
      )}
    </div>
  )
}
