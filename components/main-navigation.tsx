"use client"

import Link from "next/link"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { NotificationSystem } from "./notification-system"
import { siteConfig } from "@/config/site"

interface MainNavigationProps {
  currentView: string
  onChangeView: (view: string) => void
}

export function MainNavigation({ currentView, onChangeView }: MainNavigationProps) {
  return (
    <div className="border-r w-64 h-full hidden md:block">
      <div className="flex h-16 items-center border-b px-4 justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Icons.logo className="h-6 w-6" />
          <span className="font-bold">{siteConfig.name}</span>
        </Link>
        <div className="flex items-center gap-2">
          <NotificationSystem />
          <ThemeToggle />
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <nav className="space-y-1">
          <Button
            variant={currentView === "home" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onChangeView("home")}
          >
            <Icons.logo className="h-5 w-5 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={currentView === "projects" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onChangeView("projects")}
          >
            <Icons.logo className="h-5 w-5 mr-2" />
            Projects
          </Button>
          <Button
            variant={currentView === "tasks" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onChangeView("tasks")}
          >
            <Icons.logo className="h-5 w-5 mr-2" />
            Tasks
          </Button>
          <Button
            variant={currentView === "chat" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onChangeView("chat")}
          >
            <Icons.logo className="h-5 w-5 mr-2" />
            AI Chat
          </Button>
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t p-4">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32&query=user" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Jane Doe</p>
            <p className="text-xs text-muted-foreground">jane@example.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}
