"use client"

import { ThreadedChat } from "@/components/threaded-chat"
import { ChatProvider } from "@/contexts/chat-context"
import { ThreadProvider } from "@/contexts/thread-context"
import { ProjectProvider } from "@/contexts/project-context"

export default function ChatPage() {
  return (
    <div className="container py-6">
      <ProjectProvider>
        <ChatProvider>
          <ThreadProvider>
            <ThreadedChat />
          </ThreadProvider>
        </ChatProvider>
      </ProjectProvider>
    </div>
  )
}
