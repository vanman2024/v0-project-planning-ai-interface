"use client"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, AlertCircle, Info, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

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

interface NotificationItemProps {
  notification: Notification
  onToggle: () => void
  onMarkAsRead: () => void
}

export function NotificationItem({ notification, onToggle, onMarkAsRead }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
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
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  return (
    <div
      className={cn(
        "border-b last:border-b-0 transition-colors",
        notification.isRead ? "bg-white dark:bg-gray-900" : "bg-blue-50 dark:bg-blue-950",
      )}
    >
      <div className="p-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{notification.title}</h4>
                {!notification.isRead && <span className="h-2 w-2 rounded-full bg-blue-500"></span>}
              </div>
              {notification.details && (
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onToggle}>
                  {notification.isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatDate(notification.timestamp)}</p>

            {!notification.isExpanded && notification.details && (
              <Button variant="ghost" size="sm" className="mt-1 h-6 px-2 text-xs" onClick={onMarkAsRead}>
                Mark as read
              </Button>
            )}
          </div>
        </div>

        {notification.details && notification.isExpanded && (
          <div className="mt-2 pl-8 pr-2 pb-2 text-sm border-t pt-2 bg-gray-50 dark:bg-gray-800 rounded">
            <p className="whitespace-pre-line">{notification.details}</p>
            <div className="flex justify-end mt-2">
              <Button variant="outline" size="sm" onClick={onMarkAsRead}>
                Mark as read
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
