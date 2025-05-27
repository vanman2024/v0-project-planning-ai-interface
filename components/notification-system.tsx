"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotificationItem } from "./notification-item"
import { useClickAway } from "../hooks/use-click-away"

export type NotificationType = "error" | "warning" | "success" | "info"

export interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  type: NotificationType
  isRead: boolean
  isExpanded?: boolean
  details?: string
}

export function NotificationSystem() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Test failed",
      message: "3 tests failed in integration suite",
      timestamp: "2025-05-27T04:01:56.111Z",
      type: "error",
      isRead: false,
      isExpanded: false,
      details:
        "The following tests failed: UserAuthTest.testInvalidCredentials, FeatureCardTest.testEmptyState, DashboardTest.testFilterByDate. Check the CI logs for more details.",
    },
    {
      id: "2",
      title: "Build successful",
      message: "feature-7001-dark-theme completed",
      timestamp: "2025-05-27T04:41:56.111Z",
      type: "success",
      isRead: false,
    },
    {
      id: "3",
      title: "New AI suggestion",
      message: "Optimization for your dashboard code",
      timestamp: "2025-05-27T05:01:56.111Z",
      type: "info",
      isRead: false,
    },
    {
      id: "4",
      title: "Deployment pending",
      message: "Waiting for approval to deploy",
      timestamp: "2025-05-27T03:30:56.111Z",
      type: "warning",
      isRead: true,
    },
  ])
  const [activeFilter, setActiveFilter] = useState("7d")
  const notificationRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  useClickAway(notificationRef, () => {
    if (isOpen) setIsOpen(false)
  })

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isExpanded: !notification.isExpanded } : notification,
      ),
    )
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const collapseAll = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isExpanded: false })))
  }

  const expandAll = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isExpanded: true })))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
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
        <div className="absolute right-0 mt-2 w-[400px] max-h-[600px] bg-white dark:bg-gray-900 rounded-md shadow-lg overflow-hidden z-50 border">
          <div className="p-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Notifications</h3>
              {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount} new</Badge>}
            </div>
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
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
                  onToggle={() => toggleNotification(notification.id)}
                  onMarkAsRead={() => markAsRead(notification.id)}
                />
              ))
            )}
          </div>

          <div className="p-2 border-t flex items-center justify-center gap-4">
            <Button variant="ghost" size="sm" onClick={expandAll}>
              Expand all
            </Button>
            <span className="text-muted-foreground">|</span>
            <Button variant="ghost" size="sm" onClick={collapseAll}>
              Collapse all
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
