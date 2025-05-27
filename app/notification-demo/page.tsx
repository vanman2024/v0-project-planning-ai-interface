"use client"

import { useState } from "react"
import { NotificationSystem } from "@/components/notification-system"
import { Button } from "@/components/ui/button"
import type { Notification } from "@/components/notification-system/notification-item"

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

export default function NotificationDemo() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

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

  // Function to add a new notification (for demo purposes)
  const addNotification = () => {
    const newNotification: Notification = {
      id: `${Date.now()}`,
      type: ["error", "warning", "success", "info"][Math.floor(Math.random() * 4)] as Notification["type"],
      title: "New notification",
      description: "This is a new notification that was just created",
      timestamp: new Date().toISOString(),
      status: "unread",
      expandable: Math.random() > 0.5,
    }

    setNotifications((prev) => [newNotification, ...prev])
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Notification System Demo</h1>

        <div className="flex justify-between items-center mb-8">
          <Button onClick={addNotification}>Add Random Notification</Button>
          <NotificationSystem
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Click the bell icon to see notifications.</p>
          <p>You can mark individual notifications as read or mark all as read.</p>
          <p>Try adding new notifications with the button above.</p>
        </div>
      </div>
    </div>
  )
}
