import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { TrashProvider } from "@/contexts/trash-context"
import { ProjectProvider } from "@/contexts/project-context"
import { ThreadProvider } from "@/contexts/thread-context"
import { ChatProvider } from "@/contexts/chat-context"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TrashProvider>
            <ProjectProvider>
              <ThreadProvider>
                <ChatProvider>
                  {children}
                  <Toaster />
                </ChatProvider>
              </ThreadProvider>
            </ProjectProvider>
          </TrashProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
