"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotificationItem, type Notification } from "./notification-item"

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
  const [activeFilter, setActiveFilter] = useState("7d")
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

  // Filter notifications based on the selected time period
  const filteredNotifications = notifications.filter((notification) => {
    const notificationDate = new Date(notification.timestamp)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60 * 24))

    if (activeFilter === "7d") return daysDiff <= 7
    if (activeFilter === "30d") return daysDiff <= 30
    if (activeFilter === "90d") return daysDiff <= 90

    return true
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
        <div className="absolute right-0 mt-2 w-[380px] max-h-[600px] bg-white dark:bg-gray-900 rounded-md shadow-lg overflow-hidden z-50 border">
          <div className="p-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Notifications</h3>
              {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount} new</Badge>}
            </div>
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          </div>

          <div className="border-b">
            <Tabs defaultValue="7d" value={activeFilter} onValueChange={setActiveFilter}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="7d">7d</TabsTrigger>
                <TabsTrigger value="30d">30d</TabsTrigger>
                <TabsTrigger value="90d">90d</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="overflow-y-auto max-h-[400px]">
            {filteredNotifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No notifications in this time period</div>
            ) : (
              filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  expanded={expandedIds.includes(notification.id)}
                  onToggle={() => toggleNotification(notification.id)}
                  onMarkAsRead={() => handleMarkAsRead(notification.id)}
                />
              ))
            )}
          </div>

          {filteredNotifications.length > 0 && (
            <div className="p-2 border-t flex items-center justify-center gap-4">
              <Button variant="ghost" size="sm" onClick={expandAll}>
                Expand all
              </Button>
              <span className="text-muted-foreground">|</span>
              <Button variant="ghost" size="sm" onClick={collapseAll}>
                Collapse all
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
