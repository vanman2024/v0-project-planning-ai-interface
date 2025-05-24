"use client"

import { useState } from "react"
import { ThreadSidebar } from "./thread-sidebar"
import { ChatArea } from "./chat-area"
import { ThreadPanel } from "./thread-panel"
import { Resizer } from "@/components/ui/resizer"
import { ProjectSelector } from "./project-selector"

export function ThreadedChat() {
  const [showThreadPanel, setShowThreadPanel] = useState(false)
  const [threadPanelWidth, setThreadPanelWidth] = useState(320)
  const [sidebarWidth, setSidebarWidth] = useState(260)

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background border rounded-lg overflow-hidden">
      {/* Project selector header */}
      <div className="border-b p-2 flex items-center">
        <ProjectSelector />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar with channels/threads */}
        <div style={{ width: `${sidebarWidth}px` }} className="flex-shrink-0 border-r">
          <ThreadSidebar />
        </div>

        {/* Resizer for sidebar */}
        <Resizer
          direction="horizontal"
          onResize={(delta) => setSidebarWidth((prev) => Math.max(200, Math.min(400, prev + delta)))}
        />

        {/* Main chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatArea onOpenThread={() => setShowThreadPanel(true)} />
        </div>

        {/* Thread panel (right sidebar) */}
        {showThreadPanel && (
          <>
            <Resizer
              direction="horizontal"
              onResize={(delta) => setThreadPanelWidth((prev) => Math.max(280, Math.min(600, prev - delta)))}
            />
            <div style={{ width: `${threadPanelWidth}px` }} className="flex-shrink-0 border-l">
              <ThreadPanel onClose={() => setShowThreadPanel(false)} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
