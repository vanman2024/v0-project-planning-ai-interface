"use client"

import { useEffect } from "react"
import { useUnifiedChat } from "@/contexts/unified-chat-context"
import { ProjectChatSidebar } from "./project-chat-sidebar"
import { ChatArea } from "./unified-chat/chat-area"

interface ProjectChatProps {
  projectId: string
}

export function ProjectChat({ projectId }: ProjectChatProps) {
  const { setActiveProjectId } = useUnifiedChat()

  // Set the active project when the component mounts or projectId changes
  useEffect(() => {
    setActiveProjectId(projectId)
  }, [projectId, setActiveProjectId])

  return (
    <div className="border rounded-lg overflow-hidden h-[600px]">
      <div className="flex h-full">
        <ProjectChatSidebar projectId={projectId} />
        <div className="flex-1">
          <ChatArea compact={true} />
        </div>
      </div>
    </div>
  )
}
