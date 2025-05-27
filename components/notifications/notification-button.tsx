"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"
import { NotificationPanel } from "./notification-panel"
import { useClickAway } from "../../hooks/use-click-away"
import type { Notification } from "./notification-item"

// Sample notifications data
const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Test failed",
    message: "3 tests failed in integration suite",
    timestamp: "2025-05-27T04:01:56.111Z",
    type: "error",
    isRead: false,
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
]

export function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const notificationRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  useClickAway(notificationRef, () => {
    if (isOpen) setIsOpen(false)
  })

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

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

      <NotificationPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </div>
  )
}
