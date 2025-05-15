"use client"

import { ThreadSidebar } from "./thread-sidebar"
import { ChatArea } from "./chat-area"

interface UnifiedChatProps {
  compact?: boolean
  showProjectSelector?: boolean
}

export function UnifiedChat({ compact = false, showProjectSelector = false }: UnifiedChatProps) {
  return (
    <div className={`border rounded-lg overflow-hidden ${compact ? "h-[600px]" : "h-[800px]"}`}>
      <div className="flex h-full">
        <ThreadSidebar compact={compact} />
        <div className="flex-1">
          <ChatArea compact={compact} showProjectSelector={showProjectSelector} />
        </div>
      </div>
    </div>
  )
}
