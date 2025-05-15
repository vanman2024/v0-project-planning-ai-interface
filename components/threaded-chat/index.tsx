"use client"

import { ChatProvider } from "@/contexts/chat-context"
import { ThreadSidebar } from "./thread-sidebar"
import { ChatArea } from "./chat-area"

export function ThreadedChat() {
  return (
    <ChatProvider>
      <div className="flex h-[calc(100vh-4rem)] border rounded-lg overflow-hidden">
        <ThreadSidebar />
        <div className="flex-1">
          <ChatArea />
        </div>
      </div>
    </ChatProvider>
  )
}
