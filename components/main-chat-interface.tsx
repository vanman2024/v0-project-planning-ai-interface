"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useUnifiedChat } from "@/contexts/unified-chat-context"
import { ThreadSidebar } from "./unified-chat/thread-sidebar"
import { ChatArea } from "./unified-chat/chat-area"

export function MainChatInterface() {
  const searchParams = useSearchParams()
  const projectParam = searchParams.get("project")
  const { setActiveProjectId } = useUnifiedChat()

  // Set the active project from URL parameters if provided
  useEffect(() => {
    if (projectParam) {
      setActiveProjectId(projectParam)
    }
  }, [projectParam, setActiveProjectId])

  return (
    <div className="border rounded-lg overflow-hidden h-[calc(100vh-8rem)]">
      <div className="flex h-full">
        <ThreadSidebar showProjectSelector={true} />
        <div className="flex-1">
          <ChatArea showProjectInfo={true} />
        </div>
      </div>
    </div>
  )
}
