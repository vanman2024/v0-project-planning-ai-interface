"use client"

import { useState } from "react"
import { ChatArea } from "./chat-area"
import { ThreadPanel } from "./thread-panel"
import { ThreadSidebar } from "./thread-sidebar"
import { ProjectSelector } from "./project-selector"

export function ThreadedChat() {
  const [isThreadOpen, setIsThreadOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="w-64 border-r flex flex-col h-full">
          <ProjectSelector />
          <ThreadSidebar />
        </div>
      )}

      {/* Main chat area - fixed width to prevent shifting */}
      <div className="flex-1 flex flex-col h-full overflow-hidden" style={{ flex: "1 0 0%" }}>
        <ChatArea onOpenThread={() => setIsThreadOpen(true)} />
      </div>

      {/* Thread panel - absolute positioning to prevent layout shifts */}
      {isThreadOpen && (
        <div
          className="border-l h-full overflow-hidden"
          style={{
            width: "400px",
            position: "absolute",
            right: "0",
            top: "0",
            bottom: "0",
            zIndex: 10,
            background: "var(--background)",
            boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <ThreadPanel onClose={() => setIsThreadOpen(false)} />
        </div>
      )}
    </div>
  )
}
