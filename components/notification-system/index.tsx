"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotificationItem, type Notification } from "./notification-item"

interface NotificationSystemProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
}

export function NotificationSystem({ notifications, onMarkAsRead, onMarkAllAsRead }: NotificationSystemProps) {
  const [isOpen, setIsOpen] = useState(false)
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
            <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
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
                  onMarkAsRead={() => onMarkAsRead(notification.id)}
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
