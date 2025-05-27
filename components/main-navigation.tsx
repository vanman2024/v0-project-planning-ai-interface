"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, FolderKanban, MessageSquare, CheckSquare, Settings, Menu, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface MainNavigationProps {
  currentView: string
  onChangeView: (view: string) => void
}

export function MainNavigation({ currentView, onChangeView }: MainNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    {
      name: "Home",
      icon: Home,
      view: "home",
      description: "Dashboard & Overview",
    },
    {
      name: "Projects",
      icon: FolderKanban,
      view: "projects",
      description: "Manage Your Projects",
    },
    {
      name: "Tasks",
      icon: CheckSquare,
      view: "tasks",
      description: "Your To-Do List",
    },
    {
      name: "AI Assistant",
      icon: MessageSquare,
      view: "chat",
      description: "Get Help From AI",
    },
    {
      name: "Settings",
      icon: Settings,
      view: "settings",
      description: "Customize Your Experience",
    },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-col h-screen w-64 border-r bg-slate-50 dark:bg-slate-900">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-blue-600">🧠</span> Project Planner
          </h1>
          <p className="text-sm text-muted-foreground">AI-Powered Project Management</p>
        </div>

        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.view}
                  variant={currentView === item.view ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left h-auto py-3",
                    currentView === item.view ? "bg-blue-600 hover:bg-blue-700" : "",
                  )}
                  onClick={() => onChangeView(item.view)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs font-normal opacity-70">{item.description}</div>
                  </div>
                </Button>
              )
            })}
          </nav>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40&query=user" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Jane Doe</p>
              <p className="text-xs text-muted-foreground">jane@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-blue-600">🧠</span> Project Planner
          </h1>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <span className="text-blue-600">🧠</span> Project Planner
                    </h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">AI-Powered Project Management</p>
                </div>

                <div className="flex-1 overflow-auto py-4">
                  <nav className="space-y-1 px-2">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Button
                          key={item.view}
                          variant={currentView === item.view ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-start text-left h-auto py-3",
                            currentView === item.view ? "bg-blue-600 hover:bg-blue-700" : "",
                          )}
                          onClick={() => {
                            onChangeView(item.view)
                            setIsMobileMenuOpen(false)
                          }}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          <div>
                            <div>{item.name}</div>
                            <div className="text-xs font-normal opacity-70">{item.description}</div>
                          </div>
                        </Button>
                      )
                    })}
                  </nav>
                </div>

                <div className="p-4 border-t">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40&query=user" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Jane Doe</p>
                      <p className="text-xs text-muted-foreground">jane@example.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  )
}
